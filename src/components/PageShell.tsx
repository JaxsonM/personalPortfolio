import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteFooter from './SiteFooter';

// Header and footer for every page except the homepage.
const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  // BrowserRouter keeps the old scroll position on navigation; start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight text-lg">JM</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <Link to="/#projects" className="hover:text-gray-900">Projects</Link>
            <a href="https://github.com/JaxsonM" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default PageShell;
