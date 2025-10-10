import React, { useState, useEffect, useRef } from 'react';
import PaymentDetails from './PaymentDetails';

// Define the type for the order data
interface OrderData {
    created_at: string;
    tracking_number: string;
    customer_name: string;
    shipping_address: string;
    number_of_copies: number;
    status: string;
    join_event: boolean;
    bring_guest: boolean;
}

interface OrderTrackingSectionProps {
    initialInfo: { trackingNumber: string; email: string } | null;
    setInitialInfo: (info: null) => void;
}

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const statusText = status.replace(/_/g, ' ');
    const statusStyles: { [key: string]: { text: string, bg: string, dot: string } } = {
        pending_payment: { text: 'text-orange-800', bg: 'bg-orange-100', dot: 'bg-orange-500' },
        pending: { text: 'text-yellow-800', bg: 'bg-yellow-100', dot: 'bg-yellow-500' },
        processing: { text: 'text-blue-800', bg: 'bg-blue-100', dot: 'bg-blue-500' },
        shipped: { text: 'text-green-800', bg: 'bg-green-100', dot: 'bg-green-500' },
        delivered: { text: 'text-emerald-800', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
        cancelled: { text: 'text-red-800', bg: 'bg-red-100', dot: 'bg-red-500' },
    };

    const style = statusStyles[status.toLowerCase()] || statusStyles.pending;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.text} ${style.bg}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${style.dot}`}></span>
            {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        </span>
    );
};

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({ initialInfo, setInitialInfo }) => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [email, setEmail] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for receipt upload form
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearchSubmit = async (searchTrackingNumber: string, searchEmail: string) => {
        setError(null);
        setOrderData(null);
        setUploadSuccess(false);

        if (!searchTrackingNumber.trim() || !searchEmail.trim()) {
            setError('Please enter both your Tracking Number and Email Address.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/track-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingNumber: searchTrackingNumber, email: searchEmail }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Could not find your order.');
            setOrderData(result.order);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialInfo) {
            setTrackingNumber(initialInfo.trackingNumber);
            setEmail(initialInfo.email);
            handleSearchSubmit(initialInfo.trackingNumber, initialInfo.email);
            setInitialInfo(null); // Clear after use
        }
    }, [initialInfo, setInitialInfo]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                setUploadError('File size must not exceed 5MB.');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(selectedFile.type)) {
                setUploadError('Please upload a valid image or PDF file.');
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setUploadError(null);
        }
    };

    const handleUploadSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file || !orderData) {
            setUploadError('Please select a receipt file to upload.');
            return;
        }
        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const data = new FormData();
        data.append('receipt', file);
        data.append('trackingNumber', orderData.tracking_number);
        data.append('email', email);

        try {
            const response = await fetch('/api/upload-receipt', { method: 'POST', body: data });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Upload failed.');
            setUploadSuccess(true);
            // Refresh order data to show new status
            await handleSearchSubmit(trackingNumber, email);
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center mt-8">Loading order details...</div>;
        }
        if (error) {
            return (
                <div className="mt-8 text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-lg mx-auto">
                    <p>{error}</p>
                </div>
            );
        }
        if (orderData) {
            // VIEW FOR PENDING PAYMENT
            if (orderData.status === 'pending_payment') {
                return (
                    <>
                        <div className="mt-12 bg-sand/80 p-8 rounded-lg shadow-inner border border-coral/30 text-center">
                            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-2">Order Confirmed!</h3>
                             <p className="text-dark-slate/80 mb-4">Your order details are saved. Please complete payment to finalize.</p>
                             <p><span className="font-semibold">Tracking Number:</span> <span className="font-mono text-coral">{orderData.tracking_number}</span></p>
                        </div>
                        <PaymentDetails
                            title={<><span className="text-coral">Step 2:</span> Make Your Payment</>}
                            description="Please transfer to one of the accounts below and upload a digital copy of your receipt."
                        />
                        <div className="mt-12 p-6 rounded-lg bg-white/60 border border-coral/30">
                            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">
                                <span className="text-coral">Step 3:</span> Upload Receipt
                            </h3>
                            {uploadSuccess ? (
                                <div className="text-center text-green-700 bg-green-100 p-4 rounded-md">
                                    <p className="font-semibold">Receipt uploaded successfully!</p>
                                    <p>Your order is now being verified.</p>
                                </div>
                            ) : (
                            <form onSubmit={handleUploadSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-slate">Payment Receipt File</label>
                                    <div className="mt-1">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-dark-slate bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral truncate ${uploadError ? 'border-red-500' : 'border-gray-300'}`}>
                                            {fileName || 'Choose File (JPG, PNG, PDF - max 5MB)'}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/jpg, application/pdf" required />
                                    </div>
                                    {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
                                </div>
                                <button type="submit" disabled={isUploading || !file} className="w-full bg-coral text-white font-bold py-3 px-4 rounded-md text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed">
                                    {isUploading ? 'Uploading...' : 'Submit Receipt'}
                                </button>
                            </form>
                            )}
                        </div>
                    </>
                );
            }
            // DEFAULT VIEW FOR OTHER STATUSES
            return (
                <div className="mt-12 bg-sand/80 p-8 rounded-lg shadow-inner border border-coral/30">
                    <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">Order Details</h3>
                    <div className="space-y-4 text-dark-slate/90">
                        <div className="flex justify-between items-center"><span className="font-semibold">Status:</span><StatusIndicator status={orderData.status} /></div>
                        <hr className="border-coral/20" />
                        <div className="flex justify-between items-center"><span className="font-semibold">Tracking Number:</span><span className="font-mono text-coral">{orderData.tracking_number}</span></div>
                        <div className="flex justify-between items-center"><span className="font-semibold">Order Placed:</span><span>{new Date(orderData.created_at).toLocaleDateString()}</span></div>
                        <div className="flex justify-between items-center"><span className="font-semibold">Copies Ordered:</span><span>{orderData.number_of_copies}</span></div>
                        <div className="flex flex-col text-left"><span className="font-semibold mb-1">Shipping To:</span><p className="text-sm leading-tight whitespace-pre-line">{orderData.customer_name}<br />{orderData.shipping_address}</p></div>
                        {orderData.join_event && (<div className="flex justify-between items-center pt-2"><span className="font-semibold">Book Signing Event:</span><span>Registered {orderData.bring_guest ? '(+1 Guest)' : ''}</span></div>)}
                    </div>
                    <div className="mt-8 pt-6 border-t border-coral/30">
                        <h4 className="font-heading text-xl font-semibold text-dark-slate mb-4 text-center">Estimated Timeline</h4>
                        <p className="text-center text-dark-slate/80 text-sm">Pre-order deliveries will commence after the book signing event on <strong>October 28th, 2025</strong>.</p>
                    </div>
                </div>
            );
        }
        return null; // No order data, show nothing but the form
    };

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-coral/20" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Track Your Pre-Order</h2>
                        <p className="mt-4 text-lg text-dark-slate/70">Enter your tracking number and email to check your order status or complete your payment.</p>
                    </div>

                    {!orderData && (
                    <div className="max-w-lg mx-auto bg-white/60 p-8 rounded-lg shadow-md border border-coral/20">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(trackingNumber, email); }} className="space-y-6">
                            <div>
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-dark-slate">Tracking Number</label>
                                <input type="text" id="trackingNumber" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())} required className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder:font-mono focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate font-mono" placeholder="e.g., HIP-2025-ABCDE" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark-slate">Email Address</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate" placeholder="The email you used to order" />
                            </div>
                            <div>
                                <button type="submit" disabled={isLoading} className="w-full bg-coral text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed">
                                    {isLoading ? 'Searching...' : 'Track Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                    )}
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default OrderTrackingSection;