import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { MRK_SERVICES } from '../content/services';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <p className="text-xs text-[#C5A15C] font-medium">
            Adelaide Residential, Strata &amp; Commercial Relocations
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Moving Services in Adelaide
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Every relocation has distinct access, wrapping, and scheduling requirements. Explore our
            core moving services below to see what affects your quote and what to confirm ahead of
            moving day.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MRK_SERVICES.map((service) => (
          <article
            key={service.id}
            className="mrk-surface-interactive rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#C9D2DC]">
                <span>{service.kicker}</span>
                <span className="font-mono text-[#C5A15C] tabular-nums">{service.indexNumber}</span>
              </div>

              <h2 className="font-display text-2xl font-bold text-white">
                {service.indexNumber}. {service.title}
              </h2>

              <p className="text-sm text-[#C9D2DC] leading-relaxed">{service.heroDescription}</p>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-white">Ideal For:</p>
                <ul className="space-y-1.5 text-xs text-[#C9D2DC]">
                  {service.idealFor.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#C81036] font-bold" aria-hidden="true">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-[#C9D2DC]/15 flex flex-wrap items-center justify-between gap-4">
              <a
                href={`/services/${service.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/services/${service.slug}`);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>View {service.shortTitle} Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={`/quote?service=${service.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/quote?service=${service.slug}`);
                }}
                className="text-xs font-semibold text-[#C9D2DC] hover:text-white underline whitespace-nowrap"
              >
                Request Quote for {service.shortTitle}
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Pricing & Direct Call Banner */}
      <div className="mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            {formatIndicativeRateHeadline()}
          </h2>
          <p className="text-xs sm:text-sm text-[#C9D2DC] leading-relaxed">
            {getMandatoryRateDisclaimer()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/quote"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/quote');
            }}
            className="px-5 py-3 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            Request a Quote
          </a>
          <a
            href={mrkBusiness.phoneHref}
            className="px-5 py-3 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white border border-[#C9D2DC]/25 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-[#C81036]" />
            <span>Call {mrkBusiness.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
