import React from 'react';
import { Phone, MapPin, ShieldCheck, Clock, Sparkles } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Direct Adelaide Moving Enquiries</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact {mrkBusiness.brandName}
          </h1>
          <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed">
            Speak directly with <strong className="text-white font-semibold">{mrkBusiness.ownerContactName.value}</strong>{' '}
            on <strong className="text-white font-mono">{mrkBusiness.phoneDisplay}</strong> or submit
            your move details below for a tailored Adelaide quote.
          </p>
        </div>
      </div>

      {/* Trust Banner */}
      <TrustBanner variant="compact" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Contact Channels Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-7 border border-[#C9D2DC]/25 space-y-5 shadow-xl">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#C5A15C] uppercase tracking-wider">Primary Telephone</p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums text-platinum-sheen">
                {mrkBusiness.phoneDisplay}
              </h2>
              <p className="text-xs text-[#C9D2DC] leading-relaxed">
                Call directly to discuss pickup and destination suburbs, inventory volume, stairs or
                apartment lift windows, and date availability.
              </p>
              <div className="pt-2">
                <a
                  href={mrkBusiness.phoneHref}
                  className="w-full py-3.5 px-4 rounded-xl btn-ruby text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {mrkBusiness.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9D2DC]/15 space-y-2.5 text-xs">
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
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C81036]" />
                <span>{formatIndicativeRateHeadline()}</span>
              </p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {getMandatoryRateDisclaimer()}
              </p>
            </div>
          </div>

          <div className="bg-[#0E1420] rounded-2xl p-5 border border-[#C9D2DC]/18 space-y-2.5 shadow-md">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C81036]" />
              <span>Fastest Way to Get an Accurate Quote</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#C9D2DC]">
              <li className="flex items-start gap-2">
                <span className="text-[#C81036] font-bold">1.</span>
                <span>Share both your pickup and destination suburbs or postcodes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C81036] font-bold">2.</span>
                <span>Let us know if either property has stairs, a lift, or a steep driveway.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C81036] font-bold">3.</span>
                <span>List your largest furniture items and rough moving box count.</span>
              </li>
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
