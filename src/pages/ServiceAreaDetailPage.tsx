import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
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
              <span className="text-[#C5A15C] font-semibold">{area.regionGroup}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Postcodes: {area.postcodes.join(', ')}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Removalists for {area.title}
            </h1>

            <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed">
              {area.localMovingProfile}
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-1.5">
                Suburbs Frequently Serviced in This Corridor:
              </p>
              <p className="text-xs sm:text-sm text-[#C9D2DC] leading-relaxed">
                {area.keySuburbs.join(' · ')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/20 space-y-4">
            <p className="text-xs font-semibold text-[#C5A15C]">
              Moving to or from {area.shortName}?
            </p>
            <p className="text-sm font-bold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {getMandatoryRateDisclaimer()}
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="#area-quote-form"
                className="w-full py-3 px-4 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs sm:text-sm font-semibold text-center transition-colors"
              >
                Quote Move in {area.shortName}
              </a>
              <a
                href={mrkBusiness.phoneHref}
                className="w-full py-2.5 px-4 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white border border-[#C9D2DC]/25 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
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
        <div className="lg:col-span-7 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">
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

        <div className="lg:col-span-5 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              Typical Property Profiles
            </h2>
            <ul className="space-y-2.5 text-sm text-[#C9D2DC]">
              {area.commonPropertyTypes.map((prop) => (
                <li key={prop} className="flex items-start gap-2">
                  <span className="text-[#C5A15C] font-bold" aria-hidden="true">
                    ·
                  </span>
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#090D15] rounded-xl p-4 border border-[#C9D2DC]/15 space-y-2">
            <p className="text-xs font-semibold text-white">Main Road Corridors Used</p>
            <p className="text-xs text-[#94A3B8]">{area.arterialCorridors.join(' · ')}</p>
          </div>
        </div>
      </section>

      {/* Applicable Services for This Corridor */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          Services Available Across {area.shortName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MRK_SERVICES.slice(0, 3).map((service) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/services/${service.slug}`);
              }}
              className="mrk-surface-interactive rounded-xl p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <p className="text-xs font-mono text-[#C5A15C]">{service.indexNumber}</p>
                <h3 className="font-display text-base font-bold text-white mt-1">
                  {service.title}
                </h3>
                <p className="text-xs text-[#C9D2DC] mt-1">{service.summary}</p>
              </div>
              <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                <span>View Service Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C81036]" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Embedded Corridor Quote Form */}
      <section id="area-quote-form" className="scroll-mt-20">
        <QuoteForm
          sourcePage={`/service-areas/${area.slug}`}
          initialPickupSuburb={`${area.keySuburbs[0]} (${area.postcodes[0]})`}
        />
      </section>

      {/* Other Adelaide Corridors */}
      <section className="space-y-4 pt-4 border-t border-[#C9D2DC]/15">
        <h2 className="font-display text-xl font-bold text-white">
          Explore Other Adelaide Service Corridors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherAreas.map((other) => (
            <a
              key={other.id}
              href={`/service-areas/${other.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/service-areas/${other.slug}`);
              }}
              className="mrk-surface-interactive rounded-xl p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <p className="text-xs text-[#C5A15C]">{other.regionGroup}</p>
                <h3 className="font-display text-base font-bold text-white mt-1">
                  {other.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {other.keySuburbs.slice(0, 4).join(' · ')}
                </p>
              </div>
              <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                <span>Read Corridor Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C81036]" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
