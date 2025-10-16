import React, { useState } from 'react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

interface NavLinkInfo {
  path: string;
  label: string;
}

const NavLink: React.FC<{
  link: NavLinkInfo;
  currentPath: string;
  onClick: (path: string) => void;
  isMobile?: boolean;
}> = ({ link, currentPath, onClick, isMobile = false }) => (
  <a
    href={link.path}
    onClick={(e) => {
      e.preventDefault();
      onClick(link.path);
    }}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
      currentPath === link.path
        ? 'text-white bg-coral rounded-md'
        : 'text-dark-slate hover:text-coral'
    } ${isMobile ? 'block w-full text-left' : ''}`}
    aria-current={currentPath === link.path ? 'page' : undefined}
  >
    {link.label}
  </a>
);

const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: NavLinkInfo[] = [
    { path: '/', label: 'Home' },
    { path: '/heal-in-paradise', label: 'About the Book' },
    { path: '/about-hawla-riza', label: 'Meet Hawla Riza' },
    { path: '/poetry-samples', label: 'Poetry Samples' },
    { path: '/pre-order-heal-in-paradise', label: 'Pre-Order' },
    { path: '/track-order', label: 'Track Order' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }} className="flex items-center space-x-3" aria-label="Go to homepage">
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
        </a>
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLink key={link.path} link={link} currentPath={currentPath} onClick={handleNavClick} />
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
            {navLinks.map((link) => (
              <NavLink key={link.path} link={link} currentPath={currentPath} onClick={handleNavClick} isMobile />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
