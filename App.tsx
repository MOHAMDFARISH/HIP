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

  useEffect(() => {
    // This effect is for the state-based navigation, not for URL routing.
    window.scrollTo(0, 0);
  }, [activePage]);
  
  // Simple client-side routing for the /order/:trackingNumber path
  const path = window.location.pathname;
  if (path.startsWith('/order/')) {
      const trackingNumber = path.split('/')[2];
      if (trackingNumber) {
          // Render a special layout for the payment page
          return (
              <div className="min-h-screen flex flex-col">
                  <Header activePage={activePage} setActivePage={setActivePage} />
                  <main className="flex-grow">
                      <OrderPaymentPage trackingNumber={trackingNumber} />
                  </main>
                  <Footer setActivePage={setActivePage} />
              </div>
          );
      }
  }

  const renderActivePage = () => {
    switch (activePage) {
      case Page.Home:
        return <HeroSection setActivePage={setActivePage} />;
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
        return <HeroSection setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-grow">
        {renderActivePage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;