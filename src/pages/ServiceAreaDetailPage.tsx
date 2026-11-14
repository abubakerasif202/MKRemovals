import React from 'react';
import { Phone, ArrowRight, MapPin, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { getServiceAreaBySlug, MRK_SERVICE_AREAS } from '../content/service-areas';
import { MRK_SERVICES } from '../content/services';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { QuoteForm } from '../components/forms/QuoteForm';
import { NotFoundPage } from './NotFoundPage';

interface ServiceAreaDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceAreaDetailPage: React.FC<ServiceAreaDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const area = getServiceAreaBySlug(slug);

  if (!area) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }

  const otherAreas = MRK_SERVICE_AREAS.filter((a) => a.slug !== area.slug).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Service Areas', path: '/service-areas' },
            { name: area.title, path: `/service-areas/${area.slug}` },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
              <span className="text-[#C5A15C] font-semibold uppercase tracking-wider">{area.regionGroup}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-white">
                Postcodes: {area.postcodes.join(', ')}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Removalists for {area.title}
            </h1>

            <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed">
              {area.localMovingProfile}
            </p>

            {/* Contextual Adelaide Photography Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20 h-56 sm:h-72 my-4 shadow-xl group">
              <img
                src={mrkBusiness.photographyAssets.adelaideSkylineTwilight}
                alt={`${area.title} Adelaide local moving corridor`}
                className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-[#090D15]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#38BDF8]" />
                  Adelaide Local Route Knowledge: {area.shortName}
                </span>
                <span className="font-mono text-[11px] text-[#C5A15C]">METRO CORRIDOR</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">
                Suburbs Frequently Serviced in This Corridor:
              </p>
              <p className="text-xs sm:text-sm text-[#C9D2DC] leading-relaxed">
                {area.keySuburbs.join(' · ')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 mrk-surface-elevated rounded-3xl p-6 sm:p-7 border border-[#C9D2DC]/25 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#C5A15C] uppercase tracking-wider">
                Moving to or from {area.shortName}?
              </p>
              <Clock className="w-4 h-4 text-[#C81036]" />
            </div>
            <p className="text-sm sm:text-base font-bold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {getMandatoryRateDisclaimer()}
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="#area-quote-form"
                className="w-full py-3.5 px-4 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold text-center transition-all shadow-md cursor-pointer"
              >
                Quote Move in {area.shortName}
              </a>
              <a
                href={mrkBusiness.phoneHref}
                className="w-full py-2.5 px-4 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#C81036]" />
                <span>Call {mrkBusiness.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Local Access, Parking & Property Considerations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 mrk-surface rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/20 space-y-4 shadow-md">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Access, Parking &amp; Loading Considerations in {area.shortName}
          </h2>
          <ul className="space-y-3 text-sm text-[#C9D2DC]">
            {area.accessAndParkingConsiderations.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="text-[#C81036] font-bold" aria-hidden="true">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 mrk-surface rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/20 space-y-5 flex flex-col justify-between shadow-md">
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Typical Property Profiles
            </h2>
            <ul className="space-y-2 text-xs text-[#C9D2DC]">
              {area.commonPropertyTypes.map((prop) => (
                <li key={prop} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#090D15] rounded-2xl p-4 border border-[#C9D2DC]/15 space-y-1 text-xs">
            <p className="font-semibold text-white">Primary Arterial Corridors:</p>
            <p className="text-[#94A3B8] leading-relaxed">{area.arterialCorridors.join(' · ')}</p>
          </div>
        </div>
      </section>

      {/* Planning Tips for this area */}
      <section className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/25 space-y-4 shadow-md">
        <h2 className="font-display text-xl font-bold text-white">
          Planning Tips for Moving Day in {area.shortName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#C9D2DC]">
          {area.planningTips.map((tip, idx) => (
            <div key={idx} className="bg-[#090D15]/80 rounded-2xl p-4 border border-[#C9D2DC]/15 space-y-1">
              <span className="font-mono text-xs text-[#C5A15C] font-semibold">TIP 0{idx + 1}</span>
              <p className="text-xs sm:text-sm text-[#C9D2DC] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Other Adelaide Corridors */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white">Other Adelaide Moving Corridors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherAreas.map((other) => (
            <a
              key={other.id}
              href={`/service-areas/${other.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/service-areas/${other.slug}`);
              }}
              className="mrk-surface-interactive rounded-2xl p-5 border border-[#C9D2DC]/15 flex items-center justify-between gap-3 text-xs font-semibold text-white hover:text-[#C81036] shadow-md"
            >
              <span>{other.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* Embedded Quote Form on Service Area Detail */}
      <section id="area-quote-form" className="scroll-mt-24 pt-4">
        <QuoteForm
          sourcePage={`/service-areas/${area.slug}`}
          initialPickupSuburb={area.keySuburbs[0] || area.shortName}
        />
      </section>
    </div>
  );
};
