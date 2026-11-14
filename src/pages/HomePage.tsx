import React, { useRef, useState } from 'react';
import {
  Phone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useReducedMotion } from '../lib/useReducedMotion';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { MRK_SERVICES } from '../content/services';
import { MRK_SERVICE_AREAS } from '../content/service-areas';
import { MRK_FAQS } from '../content/faqs';
import { TrustBanner } from '../components/brand/TrustBanner';
import { MoveScopeBuilder } from '../components/interactive/MoveScopeBuilder';
import { QuoteForm, SIZE_NOT_SELECTED } from '../components/forms/QuoteForm';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Send your details or call',
    body: `Tell us your pickup and destination suburbs and rough move size, or call ${mrkBusiness.phoneDisplay}.`,
  },
  {
    num: '02',
    title: 'We review access',
    body: 'Stairs, lift windows, parking distance, heavy items and any disassembly are discussed with you.',
  },
  {
    num: '03',
    title: 'Confirm scope & rate',
    body: 'Inclusions and any other charges are confirmed in your quote. The hourly rate includes GST, with a 3-hour minimum plus a 1-hour call-out fee.',
  },
  {
    num: '04',
    title: 'Lock in your date',
    body: 'Once you approve the quoted terms, your moving date and arrival window are confirmed.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [presetSize, setPresetSize] = useState<string>(SIZE_NOT_SELECTED);
  const [presetServiceType, setPresetServiceType] = useState<string>('house-removals');
  const [presetNotes, setPresetNotes] = useState<string>('');
  const [activeAreaSlug, setActiveAreaSlug] = useState<string>(MRK_SERVICE_AREAS[0].slug);
  const [openFaqId, setOpenFaqId] = useState<string>('');
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const reduceMotion = useReducedMotion();

  const quoteSectionRef = useRef<HTMLElement>(null);
  const scrollToQuote = () => {
    quoteSectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const selectedArea =
    MRK_SERVICE_AREAS.find((a) => a.slug === activeAreaSlug) || MRK_SERVICE_AREAS[0];

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-x-hidden">
      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
        <ResponsiveImage
          src={mrkBusiness.photographyAssets.adelaideSkylineTwilight}
          alt="MRK moving truck on an Adelaide boulevard at dusk"
          priority
          sizes="100vw"
          width={1914}
          height={822}
          className="mrk-kenburns absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(9,13,21,0) 55%, #090D15 100%), linear-gradient(90deg, rgba(9,13,21,0.92) 0%, rgba(9,13,21,0.7) 50%, rgba(9,13,21,0.2) 100%), radial-gradient(circle at 10% 20%, rgba(200,16,54,0.22), transparent 45%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-24 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <p
              style={{ '--d': '0.05s' } as React.CSSProperties}
              className="mrk-rise inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#090D15]/80 border border-[#C9D2DC]/25 text-xs font-medium text-white"
            >
              <span className="w-2 h-2 rounded-full bg-[#C81036]" aria-hidden="true" />
              Adelaide, South Australia · Residential &amp; Commercial Removals
            </p>

            <h1
              id="hero-heading"
              style={{ fontSize: 'clamp(2.3rem, 5.2vw, 4.2rem)', '--d': '0.12s' } as React.CSSProperties}
              className="mrk-rise font-display font-extrabold text-white tracking-tight leading-[1.05]"
            >
              Adelaide removalists,
              <br />
              <span className="text-platinum-sheen">planned with precision.</span>
            </h1>

            <p
              style={{ '--d': '0.22s' } as React.CSSProperties}
              className="mrk-rise text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl"
            >
              House, apartment and office moves across Adelaide, coordinated directly with{' '}
              {mrkBusiness.ownerContactName.value}. Tell us about your move and get a clear quote.
            </p>

            <div
              style={{ '--d': '0.32s' } as React.CSSProperties}
              className="mrk-rise flex flex-col sm:flex-row gap-3 pt-1"
            >
              <button
                type="button"
                onClick={scrollToQuote}
                className="mrk-glow min-h-12 px-7 rounded-xl btn-ruby text-white text-base font-bold inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={mrkBusiness.phoneHref}
                className="min-h-12 px-7 rounded-xl btn-secondary text-[#F5F7FA] text-base font-semibold inline-flex items-center justify-center gap-2.5"
              >
                <Phone className="w-4 h-4 text-[#F2536F]" />
                <span>Call {mrkBusiness.phoneDisplay}</span>
              </a>
            </div>

            <p
              style={{ '--d': '0.42s' } as React.CSSProperties}
              className="mrk-rise flex items-start gap-2 text-sm text-[#E2E8F0] max-w-2xl"
            >
              <Clock className="w-4 h-4 text-[#F2536F] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong className="text-white">{formatIndicativeRateHeadline()}</strong>{' '}
                {getMandatoryRateDisclaimer()}
              </span>
            </p>
          </div>

          <div className="mrk-pop hidden lg:block lg:col-span-5">
            <div className="mrk-float rounded-3xl overflow-hidden border border-[#C9D2DC]/25 shadow-[0_30px_80px_-30px_rgba(200,16,54,0.55)]">
              <img
                src={mrkBusiness.brandAssets.logoFull}
                alt="MRK Removals Adelaide logo"
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>      </section>

      {/* 2. TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10">
        <TrustBanner />
      </section>

      {/* 3. SERVICES */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" aria-labelledby="services-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2
            id="services-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight max-w-2xl"
          >
            Moving services for every kind of move
          </h2>
          <a
            href="/services"
            onClick={go('/services')}
            className="text-sm font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap group"
          >
            <span>All services</span>
            <ArrowRight className="w-4 h-4 text-[#F2536F] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MRK_SERVICES.map((service) => (
            <article
              key={service.id}
              className="mrk-surface-interactive rounded-2xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-white tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[#C9D2DC] leading-relaxed">{service.summary}</p>
                <ul className="space-y-1.5 text-xs text-[#C9D2DC]">
                  {service.idealFor.slice(0, 3).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F2536F] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-[#C9D2DC]/15 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/services/${service.slug}`}
                  onClick={go(`/services/${service.slug}`)}
                  className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#FDA4AF]"
                >
                  <span>Explore {service.shortTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setPresetServiceType(service.slug);
                    scrollToQuote();
                  }}
                  className="min-h-11 px-4 rounded-lg text-sm font-semibold text-white bg-[#161E2E] hover:bg-[#C81036] cursor-pointer"
                >
                  Quote this service
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. PRICING & INCLUSIONS */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="pricing-heading">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 id="pricing-heading" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Clear, honest pricing
            </h2>
            <p className="text-5xl font-display font-extrabold text-white tabular-nums">
              $130–$135<span className="text-lg font-semibold text-[#C9D2DC]"> / hour</span>
            </p>
            <p className="text-sm text-[#C9D2DC] leading-relaxed">
              Indicative AUD hourly rate. {getMandatoryRateDisclaimer()}
            </p>
            <a
              href="/pricing"
              onClick={go('/pricing')}
              className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#FDA4AF]"
            >
              <span>How pricing works</span>
              <ArrowRight className="w-4 h-4 text-[#F2536F]" />
            </a>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A15C] mb-3">
              Confirmed in your quote
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#E2E8F0]">
              {[
                'Truck size & crew numbers',
                'What the hourly rate includes',
                '3-hour minimum booking',
                '1-hour call-out fee',
                'Rate includes GST',
                'Stairs & heavy-item handling',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 bg-[#090D15]/70 rounded-xl p-3 border border-[#C9D2DC]/15">
                  <CheckCircle2 className="w-4 h-4 text-[#F2536F] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="process-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <figure className="mrk-photo-zoom col-span-2 relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20">
              <ResponsiveImage
                src={mrkBusiness.photographyAssets.professionalWrapping}
                alt="Crew wrapping furniture in moving blankets"
                sizes="(min-width: 1024px) 40vw, 100vw"
                width={1448}
                height={1086}
                className="w-full h-52 sm:h-64 object-cover"
              />
            </figure>
            <figure className="mrk-photo-zoom col-span-2 relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20">
              <ResponsiveImage
                src={mrkBusiness.photographyAssets.apartmentRelocation}
                alt="Mover carrying a blanket-wrapped armchair through an apartment lobby"
                sizes="(min-width: 1024px) 40vw, 100vw"
                width={1086}
                height={1448}
                className="w-full h-52 sm:h-64 object-cover object-[50%_30%]"
              />
            </figure>
          </div>
          <div className="lg:col-span-7 space-y-5">
            <h2 id="process-heading" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How your move works
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROCESS_STEPS.map((step) => (
                <li key={step.num} className="mrk-surface rounded-2xl p-5 border border-[#C9D2DC]/15 space-y-1.5">
                  <span className="font-mono text-xs text-[#F2536F] font-bold tabular-nums">STEP {step.num}</span>
                  <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-[#C9D2DC] leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 6. QUOTE FORM */}
      <section
        ref={quoteSectionRef}
        id="quote-section"
        aria-label="Request a quote"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <QuoteForm
          sourcePage="/"
          initialServiceType={presetServiceType}
          initialEstimatedSize={presetSize}
          initialInventoryNotes={presetNotes}
        />
      </section>

      {/* 7. REVIEWS — intentionally omitted until verified customer reviews are supplied by the owner. */}

      {/* 8. COVERAGE */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" aria-labelledby="coverage-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 id="coverage-heading" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Adelaide coverage
          </h2>
          <a
            href="/service-areas"
            onClick={go('/service-areas')}
            className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9D2DC] hover:text-white"
          >
            <span>All service areas</span>
            <ArrowRight className="w-4 h-4 text-[#F2536F]" />
          </a>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Adelaide service corridors">
          {MRK_SERVICE_AREAS.map((area) => {
            const isSelected = area.slug === activeAreaSlug;
            return (
              <button
                key={area.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveAreaSlug(area.slug)}
                className={`min-h-11 px-4 rounded-xl text-sm font-semibold border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C81036] text-white border-[#C81036]'
                    : 'bg-[#0E1420] text-[#C9D2DC] border-[#C9D2DC]/20 hover:text-white'
                }`}
              >
                {area.shortName}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <p className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
              <span className="text-[#C5A15C] font-semibold">{selectedArea.regionGroup}</span>
              <span className="font-mono tabular-nums text-white">
                Postcodes: {selectedArea.postcodes.join(', ')}
              </span>
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{selectedArea.title}</h3>
            <p className="text-sm text-[#C9D2DC] leading-relaxed">{selectedArea.localMovingProfile}</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              <span className="font-semibold text-white">Key suburbs:</span> {selectedArea.keySuburbs.join(' · ')}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-end gap-2.5">
            <a
              href={`/service-areas/${selectedArea.slug}`}
              onClick={go(`/service-areas/${selectedArea.slug}`)}
              className="min-h-11 px-4 rounded-xl bg-[#161E2E] hover:bg-[#242A34] text-white text-sm font-semibold inline-flex items-center justify-center border border-[#C9D2DC]/20"
            >
              Read the {selectedArea.shortName} guide
            </a>
            <button
              type="button"
              onClick={scrollToQuote}
              className="min-h-11 px-4 rounded-xl btn-ruby text-white text-sm font-bold cursor-pointer"
            >
              Get a quote
            </button>
          </div>
        </div>
      </section>

      {/* 9. OPTIONAL INVENTORY BUILDER */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Optional inventory list">
        <button
          type="button"
          onClick={() => setShowInventory((v) => !v)}
          aria-expanded={showInventory}
          aria-controls="inventory-panel"
          className="w-full min-h-14 px-5 py-4 rounded-2xl mrk-surface border border-[#C9D2DC]/20 hover:border-[#C9D2DC]/40 flex items-center justify-between gap-4 text-left cursor-pointer"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#C5A15C]">Optional</span>
            <span className="block font-display text-base sm:text-lg font-bold text-white">
              Add an item list for a more accurate quote
            </span>
          </span>
          {showInventory ? (
            <ChevronUp className="w-5 h-5 text-[#F2536F] shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#C9D2DC] shrink-0" aria-hidden="true" />
          )}
        </button>
        {showInventory && (
          <div id="inventory-panel" className="mt-4">
            <MoveScopeBuilder
              onApplyScopeToQuote={(summary, sizeLabel) => {
                setPresetNotes(summary);
                setPresetSize(sizeLabel);
                scrollToQuote();
              }}
            />
          </div>
        )}
      </section>

      {/* 10. FAQ + CLOSING CTA */}
      <section className="mrk-reveal max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" aria-labelledby="faq-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 id="faq-heading" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently asked questions
          </h2>
          <a
            href="/faq"
            onClick={go('/faq')}
            className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9D2DC] hover:text-white"
          >
            <span>View all {MRK_FAQS.length} questions</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2536F]" />
          </a>
        </div>

        <div className="space-y-3">
          {MRK_FAQS.slice(0, 6).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="mrk-surface rounded-2xl border border-[#C9D2DC]/15 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="w-full min-h-14 px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#161E2E]/50 cursor-pointer"
                >
                  <span className="font-display text-base font-semibold text-white">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#F2536F] shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C9D2DC] shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${faq.id}`}
                    className="px-5 pb-5 pt-3 text-sm text-[#C9D2DC] leading-relaxed border-t border-[#C9D2DC]/10"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl px-6 py-16 sm:py-24 border border-[#C9D2DC]/25 text-center space-y-6">
          <ResponsiveImage
            src={mrkBusiness.photographyAssets.heroTruckCinematic}
            alt=""
            sizes="(min-width: 1024px) 960px, 100vw"
            width={1672}
            height={941}
            className="mrk-drive absolute inset-0 -z-20 h-full w-full object-cover object-[60%_72%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#090D15]/85 via-[#090D15]/35 to-[#090D15]/10" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to plan your move?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={scrollToQuote}
              className="min-h-12 px-7 rounded-xl btn-ruby text-white font-bold cursor-pointer"
            >
              Get a Free Quote
            </button>
            <a
              href={mrkBusiness.phoneHref}
              className="min-h-12 px-7 rounded-xl btn-secondary text-[#F5F7FA] font-semibold inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#F2536F]" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
