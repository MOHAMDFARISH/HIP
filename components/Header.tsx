import React, { useState } from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  isMobile?: boolean;
}> = ({ page, activePage, onClick, isMobile = false }) => (
  <button
    onClick={() => onClick(page)}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
      activePage === page 
        ? 'text-white bg-coral rounded-md' 
        : 'text-dark-slate hover:text-coral'
    } ${isMobile ? 'block w-full text-left' : ''}`}
    aria-current={activePage === page ? 'page' : undefined}
  >
    {page}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: Page[] = [
    Page.Home,
    Page.AboutTheBook,
    Page.MeetHawlaRiza,
    Page.PoetrySamples,
    Page.PreOrder,
    Page.OrderTracking,
    Page.FAQ,
    Page.Contact,
  ];

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => handleNavClick(Page.Home)} className="flex items-center space-x-3" aria-label="Go to homepage">
          <img 
            src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_48/v1759086831/android-chrome-192x192_t34m0h.png" 
            alt="Logo for Heal in Paradise, a Maldivian poetry collection" 
            className="h-12 w-12"
            width="48"
            height="48"
            loading="lazy"
          />
          <span className="text-2xl font-heading font-bold text-dark-slate">
            Heal in Paradise
          </span>
        </button>
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((page) => (
            <NavLink key={page} page={page} activePage={activePage} onClick={handleNavClick} />
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-dark-slate focus:outline-none" aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4">
          <nav className="flex flex-col space-y-2 px-6">
            {navLinks.map((page) => (
              <NavLink key={page} page={page} activePage={activePage} onClick={handleNavClick} isMobile />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;