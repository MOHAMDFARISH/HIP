import React, { useState } from 'react';

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

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const statusStyles: { [key: string]: { text: string, bg: string, dot: string } } = {
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};


const OrderTrackingSection: React.FC = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [email, setEmail] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setOrderData(null);

        if (!trackingNumber.trim() || !email.trim()) {
            setError('Please enter both your Tracking Number and Email Address.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/track-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackingNumber, email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Could not find your order. Please check the details and try again.');
            }
            
            setOrderData(result.order);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div 
                    className="max-w-4xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-coral/20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Track Your Pre-Order</h2>
                        <p className="mt-4 text-lg text-dark-slate/70">
                            Enter your tracking number and email to check the status of your order.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto bg-white/60 p-8 rounded-lg shadow-md border border-coral/20">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-dark-slate">Tracking Number</label>
                                <input 
                                    type="text" 
                                    id="trackingNumber" 
                                    value={trackingNumber} 
                                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())} 
                                    required 
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder:font-mono focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate font-mono"
                                    placeholder="e.g., HIP-2025-ABCDE"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark-slate">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate"
                                    placeholder="The email you used to order"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-coral text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Searching...
                                        </>
                                    ) : (
                                        'Track Order'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {error && (
                        <div className="mt-8 text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-lg mx-auto">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {orderData && (
                        <div className="mt-12 bg-sand/80 p-8 rounded-lg shadow-inner border border-coral/30">
                            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">Order Details</h3>
                            <div className="space-y-4 text-dark-slate/90">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Status:</span>
                                    <StatusIndicator status={orderData.status} />
                                </div>
                                <hr className="border-coral/20" />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Tracking Number:</span>
                                    <span className="font-mono text-coral">{orderData.tracking_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Order Placed:</span>
                                    <span>{new Date(orderData.created_at).toLocaleDateString()}</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="font-semibold">Copies Ordered:</span>
                                    <span>{orderData.number_of_copies}</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-semibold mb-1">Shipping To:</span>
                                    <p className="text-sm leading-tight whitespace-pre-line">{orderData.customer_name}<br />{orderData.shipping_address}</p>
                                </div>
                                {orderData.join_event && (
                                     <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold">Book Signing Event:</span>
                                        <span>Registered {orderData.bring_guest ? '(+1 Guest)' : ''}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 pt-6 border-t border-coral/30">
                                <h4 className="font-heading text-xl font-semibold text-dark-slate mb-4 text-center">Estimated Timeline</h4>
                                <p className="text-center text-dark-slate/80 text-sm">
                                    Pre-order deliveries will commence after the book signing event on <strong>October 28th, 2025</strong>. We appreciate your patience and support!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrderTrackingSection;
