import React from 'react';
import { Phone } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { TrustBanner } from '../components/brand/TrustBanner';
import { QuoteForm } from '../components/forms/QuoteForm';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <p className="text-xs text-[#C5A15C] font-medium">
            Direct Adelaide Moving Enquiries
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact {mrkBusiness.brandName}
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Speak directly with <strong className="text-white">{mrkBusiness.ownerContactName.value}</strong>{' '}
            on <strong className="text-white font-mono">{mrkBusiness.phoneDisplay}</strong> or submit
            your move details below for a tailored Adelaide quote.
          </p>
        </div>
      </div>

      {/* Trust Banner */}
      <TrustBanner variant="compact" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Contact Channels Panel */}
        <div className="lg:col-span-4 space-y-5">
          <div className="mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/20 space-y-5">
            <div className="space-y-2">
              <p className="text-xs text-[#C5A15C] font-medium">Primary Telephone</p>
              <h2 className="font-display text-2xl font-bold text-white font-mono tabular-nums">
                {mrkBusiness.phoneDisplay}
              </h2>
              <p className="text-xs text-[#C9D2DC] leading-relaxed">
                Call directly to discuss pickup and destination suburbs, inventory volume, stairs or
                apartment lift bookings, and date availability.
              </p>
              <div className="pt-2">
                <a
                  href={mrkBusiness.phoneHref}
                  className="w-full py-3 px-4 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {mrkBusiness.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9D2DC]/15 space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-[#94A3B8]">Contact Person</span>
                <span className="text-white font-semibold">
                  {mrkBusiness.ownerContactName.value}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#94A3B8]">Service Base</span>
                <span className="text-white font-semibold">{mrkBusiness.locationLabel}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#94A3B8]">Owner-Supplied ABN</span>
                <span className="font-mono text-white tabular-nums">{mrkBusiness.abn.value}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9D2DC]/15 space-y-1.5">
              <p className="text-xs font-semibold text-white">
                {formatIndicativeRateHeadline()}
              </p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {getMandatoryRateDisclaimer()}
              </p>
            </div>
          </div>

          <div className="bg-[#0E1420] rounded-2xl p-5 border border-[#C9D2DC]/15 space-y-2">
            <h3 className="font-display text-sm font-bold text-white">
              Fastest Way to Get an Accurate Quote
            </h3>
            <ul className="space-y-1.5 text-xs text-[#C9D2DC]">
              <li>1. Share both your pickup and destination suburbs.</li>
              <li>2. Let us know if either property has stairs, a lift, or a steep driveway.</li>
              <li>3. List your largest furniture pieces and rough box count.</li>
            </ul>
          </div>
        </div>

        {/* Right Quote Enquiry Form */}
        <div className="lg:col-span-8">
          <QuoteForm sourcePage="/contact" compactHeader />
        </div>
      </div>
    </div>
  );
};
