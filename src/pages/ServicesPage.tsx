import React from 'react';
import { ArrowRight, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
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
  const getServicePhoto = (id: string) => {
    switch (id) {
      case 'house-removals':
      case 'packing-move-preparation':
        return mrkBusiness.photographyAssets.professionalWrapping;
      case 'apartment-strata-moves':
        return mrkBusiness.photographyAssets.apartmentRelocation;
      case 'office-commercial-relocations':
        return mrkBusiness.photographyAssets.officeRelocation;
      default:
        return mrkBusiness.photographyAssets.heroTruckCinematic;
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Adelaide Metropolitan Relocation Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Moving Services in Adelaide
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Every relocation has distinct access, wrapping, and scheduling requirements. Explore our
            core moving services below to see what affects your quote, how we safeguard your belongings,
            and what to confirm ahead of moving day.
          </p>
        </div>
      </div>

      {/* Services Grid with Visual Photography Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MRK_SERVICES.map((service) => {
          const photo = getServicePhoto(service.id);

          return (
            <article
              key={service.id}
              className="mrk-surface-interactive rounded-3xl overflow-hidden border border-[#C9D2DC]/20 flex flex-col justify-between shadow-xl"
            >
              {/* Top Service Photography Banner */}
              <div className="relative h-48 sm:h-56 overflow-hidden group">
                <img
                  src={photo}
                  alt={`${service.title} in Adelaide`}
                  className="w-full h-full object-cover object-center filter brightness-[0.9] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-[#090D15]/40 to-transparent" />
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-[#090D15]/85 backdrop-blur-md text-[#C5A15C] font-semibold uppercase tracking-wider border border-[#C9D2DC]/20">
                    {service.kicker}
                  </span>
                  <span className="font-mono text-white tabular-nums font-bold px-2 py-0.5 rounded bg-[#090D15]/85 backdrop-blur-md border border-[#C9D2DC]/20">
                    {service.indexNumber}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">
                    {service.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-[#C9D2DC] leading-relaxed">{service.heroDescription}</p>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-white uppercase tracking-wider">Ideal For:</p>
                    <ul className="space-y-1.5 text-xs text-[#C9D2DC]">
                      {service.idealFor.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
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
                    className="px-4 py-2.5 rounded-xl btn-ruby text-white text-xs font-semibold inline-flex items-center gap-2 transition-all whitespace-nowrap shadow-md cursor-pointer"
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
              </div>
            </article>
          );
        })}
      </div>

      {/* Pricing & Direct Call Banner */}
      <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#C9D2DC]/25 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-[#C5A15C] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#C81036]" />
            <span>Indicative Rate Qualification</span>
          </div>
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
            className="px-5 py-3 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-lg cursor-pointer"
          >
            Request a Quote
          </a>
          <a
            href={mrkBusiness.phoneHref}
            className="px-5 py-3 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-[#C81036]" />
            <span>Call {mrkBusiness.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
