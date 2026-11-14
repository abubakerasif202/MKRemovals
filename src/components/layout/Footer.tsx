import React from 'react';
import { Phone } from 'lucide-react';
import {
  mrkBusiness,
  FOOTER_NAV_ITEMS,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../../config/business';
import { MRK_SERVICES } from '../../content/services';
import { MRK_SERVICE_AREAS } from '../../content/service-areas';
import { MRKVectorEmblem } from '../brand/MRKLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <>
      <footer className="bg-[#EAF0F9] border-t border-[#D7E0EC] text-[#33445C] pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D7E0EC]">
            {/* Brand & Direct Contact Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-2">
                <span className="mrk-logo-badge inline-flex items-center rounded-2xl px-3.5 py-2">
                  <img
                    src={mrkBusiness.brandAssets.logoWordmark}
                    alt="MRK Removals Adelaide"
                    width={720}
                    height={115}
                    loading="lazy"
                    className="h-12 w-auto"
                  />
                </span>
                <p className="text-xs text-[#8A6414] font-medium">{mrkBusiness.locationLabel}</p>
              </div>

              <p className="text-sm text-[#33445C] leading-relaxed">
                Careful residential, apartment, furniture, and commercial relocations across
                metropolitan Adelaide and the Adelaide Hills.
              </p>

              <div className="pt-2 space-y-2 text-sm">
                <p>
                  <span className="text-[#5B6B80]">Direct Phone: </span>
                  <a
                    href={mrkBusiness.phoneHref}
                    className="font-mono font-semibold text-[#0B1B33] hover:text-[#A00E2C] transition-colors tabular-nums"
                  >
                    {mrkBusiness.phoneDisplay}
                  </a>
                </p>
                <p>
                  <span className="text-[#5B6B80]">Email: </span>
                  <a
                    href={mrkBusiness.enquiryEmailHref}
                    className="font-mono text-xs sm:text-sm text-[#0B1B33] hover:text-[#A00E2C] transition-colors"
                  >
                    {mrkBusiness.enquiryEmail}
                  </a>
                </p>
                <p>
                  <span className="text-[#5B6B80]">Contact: </span>
                  <span className="text-[#0B1B33]">{mrkBusiness.ownerContactName.value}</span>
                </p>
                <p className="font-mono text-xs text-[#5B6B80] tabular-nums">
                  ABN: {mrkBusiness.abn.value} (Owner-supplied)
                </p>
              </div>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-display text-sm font-semibold text-[#0B1B33]">Moving Services</h2>
              <ul className="space-y-2 text-sm">
                {MRK_SERVICES.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`/services/${service.slug}`}
                      onClick={(e) => handleLinkClick(e, `/services/${service.slug}`)}
                      className="hover:text-[#C81036] transition-colors"
                    >
                      {service.shortTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adelaide Coverage Corridors */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-display text-sm font-semibold text-[#0B1B33]">
                Adelaide Service Corridors
              </h2>
              <ul className="space-y-2 text-sm">
                {MRK_SERVICE_AREAS.map((area) => (
                  <li key={area.id}>
                    <a
                      href={`/service-areas/${area.slug}`}
                      onClick={(e) => handleLinkClick(e, `/service-areas/${area.slug}`)}
                      className="hover:text-[#C81036] transition-colors"
                    >
                      {area.shortName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Site Navigation & Legal */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-display text-sm font-semibold text-[#0B1B33]">Information</h2>
              <ul className="space-y-2 text-sm">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item.path)}
                      className="hover:text-[#C81036] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transparent Rate & Governance Notice */}
          <div className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-[#5B6B80]">
            <div className="space-y-1 max-w-3xl">
              <p className="text-[#33445C] font-medium">{formatIndicativeRateHeadline()}</p>
              <p>{getMandatoryRateDisclaimer()}</p>
            </div>
            <div className="text-left lg:text-right shrink-0 space-y-1">
              <p>
                &copy; {new Date().getFullYear()} {mrkBusiness.brandName}. All rights reserved.
              </p>
              <a
                href="https://abwebstudio.com.au/"
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-2.5 rounded-lg px-1 py-1 text-xs text-[#33445C] hover:text-[#C81036] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124FA3]"
              >
                <span>Website by</span>
                <img
                  src="/assets/brand/ab-web-studio-logo.webp"
                  alt=""
                  width={230}
                  height={192}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-semibold text-[#0B1B33]">{mrkBusiness.creativeAgency.name}</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Persistent Floating Actions (Bottom-right 'Get a Quote' FAB + Bottom-left Click-to-Call) */}
      <div
        role="region"
        aria-label="Mobile Quick Conversion Actions"
        className="md:hidden fixed bottom-4 inset-x-3 z-40 pointer-events-none flex items-center justify-between gap-2"
      >
        <a
          href={mrkBusiness.phoneHref}
          aria-label={`Call ${mrkBusiness.brandName} on ${mrkBusiness.phoneDisplay}`}
          className="pointer-events-auto min-h-[44px] px-3.5 py-2.5 inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-md text-[#0B1B33] border border-[#D7E0EC] shadow-[0_8px_24px_rgba(0,0,0,0.65)] text-xs font-semibold whitespace-nowrap shrink-0 transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124FA3]"
        >
          <Phone className="w-3.5 h-3.5 text-[#C81036] shrink-0" />
          <span>{mrkBusiness.phoneDisplay}</span>
        </a>

        <a
          href="/quote"
          data-testid="mobile-floating-quote-btn"
          onClick={(e) => {
            e.preventDefault();
            const localForm =
              document.getElementById('quote-section') ||
              document.getElementById('service-quote-form') ||
              document.getElementById('area-quote-form') ||
              document.getElementById('pricing-quote-form') ||
              document.getElementById('dedicated-quote-form');
            if (localForm) {
              localForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
              const nameInput = document.getElementById('quote-fullName') as HTMLInputElement | null;
              nameInput?.focus({ preventScroll: true });
            } else {
              onNavigate('/quote');
            }
          }}
          className="pointer-events-auto min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C81036] hover:bg-[#DF143E] text-white border border-[#D7E0EC] shadow-[0_10px_28px_rgba(200,16,54,0.5)] text-xs font-bold tracking-wide whitespace-nowrap shrink-0 transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124FA3]"
        >
          <span>Get a Quote</span>
        </a>
      </div>
    </>
  );
};
