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
      <footer className="bg-[#06090F] border-t border-[#C9D2DC]/15 text-[#C9D2DC] pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#C9D2DC]/12">
            {/* Brand & Direct Contact Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <MRKVectorEmblem className="w-10 h-10 shrink-0" />
                <div>
                  <p className="font-display text-lg font-bold text-[#F5F7FA]">
                    {mrkBusiness.brandName}
                  </p>
                  <p className="text-xs text-[#C9D2DC]">{mrkBusiness.locationLabel}</p>
                </div>
              </div>

              <p className="text-sm text-[#C9D2DC] leading-relaxed">
                Careful residential, apartment, furniture, and commercial relocations across
                metropolitan Adelaide and the Adelaide Hills.
              </p>

              <div className="pt-2 space-y-2 text-sm">
                <p>
                  <span className="text-[#94A3B8]">Direct Phone: </span>
                  <a
                    href={mrkBusiness.phoneHref}
                    className="font-mono font-semibold text-white hover:text-[#C81036] transition-colors tabular-nums"
                  >
                    {mrkBusiness.phoneDisplay}
                  </a>
                </p>
                <p>
                  <span className="text-[#94A3B8]">Contact: </span>
                  <span className="text-[#F5F7FA]">{mrkBusiness.ownerContactName.value}</span>
                </p>
                <p className="font-mono text-xs text-[#94A3B8] tabular-nums">
                  ABN: {mrkBusiness.abn.value} (Owner-supplied)
                </p>
              </div>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-display text-sm font-semibold text-white">Moving Services</h2>
              <ul className="space-y-2 text-sm">
                {MRK_SERVICES.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`/services/${service.slug}`}
                      onClick={(e) => handleLinkClick(e, `/services/${service.slug}`)}
                      className="hover:text-white transition-colors"
                    >
                      {service.shortTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adelaide Coverage Corridors */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-display text-sm font-semibold text-white">
                Adelaide Service Corridors
              </h2>
              <ul className="space-y-2 text-sm">
                {MRK_SERVICE_AREAS.map((area) => (
                  <li key={area.id}>
                    <a
                      href={`/service-areas/${area.slug}`}
                      onClick={(e) => handleLinkClick(e, `/service-areas/${area.slug}`)}
                      className="hover:text-white transition-colors"
                    >
                      {area.shortName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Site Navigation & Legal */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-display text-sm font-semibold text-white">Information</h2>
              <ul className="space-y-2 text-sm">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item.path)}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transparent Rate & Governance Notice */}
          <div className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <div className="space-y-1 max-w-3xl">
              <p className="text-[#C9D2DC] font-medium">{formatIndicativeRateHeadline()}</p>
              <p>{getMandatoryRateDisclaimer()}</p>
            </div>
            <div className="text-left lg:text-right shrink-0 space-y-1">
              <p>
                &copy; {new Date().getFullYear()} {mrkBusiness.brandName}. All rights reserved.
              </p>
              <p className="text-[11px] text-[#64748B]">
                Digital experience by {mrkBusiness.creativeAgency.name}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Action Bar (Height: 56px, well within the 15% mobile sticky cap alongside Header) */}
      <div
        role="region"
        aria-label="Quick Contact Actions"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#090D15]/95 backdrop-blur-md border-t border-[#C9D2DC]/20 px-3 flex items-center gap-2.5"
      >
        <a
          href={mrkBusiness.phoneHref}
          className="flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#161E2E] text-[#F5F7FA] border border-[#C9D2DC]/25 text-xs font-semibold whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#C81036]" />
          <span>Call {mrkBusiness.phoneDisplay}</span>
        </a>
        <a
          href="/quote"
          onClick={(e) => handleLinkClick(e, '/quote')}
          className="flex-1 h-10 inline-flex items-center justify-center rounded-lg bg-[#C81036] text-white text-xs font-semibold whitespace-nowrap"
        >
          Request a Quote
        </a>
      </div>
    </>
  );
};
