import React, { useState } from 'react';

const BookSigningSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmationNumber: '',
    bringGuest: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState({ bringGuest: false });


  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.confirmationNumber.trim()) {
      newErrors.confirmationNumber = 'Pre-Order Confirmation Number is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: inputValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || !validate()) {
      return;
    }
    setIsLoading(true);

    // Simulate an API call
    setTimeout(() => {
      setSubmittedData({ bringGuest: formData.bringGuest });
      setIsSubmitted(true);
      setIsLoading(false);
      console.log('Form submitted:', formData);
    }, 2000);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div 
          className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 md:p-12 lg:p-16 ring-1 ring-black ring-opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate mb-4">
              Exclusive Book Signing Event
            </h2>
            <p className="text-lg text-dark-slate/80">
              Join Hawla Riza for an unforgettable evening celebrating the launch of 'Heal in Paradise'.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-dark-slate/80 mb-6">
                This is an exclusive event for customers who have pre-ordered the book. Please register below using your payment confirmation number to secure your spot.
              </p>
              <div className="bg-sand/80 backdrop-blur-sm inline-block p-8 rounded-lg border border-coral/30 shadow-inner">
                <div className="text-coral text-5xl md:text-6xl font-bold font-heading">
                  OCT 28
                </div>
                <div className="mt-2 text-xl font-semibold text-dark-slate">
                  Saturday, 4:30 PM
                </div>
              </div>
               <p className="mt-4 text-sm text-dark-slate/60 italic">
                Location details will be shared via email upon successful registration.
              </p>
              <p className="mt-6 text-dark-slate/70">
                An evening of poetry reading, cultural discussion, and celebration. Light refreshments will be served.
              </p>
            </div>

            <div className="bg-white/60 p-8 rounded-lg shadow-lg border border-coral/20">
              {isSubmitted ? (
                <div className="text-center">
                  <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">Thank You for Registering!</h3>
                  <p className="text-dark-slate/80">
                    {submittedData.bringGuest ? "Your spot (+1 guest) is confirmed." : "Your spot is confirmed."} We've sent a confirmation to your email address and look forward to seeing you at the event!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-6 text-center">Register Your Attendance</h3>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-dark-slate">Full Name</label>
                      <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate" />
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-dark-slate">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate" />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="confirmationNumber" className="block text-sm font-medium text-dark-slate">Pre-Order Confirmation Number</label>
                      <input type="text" id="confirmationNumber" name="confirmationNumber" value={formData.confirmationNumber} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm text-dark-slate" placeholder="e.g., from your payment receipt" />
                      {errors.confirmationNumber && <p className="mt-1 text-sm text-red-600">{errors.confirmationNumber}</p>}
                    </div>
                    <div className="flex items-center">
                      <input
                        id="bringGuest"
                        name="bringGuest"
                        type="checkbox"
                        checked={formData.bringGuest}
                        onChange={handleChange}
                        className="h-4 w-4 text-coral border-gray-300 rounded focus:ring-coral"
                      />
                      <label htmlFor="bringGuest" className="ml-2 block text-sm text-dark-slate">
                        Bring a guest (+1)
                      </label>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-coral text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Confirm Registration'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSigningSection;