import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import OrderPaymentPage from './components/OrderPaymentPage';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import AuthorPage from './pages/AuthorPage';
import PoetrySamplesPage from './pages/PoetrySamplesPage';
import PreOrderPage from './pages/PreOrderPage';
import TrackOrderPage from './pages/TrackOrderPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);
  
  useEffect(() => {
    const titles: { [key: string]: string } = {
        '/': 'Heal in Paradise - Official Website by Hawla Riza',
        '/heal-in-paradise': 'About the Book | Heal in Paradise by Hawla Riza',
        '/about-hawla-riza': 'About Hawla Riza | Author of Heal in Paradise',
        '/poetry-samples': 'Poetry Samples | Heal in Paradise by Hawla Riza',
        '/pre-order-heal-in-paradise': "Pre-Order 'Heal in Paradise' by Hawla Riza",
        '/track-order': "Track Your 'Heal in Paradise' Pre-Order",
        '/faq': 'FAQ | Heal in Paradise',
        '/contact': 'Contact | Heal in Paradise',
    };
    if (path.startsWith('/order/')) {
        document.title = 'Complete Your Payment | Heal in Paradise';
    } else {
        document.title = titles[path] || 'Heal in Paradise | by Hawla Riza';
    }
  }, [path]);

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
        window.history.pushState({}, '', to);
        setPath(to);
        window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    if (path.startsWith('/order/')) {
      const trackingNumber = path.split('/')[2];
      return trackingNumber ? <OrderPaymentPage trackingNumber={trackingNumber} /> : <HomePage navigate={navigate} />;
    }

    switch (path) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/heal-in-paradise':
        return <BookPage />;
      case '/about-hawla-riza':
        return <AuthorPage />;
      case '/poetry-samples':
        return <PoetrySamplesPage />;
      case '/pre-order-heal-in-paradise':
        return <PreOrderPage />;
      case '/track-order':
        return <TrackOrderPage />;
      case '/faq':
        return <FAQPage />;
      case '/contact':
        return <ContactPage />;
      default:
        // For any unknown path, render the home page as a 404 fallback.
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath={path} navigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default App;
