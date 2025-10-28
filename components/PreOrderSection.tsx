import React, { useState, useEffect, useCallback } from 'react';
import PaymentDetails from './PaymentDetails';

// Define grecaptcha from the reCAPTCHA script
declare const grecaptcha: any;
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';


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

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-coral ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [submittedTrackingNumber, setSubmittedTrackingNumber] = useState<string | null>(null);
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
   
    // Dynamically load the reCAPTCHA script using the recommended onload callback
    useEffect(() => {
        if (!recaptchaSiteKey) {
            console.warn('reCAPTCHA V3 site key is not configured.');
            return;
        }
        const scriptId = 'recaptcha-v3-script';
        const callbackName = 'onRecaptchaLoadCallback';

        // If the script is already loaded, just set the ready state
        if (document.getElementById(scriptId)) {
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.ready(() => setIsRecaptchaReady(true));
            }
            return;
        }

        // Define the global callback function that the reCAPTCHA script will call
        (window as any)[callbackName] = () => {
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.ready(() => {
                    setIsRecaptchaReady(true);
                });
            }
        };

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}&onload=${callbackName}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Cleanup function to remove the global callback
        return () => {
            if ((window as any)[callbackName]) {
                delete (window as any)[callbackName];
            }
        };
    }, []);

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
        return newErrors;
    }, [formData]);

    useEffect(() => {
        const validationErrors = validate();
        setErrors(validationErrors);
    }, [formData, validate]);
    
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
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);
        setTouched({
            fullName: true, email: true, phone: true,
            shippingAddress: true, copies: true
        });
        const formErrors = validate();
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;
        if (isLoading || !isRecaptchaReady) return;

        setIsLoading(true);

        try {
            // We can now assume grecaptcha is available because the button was enabled.
            const token = await new Promise<string>((resolve, reject) => {
                grecaptcha.execute(recaptchaSiteKey, { action: 'submit_order' })
                    .then(resolve)
                    .catch(reject);
            });

            if (!token) {
                setSubmitError("Failed to get reCAPTCHA verification. Please refresh and try again.");
                setIsLoading(false);
                return;
            }
            
            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, recaptchaToken: token }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }
            
            setSubmittedTrackingNumber(result.trackingNumber);
            setOrderSubmitted(true);
            window.scrollTo(0, 0);

        } catch (error: any) {
            console.error("Submission error:", error);
            setSubmitError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
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
                    {orderSubmitted ? (
                        <div className="text-center py-20">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Submission Received!</h2>
                            <p className="mt-4 text-lg text-dark-slate/70 max-w-2xl mx-auto">
                                Thank you! Your order details have been saved.
                            </p>
                            <p className="mt-2 text-lg text-dark-slate/70 max-w-2xl mx-auto">
                                An email is on its way with a link to finalize your payment.
                            </p>
                            {submittedTrackingNumber && (
                                <div className="mt-8 max-w-lg mx-auto bg-sand/50 p-6 rounded-lg border border-coral/30 shadow-inner">
                                    <h3 className="font-heading text-xl font-semibold text-dark-slate mb-3">Ready to complete your order now?</h3>
                                    <p className="text-dark-slate/80 mb-5">
                                        Click the button below to proceed to payment and secure your copy.
                                    </p>
                                    <a
                                        href={`/order/${submittedTrackingNumber}`}
                                        className="inline-block bg-coral text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out"
                                    >
                                        Complete Payment
                                    </a>
                                    <p className="text-xs text-dark-slate/60 mt-5">
                                        Your tracking number is: <strong className="font-mono">{submittedTrackingNumber}</strong>
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Order 'Heal in Paradise'</h2>
                            <p className="mt-4 text-lg text-dark-slate/70 max-w-3xl mx-auto">
                                Step 1: Fill in your details below. You'll receive an email with a link to complete payment after submission.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <PaymentDetails
                                title="Payment Information"
                                description="You will use the account details below on the next step, after submitting your information."
                            />

                            <div className="p-6 rounded-lg bg-white/60 border border-coral/30 mt-12">
                                <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6">
                                <span className="text-coral">Enter Your Details</span>
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
                                    </fieldset>
                                    
                                    <fieldset className="p-6 border-2 border-coral/40 rounded-lg bg-coral/10 space-y-4 shadow-md transition-all hover:shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon />
                                            <legend className="font-heading text-xl font-bold text-dark-slate">Exclusive Book Signing <span className="text-coral">(OCT 28, 2025)</span></legend>
                                        </div>
                                        <p className="text-dark-slate/80 text-sm pl-9">Be part of the official launch! Register your interest now to receive an exclusive invitation.</p>
                                        <div className="mt-4 pl-9">
                                            <label htmlFor="joinEvent" className="flex items-center cursor-pointer group">
                                                <input id="joinEvent" name="joinEvent" type="checkbox" checked={formData.joinEvent} onChange={handleChange} className="h-5 w-5 text-coral border-gray-400 rounded focus:ring-coral focus:ring-2 focus:ring-offset-2 focus:ring-offset-coral/10" />
                                                <span className="ml-3 block text-base font-semibold text-dark-slate group-hover:text-coral transition-colors">
                                                    Yes! I want to join the book signing event.
                                                </span>
                                            </label>
                                        </div>
                                        {formData.joinEvent && (
                                            <div className="pl-16 space-y-4 transition-all duration-300 ease-in-out">
                                                <div className="border-t border-coral/20 pt-4">
                                                    <label htmlFor="bringGuest" className="flex items-center cursor-pointer group">
                                                        <input id="bringGuest" name="bringGuest" type="checkbox" checked={formData.bringGuest} onChange={handleChange} className="h-5 w-5 text-coral border-gray-400 rounded focus:ring-coral focus:ring-2 focus:ring-offset-2 focus:ring-offset-coral/10" />
                                                        <span className="ml-3 block text-base font-medium text-dark-slate group-hover:text-coral transition-colors">
                                                            I'd like to bring a guest (+1).
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </fieldset>
                                    
                                    <div>
                                        {submitError && (
                                            <div className="my-4 text-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                                <p><strong>Submission Failed:</strong> {submitError}</p>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isLoading || isFormInvalid || !isRecaptchaReady}
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
                                                !isRecaptchaReady ? 'Initializing Security...' : 'Submit Your Details'
                                            )}
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-4">
                                            This site is protected by reCAPTCHA and the Google
                                            <a href="https://policies.google.com/privacy" className="underline hover:text-coral"> Privacy Policy</a> and
                                            <a href="https://policies.google.com/terms" className="underline hover:text-coral"> Terms of Service</a> apply.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PreOrderSection;