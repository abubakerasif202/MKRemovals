import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { mrkBusiness, PRIMARY_NAV_ITEMS } from '../../config/business';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

/**
 * Strictly adheres to the Universal Frontend Design Constitution Top Bar Contract:
 * Zone 1: Single text element wordmark (whitespace-nowrap shrink-0)
 * Zone 2: 5 concise single-line text navigation links (whitespace-nowrap shrink-0)
 * Zone 3: 1 primary action button (Request a Quote)
 */
export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#D7E0EC]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Distinctive Brand Identity Wordmark & Crest */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81036] select-none"
        >
          <span className="mrk-logo-badge inline-flex items-center rounded-xl px-2.5 py-1 transition-transform group-hover:scale-105">
            <img
              src={mrkBusiness.brandAssets.logoWordmark}
              alt="MRK Removals Adelaide"
              width={720}
              height={115}
              className="h-8 sm:h-9 w-auto select-none"
            />
          </span>
        </a>

        {/* Zone 2: Clean text navigation links (Desktop) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#33445C]"
        >
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== '/' && currentPath.startsWith(`${item.path}/`));
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'text-[#0B1B33] border-[#C81036]'
                    : 'border-transparent hover:text-[#C81036] hover:border-[#D7E0EC]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary action (Desktop/Tablet) + Quick Call + Mobile/Tablet menu toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href={mrkBusiness.phoneHref}
            className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8EEF7] hover:bg-[#DCE5F2] text-xs font-semibold text-[#0B1B33] border border-[#D7E0EC] transition-all hover:border-[#C81036]/50 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#C81036]" />
            <span>{mrkBusiness.phoneDisplay}</span>
          </a>

          <a
            href="/quote"
            onClick={(e) => handleLinkClick(e, '/quote')}
            className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-semibold text-white btn-ruby rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124FA3]"
          >
            Request a Quote
          </a>

          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mrk-mobile-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#0B1B33] hover:bg-[#DCE5F2] border border-[#D7E0EC] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mrk-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden bg-[#F3F7FC] border-b border-[#D7E0EC] px-4 pt-3 pb-6"
        >
          <nav aria-label="Mobile Navigation Links" className="flex flex-col space-y-1">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPath === '/'
                  ? 'bg-[#E8EEF7] text-[#0B1B33]'
                  : 'text-[#33445C] hover:bg-[#EEF3FA] hover:text-[#C81036]'
              }`}
            >
              Home
            </a>
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive =
                currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-[#E8EEF7] text-[#0B1B33]'
                      : 'text-[#33445C] hover:bg-[#EEF3FA] hover:text-[#C81036]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="/faq"
              onClick={(e) => handleLinkClick(e, '/faq')}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPath === '/faq'
                  ? 'bg-[#E8EEF7] text-[#0B1B33]'
                  : 'text-[#33445C] hover:bg-[#EEF3FA] hover:text-[#C81036]'
              }`}
            >
              FAQs
            </a>
          </nav>

          <div className="mt-4 pt-4 border-t border-[#D7E0EC] flex flex-col gap-2.5">
            <a
              href={mrkBusiness.phoneHref}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#E8EEF7] text-[#0B1B33] border border-[#D7E0EC] text-sm font-semibold"
            >
              <Phone className="w-4 h-4 text-[#C81036]" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
            <p className="text-xs text-[#33445C] text-center">
              Indicative hourly rates: $130–$135 · Adelaide, SA
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
