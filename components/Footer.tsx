import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon, ThreadsIcon, LinktreeIcon } from './icons/SocialIcons';

interface FooterProps {
  navigate: (path: string) => void;
}

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'hello@hawlariza.com';

const BookIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-dark-slate/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const EmailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-dark-slate/70 group-hover:text-coral transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

interface NavLinkInfo {
  path: string;
  label: string;
}

const FooterNavLink: React.FC<{ link: NavLinkInfo; onClick: (path: string) => void; children: React.ReactNode }> = ({ link, onClick, children }) => (
  <li>
    <a
      href={link.path}
      onClick={(e) => {
        e.preventDefault();
        onClick(link.path);
      }}
      className="text-dark-slate/80 hover:text-coral hover:underline font-normal transition-all duration-300 transform hover:translate-x-1"
    >
      {children}
    </a>
  </li>
);

const Footer: React.FC<FooterProps> = ({ navigate }) => {
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
  
  return (
    <footer className="bg-gradient-to-br from-sand/95 via-sand/90 to-white/80 backdrop-blur-lg mt-12 border-t border-coral/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Column 1: Book Details & Connect (spans 2 columns) */}
          <div className="md:col-span-2">
            <div className="max-w-lg">
              <div className="flex justify-center md:justify-start items-center gap-4 mb-4">
                <img 
                  src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_64/v1759086831/android-chrome-192x192_t34m0h.png" 
                  alt="Heal in Paradise by Hawla Riza - Official Logo" 
                  className="h-16 w-16" 
                  loading="lazy"
                  width="64"
                  height="64"
                />
                <div>
                  <h3 className="font-heading text-3xl font-bold text-dark-slate flex items-center justify-center md:justify-start">
                    <BookIcon />
                    Heal in Paradise
                  </h3>
                  <p className="text-coral text-base italic font-medium">A Collection of Poems from the Maldives</p>
                </div>
              </div>
              
              <p className="text-dark-slate/70 text-sm mb-4 font-normal pt-4">
                Discover a journey of hope, healing, and the serene beauty of the islands through the eyes of Hawla Riza.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-xs text-dark-slate/70 font-medium mb-8">
                <span>Collector's Edition</span>
                <span className="w-1 h-1 bg-coral/60 rounded-full" aria-hidden="true"></span>
                <span>Watercolor Illustrations</span>
                <span className="w-1 h-1 bg-coral/60 rounded-full" aria-hidden="true"></span>
                <span>First Maldivian Literary Souvenir</span>
              </div>

              <h3 className="font-heading text-xl font-medium text-dark-slate mb-5 pb-3 border-b border-dark-slate/20">Connect with Hawla</h3>
              <div className="space-y-6">
                  <div>
                      <p className="text-dark-slate/70 text-sm mb-4 text-center md:text-left">Follow the journey</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-5">
                          <a href="https://instagram.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><InstagramIcon /></a>
                          <a href="https://web.facebook.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><FacebookIcon /></a>
                          <a href="https://x.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><XIcon /></a>
                          <a href="https://tiktok.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><TikTokIcon /></a>
                          <a href="https://www.threads.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><ThreadsIcon /></a>
                          <a href="https://linktr.ee/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"><LinktreeIcon /></a>
                      </div>
                  </div>
                  
                  <a href={`mailto:${contactEmail}`} className="flex items-center justify-center md:justify-start text-dark-slate/90 hover:text-coral group transition-all duration-300">
                      <EmailIcon />
                      <span className="font-semibold text-base group-hover:underline">
                          {contactEmail}
                      </span>
                  </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:justify-self-end bg-sand/50 p-6 rounded-lg">
            <h3 className="font-heading text-xl font-medium text-dark-slate mb-5 text-center md:text-left">Quick Links</h3>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {navLinks.map(link => (
                <FooterNavLink key={link.path} link={link} onClick={navigate}>
                  {link.label}
                </FooterNavLink>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Decorative Separator */}
        <div className="mt-12 mb-8 flex justify-center items-center" aria-hidden="true">
          <div className="w-1.5 h-1.5 bg-coral/40 rounded-full"></div>
          <div className="w-16 md:flex-grow md:max-w-2xl h-px bg-coral/20 mx-4"></div>
          <div className="w-2.5 h-2.5 bg-coral/60 rounded-full"></div>
          <div className="w-16 md:flex-grow md:max-w-2xl h-px bg-coral/20 mx-4"></div>
          <div className="w-1.5 h-1.5 bg-coral/40 rounded-full"></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-600 text-center md:text-left font-normal">&copy; {new Date().getFullYear()} Hawla Riza. All rights reserved.</p>
            <p className="text-xs text-gray-500 text-center md:text-right font-normal">Website designed with love for Maldivian literature.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
