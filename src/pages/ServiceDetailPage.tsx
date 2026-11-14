import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
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
              <span className="font-mono text-[#C5A15C]">{service.indexNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{service.kicker}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {service.title} in Adelaide
            </h1>

            <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed">
              {service.heroDescription}
            </p>
          </div>

          <div className="lg:col-span-4 mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/20 space-y-4">
            <p className="text-xs font-semibold text-[#C5A15C]">Indicative Rate Guidance</p>
            <p className="text-base font-bold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {getMandatoryRateDisclaimer()}
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="#service-quote-form"
                className="w-full py-3 px-4 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs sm:text-sm font-semibold text-center transition-colors"
              >
                Request {service.shortTitle} Quote
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

      {/* What Affects Your Quote Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-[#C5A15C] font-medium">Transparent Scoping</p>
          <h2 className="font-display text-2xl font-bold text-white">
            What Affects Your {service.shortTitle} Quote
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {service.whatAffectsYourQuote.map((item, idx) => (
            <div
              key={item.factor}
              className="mrk-surface rounded-xl p-6 border border-[#C9D2DC]/15 space-y-2"
            >
              <p className="font-mono text-xs text-[#C81036] tabular-nums">
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
        <div className="lg:col-span-6 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">
            Pre-Move Preparation Checklist
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

        <div className="lg:col-span-6 mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/18 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              What to Confirm With Us When Quoting
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
              className="mrk-surface rounded-xl p-6 border border-[#C9D2DC]/15 space-y-2"
            >
              <h3 className="font-display text-base font-bold text-white">{faq.question}</h3>
              <p className="text-sm text-[#C9D2DC] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Service Quote Form */}
      <section id="service-quote-form" className="scroll-mt-20">
        <QuoteForm
          sourcePage={`/services/${service.slug}`}
          initialServiceType={service.slug}
        />
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#C9D2DC]/15">
          <h2 className="font-display text-xl font-bold text-white">Related Moving Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedServices.map((rel) => (
              <a
                key={rel.id}
                href={`/services/${rel.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/services/${rel.slug}`);
                }}
                className="mrk-surface-interactive rounded-xl p-5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <p className="text-xs text-[#C5A15C] font-mono">{rel.indexNumber}</p>
                  <h3 className="font-display text-base font-bold text-white mt-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-[#C9D2DC] mt-1 line-clamp-2">{rel.summary}</p>
                </div>
                <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                  <span>View Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C81036]" />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
