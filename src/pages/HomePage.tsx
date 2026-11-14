import React, { useState, useRef } from 'react';
import { Phone, ArrowRight, ChevronDown, ChevronUp, ShieldCheck, MapPin, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
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
    <div className="space-y-24 sm:space-y-32 pb-20 overflow-x-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 overflow-hidden">
        {/* Atmospheric Radial Gradients */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(200, 16, 54, 0.18), transparent 45%), radial-gradient(circle at 85% 30%, rgba(18, 79, 163, 0.22), transparent 50%), radial-gradient(circle at 50% 80%, rgba(197, 161, 92, 0.08), transparent 40%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Value Proposition & Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2"
            >
              <div className="space-y-5">
                {/* Live Status Pill & Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1420] border border-[#C9D2DC]/25 text-white font-medium shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#C81036] animate-pulse" />
                    <span>Adelaide, South Australia</span>
                  </span>
                  <span className="text-[#94A3B8]" aria-hidden="true">·</span>
                  <span className="text-[#C9D2DC] font-medium">Residential &amp; Commercial Removals</span>
                  <span className="text-[#94A3B8]" aria-hidden="true">·</span>
                  <span className="font-mono text-[#C5A15C] tabular-nums font-semibold">
                    ABN {mrkBusiness.abn.value}
                  </span>
                </div>

                <h1
                  className="font-display font-extrabold text-white tracking-tight leading-[1.06]"
                  style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.85rem)' }}
                >
                  Moving in Adelaide, <br />
                  <span className="text-platinum-sheen">planned with precision.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#C9D2DC] leading-relaxed max-w-xl font-normal">
                  From multi-bedroom family homes in the Eastern Suburbs and Adelaide Hills to timed
                  CBD apartment lift bookings, <strong className="text-white font-semibold">MRK Removals Adelaide</strong>{' '}
                  delivers meticulous furniture protection, realistic pantechnicon fleet transport, and direct owner communication.
                </p>

                {/* Honest Indicative Rate Highlight Box */}
                <div className="mrk-surface-elevated rounded-2xl p-4 sm:p-5 border border-[#C9D2DC]/25 space-y-2 max-w-xl">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C81036]" />
                      <span>{formatIndicativeRateHeadline()}</span>
                    </p>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C5A15C]/15 text-[#C5A15C] border border-[#C5A15C]/30 font-semibold uppercase">
                      AUD Rates
                    </span>
                  </div>
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
                    className="px-6 py-3.5 rounded-xl btn-ruby text-white text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg active:scale-98"
                  >
                    <span>Request a Detailed Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={mrkBusiness.phoneHref}
                    className="px-6 py-3.5 rounded-xl btn-secondary text-[#F5F7FA] text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2.5 transition-all whitespace-nowrap shrink-0 active:scale-98"
                  >
                    <Phone className="w-4 h-4 text-[#C81036]" />
                    <span>Call {mrkBusiness.phoneDisplay}</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8]">
                  <span className="text-[#C9D2DC] font-medium">Direct leadership: {mrkBusiness.ownerContactName.value}</span>
                  <span aria-hidden="true">·</span>
                  <span>No automated third-party broker</span>
                  <span aria-hidden="true">·</span>
                  <span>Full access review before dispatch</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Cinematic MRK Truck & Adelaide Skyline Stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <CinematicTruckScene onSelectQuoteWithMode={handleHeroPreset} />
            </motion.div>
          </div>

          {/* 2. TRUST BANNER BELOW HERO SPLIT */}
          <div className="mt-12 sm:mt-16">
            <TrustBanner />
          </div>
        </div>
      </section>

      {/* 3. CORE MOVING SERVICES BENTO GRID WITH PHOTOGRAPHIC SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Full Adelaide Relocation Portfolio</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Moving Services Tailored to Your Property &amp; Load
            </h2>
          </div>
          <a
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/services');
            }}
            className="text-xs sm:text-sm font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 group transition-colors"
          >
            <span>Explore All 6 Services &amp; Checklists</span>
            <ArrowRight className="w-4 h-4 text-[#C81036] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MRK_SERVICES.map((service) => {
            const isWide = service.featuredSpan === 'wide';
            const isApartment = service.id === 'apartment-strata-moves';
            const isOffice = service.id === 'office-commercial-relocations';

            return (
              <article
                key={service.id}
                className={`mrk-surface-interactive rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 ${
                  isWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div className="space-y-4">
                  {/* Visual Header Pill / Kicker */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#C9D2DC]">
                    <span className="font-medium text-[#C5A15C] uppercase tracking-wider">{service.kicker}</span>
                    <span className="font-mono text-[#C9D2DC] tabular-nums font-semibold px-2 py-0.5 rounded bg-[#161E2E] border border-[#C9D2DC]/20">
                      {service.indexNumber}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#C9D2DC] leading-relaxed">{service.summary}</p>

                  {/* Contextual Photography Insert for Wide / Featured Cards */}
                  {isWide && (
                    <div className="relative rounded-xl overflow-hidden border border-[#C9D2DC]/20 h-44 sm:h-52 my-3 group">
                      <img
                        src={mrkBusiness.photographyAssets.professionalWrapping}
                        alt="MRK Removals Adelaide residential house removal with protective quilted blankets"
                        className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                        <span className="font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#C81036]" />
                          White-Glove Furniture Wrapping &amp; Pantechnicon Transport
                        </span>
                        <span className="font-mono text-[11px] text-[#C5A15C]">STANDARD INCLUSION</span>
                      </div>
                    </div>
                  )}

                  {isApartment && (
                    <div className="relative rounded-xl overflow-hidden border border-[#C9D2DC]/20 h-36 my-3 group">
                      <img
                        src={mrkBusiness.photographyAssets.apartmentRelocation}
                        alt="MRK Removals Adelaide apartment and strata relocation service"
                        className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-semibold">Loading Dock &amp; Lift Windows</span>
                        <span className="font-mono text-[10px] text-[#38BDF8]">CBD &amp; STRATA</span>
                      </div>
                    </div>
                  )}

                  {isOffice && (
                    <div className="relative rounded-xl overflow-hidden border border-[#C9D2DC]/20 h-36 my-3 group">
                      <img
                        src={mrkBusiness.photographyAssets.officeRelocation}
                        alt="MRK Removals Adelaide commercial office relocation service"
                        className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-semibold">Crated IT &amp; Workstations</span>
                        <span className="font-mono text-[10px] text-[#C5A15C]">COMMERCIAL</span>
                      </div>
                    </div>
                  )}

                  <ul className="pt-2 space-y-1.5 text-xs text-[#C9D2DC]">
                    {service.idealFor.slice(0, 3).map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#C9D2DC]/15 flex flex-wrap items-center justify-between gap-3">
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
                    className="text-xs font-semibold text-[#C9D2DC] hover:text-white px-2.5 py-1 rounded-md bg-[#161E2E] hover:bg-[#C81036] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Quote This Service
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. MOVING DAY EXPERIENCE & PRACTICAL CARE STANDARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81036]/15 border border-[#C81036]/30 text-xs text-white font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C81036]" />
              <span>Preparation &amp; Care Standards</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              What a Well-Planned Adelaide Moving Day Looks Like
            </h2>

            <p className="text-sm text-[#C9D2DC] leading-relaxed">
              Smooth relocations happen before the first box is lifted. By reviewing your access
              gradient, door clearances, and heavy timber pieces ahead of time, we keep loading methodical
              and protect your furniture and property walls.
            </p>

            {/* Photographic Quality Seal Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20 shadow-xl group">
              <img
                src={mrkBusiness.photographyAssets.professionalWrapping}
                alt="MRK Removals Adelaide careful furniture wrapping"
                className="w-full h-48 sm:h-56 object-cover object-center filter brightness-[0.9] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-[#090D15]/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C81036]" />
                  Quilted Moving Blankets &amp; Neoprene Floor Runners
                </span>
                <span className="font-mono text-[10px] text-[#C5A15C]">STANDARD CARE</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <img
                src={mrkBusiness.brandAssets.roundCrestConcept}
                alt="MRK Removals Adelaide Round Crest Brand Concept"
                className="w-14 h-14 rounded-xl object-contain bg-[#090D15] p-1 border border-[#C9D2DC]/20 shrink-0"
              />
              <div className="text-xs text-[#94A3B8] space-y-1">
                <p className="text-white font-semibold">
                  Direct Coordination from First Call to Unload
                </p>
                <p>
                  Have a narrow heritage laneway or tight settlement handover? Call{' '}
                  <a href={mrkBusiness.phoneHref} className="text-white underline font-mono">
                    {mrkBusiness.phoneDisplay}
                  </a>{' '}
                  to talk through your floorplan with Mubashar.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: '01. Access & Parking Assessment',
                desc: 'We inspect driveway gradients, street tree overhangs, and apartment loading dock clearance heights so the truck docks securely.',
              },
              {
                step: '02. Furniture Wrapping & Strapping',
                desc: 'Timber buffets, mattresses, modular lounges, and upright fridges are padded and securely strapped against internal tie rails.',
              },
              {
                step: '03. Balanced Tier Loading',
                desc: 'Heavy appliances and dense book cartons form the stable base layer; fragile cartons and awkward pieces sit secured above.',
              },
              {
                step: '04. Room-by-Room Placement',
                desc: 'At your destination address, beds, lounges, dining suites, and labelled cartons are placed directly into their designated rooms.',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="bg-[#090D15]/90 rounded-2xl p-5 border border-[#C9D2DC]/15 space-y-2.5 shadow-md hover:border-[#C81036]/40 transition-colors"
              >
                <h3 className="font-display text-base font-bold text-white">{card.step}</h3>
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
          <p className="text-xs text-[#C5A15C] font-semibold uppercase tracking-wider">Step-by-Step Execution</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
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
              className="mrk-surface rounded-2xl p-5 border border-[#C9D2DC]/15 flex flex-col justify-between space-y-4 hover:border-[#C81036]/40 transition-colors shadow-md"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#C81036] font-bold tabular-nums">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Adelaide Metropolitan Knowledge</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Adelaide Service Corridors &amp; Suburb Access Guide
            </h2>
          </div>
          <a
            href="/service-areas"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/service-areas');
            }}
            className="text-xs sm:text-sm font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 group transition-colors"
          >
            <span>Open Full Adelaide Suburb Directory</span>
            <ArrowRight className="w-4 h-4 text-[#C81036] transition-transform group-hover:translate-x-1" />
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
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C81036] text-white border-[#C81036] shadow-md'
                    : 'bg-[#0E1420] text-[#C9D2DC] border-[#C9D2DC]/20 hover:text-white hover:bg-[#161E2E]'
                }`}
              >
                {area.shortName}
              </button>
            );
          })}
        </div>

        {/* Active Corridor Details Panel with Adelaide Skyline Photography */}
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
              <span className="text-[#C5A15C] font-semibold">{selectedArea.regionGroup}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-white">
                Postcodes: {selectedArea.postcodes.join(', ')}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {selectedArea.title}
            </h3>
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

          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            {/* Adelaide Skyline Photo Feature */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9D2DC]/20 h-44 shadow-xl group">
              <img
                src={mrkBusiness.photographyAssets.adelaideSkylineTwilight}
                alt="Adelaide City Skyline and River Torrens panorama"
                className="w-full h-full object-cover object-center filter brightness-[0.95] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Adelaide Metro &amp; Hills Coverage
                </span>
                <span className="font-mono text-[10px] text-[#C5A15C]">LOCAL DISPATCH</span>
              </div>
            </div>

            <div className="bg-[#090D15] rounded-xl p-4 border border-[#C9D2DC]/15 space-y-2 text-xs">
              <p className="font-semibold text-white">Key Suburbs:</p>
              <p className="text-[#C9D2DC] leading-relaxed">
                {selectedArea.keySuburbs.join(' · ')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={`/service-areas/${selectedArea.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/service-areas/${selectedArea.slug}`);
                }}
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#161E2E] hover:bg-[#242A34] text-white text-xs font-semibold text-center border border-[#C9D2DC]/20 transition-colors"
              >
                Read Corridor Guide
              </a>
              <button
                type="button"
                onClick={() => {
                  scrollToQuote();
                }}
                className="flex-1 py-2.5 px-3.5 rounded-xl btn-ruby text-white text-xs font-bold text-center transition-all cursor-pointer shadow-md"
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
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
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
            <p className="text-xs text-[#C5A15C] font-semibold uppercase tracking-wider">Practical Moving Advice</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <a
            href="/faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/faq');
            }}
            className="text-xs font-semibold text-[#C9D2DC] hover:text-white inline-flex items-center gap-1.5 transition-colors"
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
                className="mrk-surface rounded-2xl border border-[#C9D2DC]/15 overflow-hidden transition-colors hover:border-[#C9D2DC]/30 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#161E2E]/50 transition-colors cursor-pointer"
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
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#C9D2DC] leading-relaxed border-t border-[#C9D2DC]/10">
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
