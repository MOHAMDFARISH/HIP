import React, { useState, useEffect, useRef } from 'react';
import PaymentDetails from './PaymentDetails';

interface OrderData {
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    number_of_copies: number;
    status: string;
}

interface OrderPaymentPageProps {
    trackingNumber: string;
}

const OrderPaymentPage: React.FC<OrderPaymentPageProps> = ({ trackingNumber }) => {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for receipt upload
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/get-order-for-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trackingNumber }),
                });
                const result = await response.json();
                if (!response.ok) {
                    if (response.status === 403) {
                       throw new Error(`This order link is no longer active. Current status: ${result.status.replace('_', ' ')}.`);
                    }
                    throw new Error(result.message || 'Could not find your order.');
                }
                setOrderData(result.order);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (trackingNumber) {
            fetchOrder();
        }
    }, [trackingNumber]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                setUploadError('File size must not exceed 5MB.'); return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(selectedFile.type)) {
                setUploadError('Please upload a valid image or PDF file.'); return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setUploadError(null);
        }
    };

    const handleUploadSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file || !orderData) {
            setUploadError('Please select a receipt file to upload.'); return;
        }
        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const data = new FormData();
        data.append('receipt', file);
        data.append('trackingNumber', orderData.tracking_number);
        data.append('email', orderData.customer_email);

        try {
            const response = await fetch('/api/upload-receipt', { method: 'POST', body: data });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Upload failed.');
            setUploadSuccess(true);
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20">Loading order details...</div>;
        }
        if (error) {
            return (
                <div className="my-8 text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-lg mx-auto">
                    <p><strong>Error:</strong> {error}</p>
                    <p className="mt-2 text-sm">Please check your link or track your order manually.</p>
                </div>
            );
        }
        if (uploadSuccess) {
            return (
                 <div className="text-center py-20 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-3xl font-bold font-heading text-green-800">Receipt Uploaded!</h2>
                    <p className="mt-4 text-lg text-green-700 max-w-2xl mx-auto">
                        Thank you! We have received your payment receipt. Our team will verify it within 24 hours, and you will receive a final confirmation email once it's approved.
                    </p>
                </div>
            )
        }
        if (orderData) {
            return (
                <>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Complete Your Pre-Order</h2>
                        <p className="mt-4 text-lg text-dark-slate/70">
                            Welcome, {orderData.customer_name}. Please finalize your order below.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        <div className="space-y-6">
                            <div className="p-6 rounded-lg bg-sand/80 border border-coral/30">
                                <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">Order Summary</h3>
                                <div className="space-y-2 text-dark-slate/90">
                                    <div className="flex justify-between items-center"><span className="font-semibold">Tracking Number:</span><span className="font-mono text-coral">{orderData.tracking_number}</span></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold">Copies Ordered:</span><span>{orderData.number_of_copies}</span></div>
                                </div>
                            </div>
                            <div className="p-6 rounded-lg bg-white/60 border border-coral/30">
                                <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">
                                    <span className="text-coral">Step 1:</span> Upload Receipt
                                </h3>
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
                            </div>
                        </div>
                        <PaymentDetails
                            title="Step 2: Payment Details"
                            description="Please transfer to one of the accounts below, then upload a digital copy of your receipt."
                        />
                    </div>
                </>
            );
        }
        return null;
    };
    
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div 
                    className="max-w-6xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-coral/20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default OrderPaymentPage;
