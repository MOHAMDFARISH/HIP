import React, { useState, useRef, useEffect, useCallback } from 'react';

// Checkmark icon for valid fields
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 text-green-500 ${className || ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const PreOrderSection: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        shippingAddress: '',
        copies: '1',
        joinEvent: false,
        bringGuest: false,
    });
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [fileName, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    // Environment variables for payment details with fallbacks
    const bankName = process.env.BANK_NAME || 'Bank of Maldives';
    const accountHolderName = process.env.ACCOUNT_HOLDER_NAME || 'Mariyam Hawla';
    const usdAccountNumber = process.env.USD_ACCOUNT_NUMBER || '7770000081709';
    const mvrAccountNumber = process.env.MVR_ACCOUNT_NUMBER || '7704240648101';

    const handleCopy = (account: string) => {
        navigator.clipboard.writeText(account.replace(/\s/g, ''));
        setCopiedAccount(account);
        setTimeout(() => setCopiedAccount(null), 2000);
    };

    const validate = useCallback(() => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone Number is required.';
        } else if (!/^\+?[\d\s-]{7,20}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number.';
        }
        if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping Address is required.';
        if (!formData.copies || parseInt(formData.copies, 10) < 1) newErrors.copies = 'You must order at least 1 copy.';
        if (!file) {
            newErrors.receipt = 'Payment receipt is required.';
        } else {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.receipt = 'File size must not exceed 5MB.';
            }
            if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
                newErrors.receipt = 'Please upload a valid image or PDF file.';
            }
        }
        return newErrors;
    }, [formData, file]);

    useEffect(() => {
        const validationErrors = validate();
        setErrors(validationErrors);
    }, [formData, file, validate]);
    
    useEffect(() => {
        if (isSubmitted) {
            window.scrollTo(0, 0);
        }
    }, [isSubmitted]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: inputValue }));
        if (name === 'joinEvent' && !checked) {
            setFormData(prev => ({...prev, bringGuest: false}));
        }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // FIX: The `name` variable was undefined. Using `e.target.name` to get the field name.
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTouched(prev => ({...prev, receipt: true}));
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFileName(selectedFile.name);
            setFile(selectedFile);
        } else {
            setFileName(null);
            setFile(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);
        setTouched({
            fullName: true, email: true, phone: true,
            shippingAddress: true, copies: true, receipt: true
        });
        const formErrors = validate();
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;
        if (isLoading || !file) return;

        setIsLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, String(formData[key as keyof typeof formData]));
        });
        data.append('receipt', file);

        try {
            const response = await fetch('/api/submit-order', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }
            
            setTrackingNumber(result.trackingNumber);
            setIsSubmitted(true);

        } catch (error: any) {
            setSubmitError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetForm = () => {
        setIsSubmitted(false);
        setTrackingNumber(null);
        setFormData({ fullName: '', email: '', phone: '', shippingAddress: '', copies: '1', joinEvent: false, bringGuest: false });
        setFile(null);
        setFileName(null);
        setErrors({});
        setTouched({});
        setSubmitError(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const renderConfirmationMessage = () => (
        <div className="text-center p-8 bg-sand/80 rounded-lg shadow-inner border border-coral/30">
            <h3 className="font-heading text-3xl font-semibold text-dark-slate mb-4">Thank You! Your Submission is Received.</h3>
            <p className="text-dark-slate/80 mb-6">
                We've received your pre-order submission and are now verifying your payment details. You will receive a separate, official confirmation email once your order is approved.
            </p>
            <div className="bg-white/70 p-4 rounded-lg border border-coral/20 max-w-md mx-auto">
                <p className="text-sm font-semibold text-dark-slate/90">Your Order Tracking Number:</p>
                <p className="text-2xl font-bold font-mono text-coral tracking-wider my-2">{trackingNumber}</p>
                <p className="text-xs text-dark-slate/70">Please save this number. You can use it to track your order status.</p>
            </div>
            {formData.joinEvent && (
                <p className="text-dark-slate/80 font-semibold mt-6">
                    {`We have also provisionally reserved your spot ${formData.bringGuest ? "(+1 guest) " : ""}for the exclusive book signing event, pending confirmation!`}
                </p>
            )}
            <button
                onClick={resetForm}
                className="mt-8 bg-coral text-white font-bold py-2 px-6 rounded-md shadow-lg hover:bg-opacity-90 transition-all duration-300"
            >
                Submit Another Order
            </button>
        </div>
    );
    
    const CopyButton: React.FC<{ text: string }> = ({ text }) => (
        <button type="button" onClick={() => handleCopy(text)} className="ml-2 px-2 py-1 text-xs font-semibold text-coral bg-sand rounded hover:bg-coral/20 transition-colors">
            {copiedAccount === text ? 'Copied!' : 'Copy'}
        </button>
    );

    const isFormInvalid = Object.keys(errors).length > 0;

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
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Pre-Order 'Heal in Paradise'</h2>
                        <p className="mt-4 text-lg text-dark-slate/70 max-w-3xl mx-auto">
                            Secure your collector's edition and get a chance to meet the author at the exclusive launch event.
                        </p>
                    </div>

                    {isSubmitted ? renderConfirmationMessage() : (
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="p-6 rounded-lg bg-sand/80 border border-coral/50 shadow-lg">
                            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">
                                <span className="text-coral">Step 1:</span> Make Your Payment
                            </h3>
                            <div className="border-b border-coral/30 pb-4 mb-4">
                                <div className="flex justify-end items-baseline">
                                    <p className="text-2xl font-bold text-coral font-body">$25 / MVR 369</p>
                                </div>
                                <p className="text-sm text-dark-slate/80 mt-1 text-right">Collector's Edition • Includes shipping within Maldives</p>
                            </div>
                            <p className="text-dark-slate/80 mb-4">Please transfer to one of the accounts below and save a digital copy of your receipt.</p>
                            <div className="p-4 bg-white/60 rounded-md space-y-3 text-sm text-dark-slate/90 border border-coral/20">
                                <p><span className="font-semibold">Bank:</span> {bankName}</p>
                                <p><span className="font-semibold">Account Name:</span> {accountHolderName}</p>
                                <div className="flex items-center justify-between">
                                    <p>USD Account: <span className="font-mono bg-white/90 px-2 py-1 rounded select-all">{usdAccountNumber}</span></p>
                                    <CopyButton text={usdAccountNumber} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p>MVR Account: <span className="font-mono bg-white/90 px-2 py-1 rounded select-all">{mvrAccountNumber}</span></p>
                                    <CopyButton text={mvrAccountNumber} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-lg bg-white/60 border border-coral/30">
                            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">
                                <span className="text-coral">Step 2:</span> Complete Your Order
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                                <fieldset className="space-y-4">
                                    <legend className="font-heading text-lg font-semibold text-dark-slate/90 mb-2">Contact & Shipping</legend>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-dark-slate">Full Name</label>
                                        <div className="relative mt-1">
                                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} required className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-dark-slate ${touched.fullName && errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-coral focus:ring-coral'}`} />
                                            {touched.fullName && !errors.fullName && formData.fullName && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><CheckIcon /></div>}
                                        </div>
                                        {touched.fullName && errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-dark-slate">Email Address</label>
                                             <div className="relative mt-1">
                                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-dark-slate ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-coral focus:ring-coral'}`} />
                                                {touched.email && !errors.email && formData.email && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><CheckIcon /></div>}
                                            </div>
                                            {touched.email && errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-dark-slate">Phone Number</label>
                                            <div className="relative mt-1">
                                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} required className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-dark-slate ${touched.phone && errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-coral focus:ring-coral'}`} />
                                                {touched.phone && !errors.phone && formData.phone && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><CheckIcon /></div>}
                                            </div>
                                            {touched.phone && errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-dark-slate">Shipping Address</label>
                                        <textarea id="shippingAddress" name="shippingAddress" rows={3} value={formData.shippingAddress} onChange={handleChange} onBlur={handleBlur} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-dark-slate ${touched.shippingAddress && errors.shippingAddress ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-coral focus:ring-coral'}`}></textarea>
                                        {touched.shippingAddress && errors.shippingAddress && <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>}
                                    </div>
                                </fieldset>

                                <fieldset className="space-y-4">
                                    <legend className="font-heading text-lg font-semibold text-dark-slate/90 mb-2">Order Details</legend>
                                    <div>
                                        <label htmlFor="copies" className="block text-sm font-medium text-dark-slate">Number of Copies</label>
                                        <input type="number" id="copies" name="copies" min="1" value={formData.copies} onChange={handleChange} onBlur={handleBlur} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-dark-slate ${touched.copies && errors.copies ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-coral focus:ring-coral'}`} />
                                        {touched.copies && errors.copies && <p className="mt-1 text-sm text-red-600">{errors.copies}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-slate">Upload Payment Receipt</label>
                                        <div className="mt-1">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-dark-slate bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral truncate ${touched.receipt && errors.receipt ? 'border-red-500' : 'border-gray-300'}`}>
                                                {fileName || 'Choose File (JPG, PNG, PDF - max 5MB)'}
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/jpg, application/pdf" required />
                                        </div>
                                        {touched.receipt && !errors.receipt && file && <div className="mt-2 text-sm text-green-600 flex items-center"><CheckIcon className="mr-2" />Receipt uploaded successfully.</div>}
                                        {touched.receipt && errors.receipt && <p className="mt-1 text-sm text-red-600">{errors.receipt}</p>}
                                    </div>
                                </fieldset>
                                
                                <fieldset className="p-4 border border-coral/30 rounded-lg bg-sand/50 space-y-4">
                                    <div className="font-heading text-lg font-semibold text-dark-slate/90">Exclusive Book Signing (OCT 28, 2025)</div>
                                    <div className="flex items-start">
                                        <input id="joinEvent" name="joinEvent" type="checkbox" checked={formData.joinEvent} onChange={handleChange} className="h-4 w-4 text-coral border-gray-300 rounded focus:ring-coral mt-1" />
                                        <label htmlFor="joinEvent" className="ml-3 block text-sm font-medium text-dark-slate">Yes! I want to join the book signing event.</label>
                                    </div>
                                    {formData.joinEvent && (
                                        <div className="pl-7 space-y-4 transition-all duration-300 ease-in-out">
                                            <div className="flex items-start">
                                                <input id="bringGuest" name="bringGuest" type="checkbox" checked={formData.bringGuest} onChange={handleChange} className="h-4 w-4 text-coral border-gray-300 rounded focus:ring-coral mt-1" />
                                                <label htmlFor="bringGuest" className="ml-3 block text-sm text-dark-slate">I'd like to bring a guest (+1).</label>
                                            </div>
                                             <div className="p-3 bg-white/60 rounded-lg border border-coral/20 text-sm text-dark-slate/90">
                                                <p className="font-bold mb-2">You're invited!</p>
                                                <ul className="list-none space-y-1">
                                                    <li><strong className="font-semibold">Date:</strong> October 28, 2025</li>
                                                    <li><strong className="font-semibold">Includes:</strong> Tea, and a meet & greet with the author.</li>
                                                    <li><strong className="font-semibold">Venue:</strong> The location will be shared in your order confirmation email.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-center text-sm font-medium text-dark-slate/80 pt-4 border-t border-coral/20">
                                       Please note: Pre-order deliveries will begin after the book signing event on October 28th, 2025.
                                    </p>
                                </fieldset>
                                
                                <div>
                                    {submitError && (
                                        <div className="my-4 text-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                            <p><strong>Submission Failed:</strong> {submitError}</p>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading || isFormInvalid}
                                        className="w-full bg-coral text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Pre-Order'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PreOrderSection;