import React from 'react';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getServiceBySlug, MRK_SERVICES } from '../content/services';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { QuoteForm } from '../components/forms/QuoteForm';
import { NotFoundPage } from './NotFoundPage';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
  const service = getServiceBySlug(slug);

  if (!service) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }

  const relatedServices = MRK_SERVICES.filter((s) => service.relatedSlugs.includes(s.slug));

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

  const photo = getServicePhoto(service.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      {/* Header & Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#C9D2DC]">
              <span className="font-mono text-[#C5A15C] font-semibold">{service.indexNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase tracking-wider font-medium">{service.kicker}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {service.title} in Adelaide
            </h1>

            <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed">
              {service.heroDescription}
            </p>

            {/* Contextual Photography Feature Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20 h-56 sm:h-72 my-4 shadow-xl group">
              <img
                src={photo}
                alt={`${service.title} in Adelaide`}
                className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-[#090D15]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span aria-hidden="true" />
                <span className="font-mono text-[11px] text-[#C5A15C]">ADELAIDE SERVICE</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mrk-surface-elevated rounded-2xl p-6 border border-[#C9D2DC]/25 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#C5A15C] uppercase tracking-wider">Rate Guidance</p>
              <Clock className="w-4 h-4 text-[#C81036]" />
            </div>
            <p className="text-base font-bold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {getMandatoryRateDisclaimer()}
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="#service-quote-form"
                className="w-full py-3 px-4 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold text-center transition-all shadow-md cursor-pointer"
              >
                Request {service.shortTitle} Quote
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

      {/* What Affects Your Quote Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-[#C5A15C] font-semibold uppercase tracking-wider">Transparent Scoping</p>
          <h2 className="font-display text-2xl font-bold text-white">
            What Affects Your {service.shortTitle} Quote
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {service.whatAffectsYourQuote.map((item, idx) => (
            <div
              key={item.factor}
              className="mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/15 space-y-2 hover:border-[#C81036]/40 transition-colors shadow-md"
            >
              <p className="font-mono text-xs text-[#C81036] font-bold tabular-nums">
                FACTOR 0{idx + 1}
              </p>
              <h3 className="font-display text-lg font-bold text-white">{item.factor}</h3>
              <p className="text-sm text-[#C9D2DC] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preparation Checklist & What to Confirm */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-4 shadow-md">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C81036]" />
            <span>Pre-Move Preparation Checklist</span>
          </h2>
          <ul className="space-y-3 text-sm text-[#C9D2DC]">
            {service.preparationChecklist.map((step) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="text-[#C81036] font-bold" aria-hidden="true">
                  —
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-4 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A15C]" />
              <span>What to Confirm With Us When Quoting</span>
            </h2>
            <ul className="space-y-3 text-sm text-[#C9D2DC]">
              {service.whatToConfirmWithUs.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-[#C5A15C] font-bold" aria-hidden="true">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#090D15] rounded-xl p-4 border border-[#C9D2DC]/15 space-y-1">
            <p className="text-xs font-semibold text-white">Adelaide Local Logistics Note</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {service.adelaideLogisticsNote}
            </p>
          </div>
        </div>
      </section>

      {/* Service-Specific FAQs */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          {service.shortTitle} — Common Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {service.faqs.map((faq) => (
            <div
              key={faq.question}
              className="mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/15 space-y-2 shadow-md"
            >
              <h3 className="font-display text-base font-bold text-white">{faq.question}</h3>
              <p className="text-sm text-[#C9D2DC] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Related Adelaide Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedServices.map((rel) => (
              <a
                key={rel.id}
                href={`/services/${rel.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/services/${rel.slug}`);
                }}
                className="mrk-surface-interactive rounded-xl p-5 border border-[#C9D2DC]/15 flex items-center justify-between gap-3 text-xs font-semibold text-white hover:text-[#C81036]"
              >
                <span>{rel.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Embedded Quote Form on Service Detail */}
      <section id="service-quote-form" className="scroll-mt-24 pt-4">
        <QuoteForm
          sourcePage={`/services/${service.slug}`}
          initialServiceType={service.id}
          initialEstimatedSize={service.shortTitle}
        />
      </section>
    </div>
  );
};
