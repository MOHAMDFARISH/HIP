import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // FIX: Replaced the state class field with a constructor to initialize state.
  // This resolves the type error where `this.props` was not recognized on the component instance.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReturnHome = () => {
    // A full page reload is the most robust way to reset the application's state.
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div 
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758364608/Gemini_Generated_Image_xka36nxka36nxka3_rodtiq.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
          <div 
            className="max-w-2xl w-full text-center p-8 md:p-12 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758431623/Gemini_Generated_Image_ufm4haufm4haufm4_udkrj9.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-md">
                <svg className="w-16 h-16 text-coral mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-dark-slate mb-4">A Wave Washed Over Us...</h1>
                <p className="text-dark-slate/80 mb-8 leading-relaxed">
                    It seems we've encountered an unexpected swell. Please return to the calm shores of our homepage to start fresh.
                </p>
                <button
                    onClick={this.handleReturnHome}
                    aria-label="Return to Home Page"
                    className="bg-coral text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    Return to Home
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;