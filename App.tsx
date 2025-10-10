import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutBookSection from './components/AboutBookSection';
import AboutAuthorSection from './components/AboutAuthorSection';
import PoetrySamplesSection from './components/PoetrySamplesSection';
import ContactSection from './components/ContactSection';
import PreOrderSection from './components/PreOrderSection';
import OrderTrackingSection from './components/OrderTrackingSection';
import OrderPaymentPage from './components/OrderPaymentPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  // State to manage the current URL path, enabling reactive routing
  const [path, setPath] = useState(window.location.pathname);

  // Effect to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Central navigation handler
  const handleNavigate = (page: Page) => {
    // If on a special URL like /order/, update the URL to '/' for SPA navigation
    if (path.startsWith('/order/')) {
      window.history.pushState({}, '', '/');
      setPath('/'); // Update state to trigger re-render
    }
    setActivePage(page);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, path]);
  
  // Routing logic now uses the `path` state variable
  if (path.startsWith('/order/')) {
      const trackingNumber = path.split('/')[2];
      if (trackingNumber) {
          return (
              <div className="min-h-screen flex flex-col">
                  <Header activePage={activePage} setActivePage={handleNavigate} />
                  <main className="flex-grow">
                      <OrderPaymentPage trackingNumber={trackingNumber} />
                  </main>
                  <Footer setActivePage={handleNavigate} />
              </div>
          );
      }
  }

  const renderActivePage = () => {
    switch (activePage) {
      case Page.Home:
        return <HeroSection setActivePage={handleNavigate} />;
      case Page.AboutTheBook:
        return <AboutBookSection />;
      case Page.MeetHawlaRiza:
        return <AboutAuthorSection />;
      case Page.PoetrySamples:
        return <PoetrySamplesSection />;
      case Page.PreOrder:
        return <PreOrderSection />;
      case Page.OrderTracking:
        return <OrderTrackingSection />;
      case Page.Contact:
        return <ContactSection />;
      default:
        return <HeroSection setActivePage={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage={activePage} setActivePage={handleNavigate} />
      <main className="flex-grow">
        {renderActivePage()}
      </main>
      <Footer setActivePage={handleNavigate} />
    </div>
  );
};

export default App;