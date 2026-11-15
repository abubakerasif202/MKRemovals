import React, { useRef, useState } from 'react';
import {
  Phone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
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
import { MRKVectorEmblem } from '../components/brand/MRKLogo';
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
          src={mrkBusiness.photographyAssets.professionalWrapping}
          alt="MRK Removals crew wrapping furniture in moving blankets in a bright Adelaide home"
          priority
          sizes="100vw"
          width={1448}
          height={1086}
          className="mrk-kenburns absolute inset-0 -z-20 h-full w-full object-cover object-[72%_22%]"
        />
        {/* Bright wash: full on mobile for legibility, left-to-right fade on desktop so the photo shines through. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-white/93 via-white/86 to-white/72 lg:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 36%, rgba(255,255,255,0.4) 66%, rgba(255,255,255,0.05) 100%), radial-gradient(circle at 8% 15%, rgba(200,16,54,0.10), transparent 45%)',
          }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[#F7FAFE]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-16 sm:pb-16 lg:pt-24 lg:pb-24 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Mobile-Only Brand Crest Header */}
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/95 border border-[#D7E0EC] shadow-md flex items-center justify-center p-2 mrk-float-gentle shrink-0">
                <MRKVectorEmblem className="w-full h-full" variant="color" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-[#0B1B33]">MRK Removals Adelaide</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E8EEF7] text-[#124FA3]">ABN Verified</span>
                </div>
                <p className="text-xs text-[#5B6B80]">Adelaide Owned &amp; Operated · Direct with Moe</p>
              </div>
            </div>

            <div
              style={{ '--d': '0.05s' } as React.CSSProperties}
              className="mrk-rise inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3F7FC]/95 backdrop-blur-xs border border-[#D7E0EC] text-xs font-medium text-[#0B1B33] shadow-xs"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0" aria-hidden="true">
                <span className="mrk-pulse-beacon absolute inline-flex h-full w-full rounded-full bg-[#C81036]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C81036]" />
              </span>
              <span>Adelaide, South Australia · Residential &amp; Commercial Removals</span>
            </div>

            <h1
              id="hero-heading"
              style={{ fontSize: 'clamp(2.1rem, 6vw, 4.2rem)', '--d': '0.12s' } as React.CSSProperties}
              className="mrk-rise font-display font-extrabold text-[#0B1B33] tracking-tight leading-[1.08] sm:leading-[1.05]"
            >
              Adelaide removalists,
              <br />
              <span className="text-platinum-sheen">planned with precision.</span>
            </h1>

            <p
              style={{ '--d': '0.2s' } as React.CSSProperties}
              className="mrk-rise text-base sm:text-lg text-[#33445C] leading-relaxed max-w-2xl"
            >
              House, apartment and office moves across Adelaide, coordinated directly with{' '}
              <strong className="font-semibold text-[#0B1B33]">{mrkBusiness.ownerContactName.value}</strong>. Tell us about your move and get a clear quote.
            </p>

            {/* Quick Confidence Pillars: Mobile & Desktop Hero Micro-Pills */}
            <div
              style={{ '--d': '0.26s' } as React.CSSProperties}
              className="mrk-rise grid grid-cols-3 gap-2 sm:gap-3 max-w-xl pt-0.5"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C81036] shrink-0" aria-hidden="true" />
                <span className="truncate">$1M Insurance</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                <Truck className="w-3.5 h-3.5 text-[#124FA3] shrink-0" aria-hidden="true" />
                <span className="truncate">2-Man + Truck</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8A6414] shrink-0" aria-hidden="true" />
                <span className="truncate">Zero Hidden Fees</span>
              </div>
            </div>

            <div
              style={{ '--d': '0.32s' } as React.CSSProperties}
              className="mrk-rise flex flex-col sm:flex-row gap-3 pt-1"
            >
              <button
                type="button"
                onClick={scrollToQuote}
                className="mrk-glow min-h-12 px-7 rounded-xl btn-ruby text-white text-base font-bold inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={mrkBusiness.phoneHref}
                className="min-h-12 px-7 rounded-xl btn-secondary text-[#0B1B33] text-base font-semibold inline-flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
              >
                <Phone className="w-4 h-4 text-[#C81036]" />
                <span>Call {mrkBusiness.phoneDisplay}</span>
              </a>
            </div>

            {/* Honest Upfront Rates Card */}
            <div
              style={{ '--d': '0.4s' } as React.CSSProperties}
              className="mrk-rise mrk-surface-elevated rounded-2xl p-4 sm:p-5 border border-[#D7E0EC] shadow-xs max-w-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8EEF7] border border-[#D7E0EC] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#C81036]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm sm:text-base font-bold text-[#0B1B33]">
                      {formatIndicativeRateHeadline()}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8EEF7] text-[#124FA3] border border-[#D7E0EC]">
                      GST Included Upfront
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#33445C] leading-relaxed">
                    {getMandatoryRateDisclaimer()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mrk-pop hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative">
              {/* Soft white halo so the emblem reads cleanly over the photo. */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 scale-110 rounded-full bg-white/70 blur-2xl" />
              <img
                src={mrkBusiness.brandAssets.logoFull}
                alt="MRK Removals Adelaide emblem"
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                className="mrk-float w-full max-w-[380px] h-auto drop-shadow-[0_24px_40px_rgba(11,27,51,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10">
        <TrustBanner />
      </section>

      {/* 3. SERVICES */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" aria-labelledby="services-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2
            id="services-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight max-w-2xl"
          >
            Moving services for every kind of move
          </h2>
          <a
            href="/services"
            onClick={go('/services')}
            className="text-sm font-semibold text-[#33445C] hover:text-[#C81036] inline-flex items-center gap-1.5 whitespace-nowrap group"
          >
            <span>All services</span>
            <ArrowRight className="w-4 h-4 text-[#C81036] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MRK_SERVICES.map((service) => (
            <article
              key={service.id}
              className="mrk-surface-interactive rounded-2xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-[#0B1B33] tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[#33445C] leading-relaxed">{service.summary}</p>
                <ul className="space-y-1.5 text-xs text-[#33445C]">
                  {service.idealFor.slice(0, 3).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-[#D7E0EC] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/services/${service.slug}`}
                  onClick={go(`/services/${service.slug}`)}
                  className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1B33] hover:text-[#C81036]"
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
                  className="min-h-11 px-4 rounded-lg text-sm font-semibold text-[#0B1B33] bg-[#E8EEF7] hover:bg-[#C81036] cursor-pointer hover:text-[#C81036]"
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
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 id="pricing-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
              Clear, honest pricing
            </h2>
            <p className="text-5xl font-display font-extrabold text-[#0B1B33] tabular-nums">
              $130–$135<span className="text-lg font-semibold text-[#33445C]"> / hour</span>
            </p>
            <p className="text-sm text-[#33445C] leading-relaxed">
              Indicative AUD hourly rate. {getMandatoryRateDisclaimer()}
            </p>
            <a
              href="/pricing"
              onClick={go('/pricing')}
              className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1B33] hover:text-[#C81036]"
            >
              <span>How pricing works</span>
              <ArrowRight className="w-4 h-4 text-[#C81036]" />
            </a>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6414] mb-3">
              Confirmed in your quote
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#33445C]">
              {[
                'Truck size & crew numbers',
                'What the hourly rate includes',
                '3-hour minimum booking',
                '1-hour call-out fee',
                'Rate includes GST',
                'Stairs & heavy-item handling',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 bg-[#F3F7FC] rounded-xl p-3 border border-[#D7E0EC]">
                  <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
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
            <figure className="mrk-photo-zoom col-span-2 relative rounded-2xl overflow-hidden border border-[#D7E0EC]">
              <ResponsiveImage
                src={mrkBusiness.photographyAssets.professionalWrapping}
                alt="Crew wrapping furniture in moving blankets"
                sizes="(min-width: 1024px) 40vw, 100vw"
                width={1448}
                height={1086}
                className="w-full h-52 sm:h-64 object-cover"
              />
            </figure>
            <figure className="mrk-photo-zoom col-span-2 relative rounded-2xl overflow-hidden border border-[#D7E0EC]">
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
            <h2 id="process-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
              How your move works
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROCESS_STEPS.map((step) => (
                <li key={step.num} className="mrk-surface rounded-2xl p-5 border border-[#D7E0EC] space-y-1.5">
                  <span className="font-mono text-xs text-[#C81036] font-bold tabular-nums">STEP {step.num}</span>
                  <h3 className="font-display text-base font-bold text-[#0B1B33]">{step.title}</h3>
                  <p className="text-sm text-[#33445C] leading-relaxed">{step.body}</p>
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
          <h2 id="coverage-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
            Adelaide coverage
          </h2>
          <a
            href="/service-areas"
            onClick={go('/service-areas')}
            className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#33445C] hover:text-[#C81036]"
          >
            <span>All service areas</span>
            <ArrowRight className="w-4 h-4 text-[#C81036]" />
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
                    : 'bg-[#F3F7FC] text-[#33445C] border-[#D7E0EC] hover:text-[#C81036]'
                }`}
              >
                {area.shortName}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <p className="flex flex-wrap items-center gap-2 text-xs text-[#33445C]">
              <MapPin className="w-3.5 h-3.5 text-[#124FA3]" aria-hidden="true" />
              <span className="text-[#8A6414] font-semibold">{selectedArea.regionGroup}</span>
              <span className="font-mono tabular-nums text-[#0B1B33]">
                Postcodes: {selectedArea.postcodes.join(', ')}
              </span>
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B33]">{selectedArea.title}</h3>
            <p className="text-sm text-[#33445C] leading-relaxed">{selectedArea.localMovingProfile}</p>
            <p className="text-xs text-[#5B6B80] leading-relaxed">
              <span className="font-semibold text-[#0B1B33]">Key suburbs:</span> {selectedArea.keySuburbs.join(' · ')}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-end gap-2.5">
            <a
              href={`/service-areas/${selectedArea.slug}`}
              onClick={go(`/service-areas/${selectedArea.slug}`)}
              className="min-h-11 px-4 rounded-xl bg-[#E8EEF7] hover:bg-[#DCE5F2] text-[#0B1B33] text-sm font-semibold inline-flex items-center justify-center border border-[#D7E0EC]"
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
          className="w-full min-h-14 px-5 py-4 rounded-2xl mrk-surface border border-[#D7E0EC] hover:border-[#B5C3D8] flex items-center justify-between gap-4 text-left cursor-pointer"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#8A6414]">Optional</span>
            <span className="block font-display text-base sm:text-lg font-bold text-[#0B1B33]">
              Add an item list for a more accurate quote
            </span>
          </span>
          {showInventory ? (
            <ChevronUp className="w-5 h-5 text-[#C81036] shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#33445C] shrink-0" aria-hidden="true" />
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
          <h2 id="faq-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
            Frequently asked questions
          </h2>
          <a
            href="/faq"
            onClick={go('/faq')}
            className="min-h-11 inline-flex items-center gap-1.5 text-sm font-semibold text-[#33445C] hover:text-[#C81036]"
          >
            <span>View all {MRK_FAQS.length} questions</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C81036]" />
          </a>
        </div>

        <div className="space-y-3">
          {MRK_FAQS.slice(0, 6).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="mrk-surface rounded-2xl border border-[#D7E0EC] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="w-full min-h-14 px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#EEF3FA] cursor-pointer"
                >
                  <span className="font-display text-base font-semibold text-[#0B1B33]">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C81036] shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#33445C] shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${faq.id}`}
                    className="px-5 pb-5 pt-3 text-sm text-[#33445C] leading-relaxed border-t border-[#D7E0EC]"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl px-6 py-16 sm:py-24 text-center space-y-6 bg-gradient-to-br from-[#A80D2D] via-[#C81036] to-[#124FA3] shadow-[0_30px_60px_-24px_rgba(200,16,54,0.55)]">
          <ResponsiveImage
            src={mrkBusiness.photographyAssets.heroTruckCinematic}
            alt=""
            sizes="(min-width: 1024px) 960px, 100vw"
            width={1672}
            height={941}
            className="mrk-drive absolute inset-0 -z-20 h-full w-full object-cover object-[60%_72%] opacity-35 mix-blend-soft-light"
          />
          <div aria-hidden="true" className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to plan your move?
          </h2>
          <p className="text-white/90 text-sm sm:text-base">Tell us about your move and get a clear quote.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={scrollToQuote}
              className="min-h-12 px-7 rounded-xl bg-white text-[#A00E2C] font-bold cursor-pointer shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Get a Free Quote
            </button>
            <a
              href={mrkBusiness.phoneHref}
              className="min-h-12 px-7 rounded-xl border border-white/70 text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/15 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
          </div>
        </div>      </section>
    </div>
  );
};
