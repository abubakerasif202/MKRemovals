import React, { useState, useRef } from 'react';
import { Phone, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { MRK_SERVICES } from '../content/services';
import { MRK_SERVICE_AREAS } from '../content/service-areas';
import { MRK_FAQS } from '../content/faqs';
import { CinematicTruckScene } from '../components/brand/CinematicTruckScene';
import { TrustBanner } from '../components/brand/TrustBanner';
import { MoveScopeBuilder } from '../components/interactive/MoveScopeBuilder';
import { QuoteForm } from '../components/forms/QuoteForm';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [presetSize, setPresetSize] = useState<string>('3–4 Bedroom Home');
  const [presetNotes, setPresetNotes] = useState<string>('');
  const [activeAreaSlug, setActiveAreaSlug] = useState<string>(MRK_SERVICE_AREAS[0].slug);
  const [openFaqId, setOpenFaqId] = useState<string>(MRK_FAQS[0].id);

  const quoteSectionRef = useRef<HTMLElement>(null);

  const scrollToQuote = () => {
    quoteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHeroPreset = (size: string) => {
    setPresetSize(size);
    scrollToQuote();
  };

  const handleApplyScope = (summary: string, sizeLabel: string) => {
    setPresetNotes(summary);
    setPresetSize(sizeLabel);
    scrollToQuote();
  };

  const selectedArea =
    MRK_SERVICE_AREAS.find((a) => a.slug === activeAreaSlug) || MRK_SERVICE_AREAS[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 overflow-hidden">
        {/* Subtle Radial Atmospheric Backdrop */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(200, 16, 54, 0.14), transparent 45%), radial-gradient(circle at 82% 30%, rgba(18, 79, 163, 0.18), transparent 50%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Value Proposition & Primary CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
                  <span className="text-[#C5A15C] font-semibold">Adelaide, South Australia</span>
                  <span aria-hidden="true">·</span>
                  <span>Houses, Apartments, Offices &amp; Furniture</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">ABN {mrkBusiness.abn.value}</span>
                </div>

                <h1
                  className="font-display font-extrabold text-white tracking-tight leading-[1.08]"
                  style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)' }}
                >
                  Moving in Adelaide, planned with precision.
                </h1>

                <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed max-w-xl">
                  From multi-bedroom homes in the Eastern Suburbs and Adelaide Hills to timed
                  CBD apartment lift windows, <strong className="text-white">MRK Removals Adelaide</strong>{' '}
                  coordinates your move with careful furniture protection and direct communication.
                </p>

                {/* Honest Indicative Rate Strip */}
                <div className="bg-[#0E1420]/90 rounded-xl p-4 border border-[#C9D2DC]/18 space-y-1.5 max-w-xl">
                  <p className="text-sm font-semibold text-white">
                    {formatIndicativeRateHeadline()}
                  </p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {getMandatoryRateDisclaimer()}
                  </p>
                </div>
              </div>

              {/* Primary CTA Pair */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={scrollToQuote}
                    className="px-6 py-3.5 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={mrkBusiness.phoneHref}
                    className="px-6 py-3.5 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-[#F5F7FA] border border-[#C9D2DC]/25 text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#C81036]" />
                    <span>Call {mrkBusiness.phoneDisplay}</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8]">
                  <span>Direct contact: {mrkBusiness.ownerContactName.value}</span>
                  <span aria-hidden="true">·</span>
                  <span>No blind automated checkout</span>
                  <span aria-hidden="true">·</span>
                  <span>Scope &amp; access confirmed before moving day</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Cinematic MRK Truck & Adelaide Skyline Stage */}
            <div className="lg:col-span-6 flex">
              <CinematicTruckScene onSelectQuoteWithMode={handleHeroPreset} />
            </div>
          </div>

          {/* 2. TRUST BANNER BELOW HERO SPLIT */}
          <div className="mt-10">
            <TrustBanner />
          </div>
        </div>
      </section>

      {/* 3. CORE MOVING SERVICES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs text-[#C5A15C] font-medium">
              Confirmed Adelaide Relocation Capabilities
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Moving Services Tailored to Your Property &amp; Load
            </h2>
          </div>
          <a
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/services');
            }}
            className="text-xs sm:text-sm font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>View All Services &amp; Checklists</span>
            <ArrowRight className="w-4 h-4 text-[#C81036]" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MRK_SERVICES.map((service) => {
            const isWide = service.featuredSpan === 'wide';
            return (
              <article
                key={service.id}
                className={`mrk-surface-interactive rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 ${
                  isWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#C9D2DC]">
                    <span>{service.kicker}</span>
                    <span className="font-mono text-[#C5A15C] tabular-nums">
                      {service.indexNumber}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {service.indexNumber}. {service.title}
                  </h3>

                  <p className="text-sm text-[#C9D2DC] leading-relaxed">{service.summary}</p>

                  <ul className="pt-2 space-y-1.5 text-xs text-[#94A3B8]">
                    {service.idealFor.slice(0, 3).map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="text-[#C81036] font-bold" aria-hidden="true">
                          —
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#C9D2DC]/12 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`/services/${service.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/services/${service.slug}`);
                    }}
                    className="text-xs font-semibold text-white hover:text-[#C81036] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <span>Explore {service.shortTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPresetSize(service.shortTitle);
                      scrollToQuote();
                    }}
                    className="text-xs font-medium text-[#C9D2DC] hover:text-white underline cursor-pointer whitespace-nowrap"
                  >
                    Quote This Service
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. MOVING DAY EXPERIENCE & PRACTICAL GUIDANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mrk-surface rounded-2xl p-6 sm:p-10 border border-[#C9D2DC]/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs text-[#C5A15C] font-medium">
              Preparation &amp; Care Standards
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              What a Well-Planned Adelaide Moving Day Looks Like
            </h2>
            <p className="text-sm text-[#C9D2DC] leading-relaxed">
              Smooth relocations happen before the first box is lifted. By reviewing your access
              path, doorway clearances, and heavy items ahead of time, we keep loading methodical
              and protect your furniture and property walls.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <img
                src={mrkBusiness.brandAssets.roundCrestConcept}
                alt="MRK Removals Adelaide Round Crest Brand Concept"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-contain bg-[#090D15] p-1 border border-[#C9D2DC]/20 shrink-0"
              />
              <div className="text-xs text-[#94A3B8] space-y-1">
                <p className="text-white font-semibold">
                  Clear Communication from First Call to Unload
                </p>
                <p>
                  Have a tricky staircase or tight settlement handover? Call{' '}
                  <a href={mrkBusiness.phoneHref} className="text-white underline font-mono">
                    {mrkBusiness.phoneDisplay}
                  </a>{' '}
                  to talk through your layout.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: '01. Access & Parking Assessment',
                desc: 'We check driveway gradients, street tree clearance, and apartment loading dock heights so the truck positions safely.',
              },
              {
                step: '02. Furniture Wrapping & Strapping',
                desc: 'Timber buffets, mattresses, lounges, and upright fridges are positioned and strapped against internal tie rails.',
              },
              {
                step: '03. Balanced Tier Loading',
                desc: 'Heavy appliances and dense book cartons form the stable base layer; fragile boxes and awkward pieces sit secured above.',
              },
              {
                step: '04. Room-by-Room Placement',
                desc: 'At your destination address, beds, lounges, and labelled boxes are placed directly into their designated rooms.',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="bg-[#090D15]/90 rounded-xl p-5 border border-[#C9D2DC]/15 space-y-2"
              >
                <h3 className="font-display text-base font-semibold text-white">{card.step}</h3>
                <p className="text-xs text-[#C9D2DC] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE MOVE SCOPE BUILDER & HONEST PRICING TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <MoveScopeBuilder onApplyScopeToQuote={handleApplyScope} />
      </section>

      {/* 6. HOW YOUR MOVE WORKS (5 REALISTIC STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs text-[#C5A15C] font-medium">Step-by-Step Process</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            How Your Move Works with MRK Removals Adelaide
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'Submit Quote or Call',
              body: 'Send your pickup and destination suburbs, target date, and rough inventory—or call 0423 653 342.',
            },
            {
              num: '02',
              title: 'Discuss Requirements',
              body: 'We review property access, stairs, lift windows, heavy items, and any disassembly needs.',
            },
            {
              num: '03',
              title: 'Confirm Scope & Rate',
              body: 'We confirm your hourly rate ($130–$135/hr indicative range), inclusions, minimum hours, and GST terms.',
            },
            {
              num: '04',
              title: 'Lock In Your Schedule',
              body: 'Once you approve the quoted terms, we confirm your moving date and arrival window.',
            },
            {
              num: '05',
              title: 'Moving Day Execution',
              body: 'Systematic loading, secure transit across Adelaide, and placement into your new rooms.',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="mrk-surface rounded-xl p-5 border border-[#C9D2DC]/15 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#C81036] font-semibold tabular-nums">
                  STEP {step.num}
                </span>
                <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-[#C9D2DC] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ADELAIDE SERVICE AREAS DIRECTORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs text-[#C5A15C] font-medium">
              Local Adelaide Route Knowledge
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Adelaide Service Corridors &amp; Suburb Access Guide
            </h2>
          </div>
          <a
            href="/service-areas"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/service-areas');
            }}
            className="text-xs sm:text-sm font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Open Full Adelaide Suburb Directory</span>
            <ArrowRight className="w-4 h-4 text-[#C81036]" />
          </a>
        </div>

        {/* Interactive Corridor Selector Tabs */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Adelaide Service Corridors">
          {MRK_SERVICE_AREAS.map((area) => {
            const isSelected = area.slug === activeAreaSlug;
            return (
              <button
                key={area.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveAreaSlug(area.slug)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C81036] text-white border-[#C81036]'
                    : 'bg-[#0E1420] text-[#C9D2DC] border-[#C9D2DC]/15 hover:text-white'
                }`}
              >
                {area.shortName}
              </button>
            );
          })}
        </div>

        {/* Active Corridor Details Panel */}
        <div className="mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/20 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
              <span className="text-[#C5A15C] font-semibold">{selectedArea.regionGroup}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Postcodes: {selectedArea.postcodes.join(', ')}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white">{selectedArea.title}</h3>
            <p className="text-sm text-[#C9D2DC] leading-relaxed">
              {selectedArea.localMovingProfile}
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-white">
                Local Access &amp; Parking Considerations:
              </p>
              <ul className="space-y-1.5 text-xs text-[#C9D2DC]">
                {selectedArea.accessAndParkingConsiderations.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-[#C81036] font-bold" aria-hidden="true">
                      ·
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#090D15] rounded-xl p-5 border border-[#C9D2DC]/15 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white">
                Key Suburbs in This Corridor:
              </p>
              <p className="text-xs text-[#C9D2DC] leading-relaxed">
                {selectedArea.keySuburbs.join(' · ')}
              </p>

              <p className="text-xs font-semibold text-white pt-2">
                Primary Arterial Routes:
              </p>
              <p className="text-xs text-[#94A3B8]">
                {selectedArea.arterialCorridors.join(' · ')}
              </p>
            </div>

            <div className="pt-4 border-t border-[#C9D2DC]/15 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`/service-areas/${selectedArea.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/service-areas/${selectedArea.slug}`);
                }}
                className="flex-1 py-2.5 px-3.5 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white text-xs font-semibold text-center border border-[#C9D2DC]/20 transition-colors"
              >
                Read Corridor Guide
              </a>
              <button
                type="button"
                onClick={() => {
                  scrollToQuote();
                }}
                className="flex-1 py-2.5 px-3.5 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Quote {selectedArea.shortName}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EMBEDDED QUOTE ENQUIRY FORM */}
      <section
        ref={quoteSectionRef}
        id="quote-section"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <QuoteForm
          sourcePage="/"
          initialEstimatedSize={presetSize}
          initialInventoryNotes={presetNotes}
        />
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#C5A15C] font-medium">Practical Answers</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <a
            href="/faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/faq');
            }}
            className="text-xs font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5"
          >
            <span>View All {MRK_FAQS.length} FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C81036]" />
          </a>
        </div>

        <div className="space-y-3">
          {MRK_FAQS.slice(0, 6).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="mrk-surface rounded-xl border border-[#C9D2DC]/15 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#161E2E]/50 transition-colors cursor-pointer"
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C81036] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C9D2DC] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#C9D2DC] leading-relaxed border-t border-[#C9D2DC]/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
