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
  Building2,
  Home,
  Briefcase,
  PackageCheck,
  Layers,
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

  const remainingServices = MRK_SERVICES.filter(
    (s) =>
      s.id !== 'house-removals' &&
      s.id !== 'apartment-strata-moves' &&
      s.id !== 'office-commercial-relocations'
  );

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-x-hidden">
      {/* =========================================================================
          1. CINEMATIC HOMEPAGE HERO (AB Web Studio Direction)
          Desktop: Split-composition with large cinematic truck scene on the right.
          Mobile: Dedicated art-directed mobile composition with crisp vehicle framing.
          ========================================================================= */}
      <section className="relative isolate overflow-hidden pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 lg:pb-20" aria-labelledby="hero-heading">
        {/* Subtle Ambient Background Lighting Pools */}
        <div
          aria-hidden="true"
          className="mrk-ambient-light absolute -top-24 -left-20 -z-10 w-96 h-96 rounded-full bg-[#C81036]/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="mrk-ambient-light absolute top-1/3 -right-20 -z-10 w-[500px] h-[500px] rounded-full bg-[#124FA3]/10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
            {/* Left Column: Headlines, Trust Signals, Dual CTAs & Upfront Rates */}
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

              {/* Status & Service Corridor Badge */}
              <div
                style={{ '--d': '0.05s' } as React.CSSProperties}
                className="mrk-rise inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#D7E0EC] text-xs font-medium text-[#0B1B33] shadow-xs"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0" aria-hidden="true">
                  <span className="mrk-pulse-beacon absolute inline-flex h-full w-full rounded-full bg-[#C81036]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C81036]" />
                </span>
                <span>Adelaide, South Australia · Residential &amp; Commercial Removals</span>
              </div>

              {/* Accessible HTML Headline */}
              <h1
                id="hero-heading"
                style={{ fontSize: 'clamp(2.1rem, 5.2vw, 4.1rem)', '--d': '0.12s' } as React.CSSProperties}
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

              {/* Mobile Hero Visual Insertion: Dedicated art-directed vehicle crop (strictly mobile) */}
              <div className="lg:hidden my-2">
                <div className="relative rounded-2xl overflow-hidden border border-[#D7E0EC] shadow-[0_16px_36px_-12px_rgba(18,79,163,0.25)] bg-white">
                  <ResponsiveImage
                    src={mrkBusiness.photographyAssets.heroTruckMobile}
                    alt="MRK Removals branded moving truck outside an Adelaide home on moving day"
                    priority
                    sizes="(max-width: 767px) 100vw, 50vw"
                    width={1152}
                    height={941}
                    className="w-full h-auto max-h-[340px] sm:max-h-[400px] object-cover object-center"
                  />
                  {/* Subtle top-to-bottom edge gradient */}
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0B1B33] font-semibold border border-white/40 shadow-xs">
                      <Truck className="w-3.5 h-3.5 text-[#C81036]" />
                      <span>Adelaide Moving Fleet</span>
                    </span>
                    <span className="text-white/90 font-medium text-[10px] drop-shadow-sm">Direct with Moe</span>
                  </div>
                </div>
              </div>

              {/* Dual Action CTA Buttons */}
              <div
                style={{ '--d': '0.28s' } as React.CSSProperties}
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

              {/* Quick Confidence Pillars */}
              <div
                style={{ '--d': '0.34s' } as React.CSSProperties}
                className="mrk-rise grid grid-cols-3 gap-2 sm:gap-3 max-w-xl pt-1"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/95 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C81036] shrink-0" aria-hidden="true" />
                  <span className="truncate">$1M Insurance</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/95 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                  <Truck className="w-3.5 h-3.5 text-[#124FA3] shrink-0" aria-hidden="true" />
                  <span className="truncate">2-Man + Truck</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/95 backdrop-blur-xs border border-[#D7E0EC] text-[11px] sm:text-xs font-medium text-[#0B1B33] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#8A6414] shrink-0" aria-hidden="true" />
                  <span className="truncate">Zero Hidden Fees</span>
                </div>
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

            {/* Right Column: Desktop Cinematic Truck Scene (lg and up) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative group">
                {/* Glowing Ruby Ribbon Sweep & Light Accent */}
                <div
                  aria-hidden="true"
                  className="mrk-ruby-ribbon absolute -inset-1 rounded-3xl bg-gradient-to-r from-transparent via-[#C81036]/25 to-transparent blur-md pointer-events-none"
                />

                {/* Cinematic Image Frame */}
                <div className="mrk-truck-depth relative rounded-3xl overflow-hidden border border-[#D7E0EC] shadow-[0_24px_50px_-16px_rgba(18,79,163,0.3)] bg-white transition-all duration-500 group-hover:border-[#C81036]/40 group-hover:shadow-[0_32px_60px_-18px_rgba(200,16,54,0.35)]">
                  <ResponsiveImage
                    src={mrkBusiness.photographyAssets.heroTruckCinematic}
                    alt="MRK Removals branded moving truck outside a modern residence in Adelaide on moving day"
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    width={1672}
                    height={941}
                    className="w-full h-[460px] xl:h-[500px] object-cover object-[70%_50%] transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Soft Vignette Overlay for Subject Contrast */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/70 via-[#0B1B33]/10 to-transparent pointer-events-none"
                  />

                  {/* Floating Corner Badges & Direct Operator Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#0B1B33] border border-white/50 shadow-md">
                      <MRKVectorEmblem className="w-4 h-4" variant="color" />
                      <span>MRK Removals</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#C81036] text-white text-xs font-semibold shadow-xs">
                      Adelaide Owned
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div className="space-y-0.5">
                      <p className="font-display text-base font-bold text-white drop-shadow-md">
                        Metropolitan Adelaide Fleet
                      </p>
                      <p className="text-xs text-white/85">
                        Direct with Moe · Padded blankets &amp; furniture care
                      </p>
                    </div>
                    <span className="text-[11px] text-white/80 font-mono">
                      0423 653 342
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TRUST BANNER
          Core confidence pillars: Insurance, transparent rates, Adelaide direct.
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10">
        <TrustBanner />
      </section>

      {/* =========================================================================
          3. PHASE 3 FEATURE 1: RESIDENTIAL HOUSE REMOVALS & FURNITURE PROTECTION
          Showcases careful furniture wrapping inside an Adelaide residence.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="house-removals-feature-heading">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image with Furniture Protection */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D7E0EC] shadow-xl group">
            <ResponsiveImage
              src={mrkBusiness.photographyAssets.professionalWrapping}
              alt="MRK Removals crew wrapping furniture carefully in moving blankets inside an Adelaide residence"
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={1448}
              height={1086}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="px-3 py-1 rounded-full bg-white/95 text-[#0B1B33] font-semibold shadow-xs">
                Furniture Protection
              </span>
              <span className="text-white/90">Blankets &amp; Heavy Padding</span>
            </div>
          </div>

          {/* Right Column: House Removals Narrative & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81036]/10 text-xs text-[#0B1B33] font-medium border border-[#C81036]/25">
              <Home className="w-3.5 h-3.5 text-[#C81036]" />
              <span>Full &amp; Partial Household Relocations</span>
            </div>

            <h2 id="house-removals-feature-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight">
              House Removals &amp; Furniture Protection
            </h2>

            <p className="text-sm sm:text-base text-[#33445C] leading-relaxed">
              Moving an entire Adelaide home requires systematic sequencing, room-by-room loading, and rigorous protection for your timber, leather, and mattresses. We discuss driveway access, stairs, and disassembly ahead of moving day.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#33445C]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Heavy-duty padded moving blankets and protective shrink wrap on all key furniture items.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Experienced handling for 2 to 5+ bedroom homes, heritage cottages, and foothills properties.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct operator coordination with Moe—clear arrival windows and honest rate disclosures.</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/services/house-removals"
                onClick={go('/services/house-removals')}
                className="min-h-11 px-5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Explore House Removals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setPresetServiceType('house-removals');
                  scrollToQuote();
                }}
                className="min-h-11 px-5 rounded-xl btn-secondary text-[#0B1B33] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Quote a House Move</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PHASE 3 FEATURE 2: APARTMENT & STRATA RELOCATIONS
          Highlights lift windows, corridor protection, and strata coordination.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="strata-feature-heading">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Strata Narrative & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/10 text-xs text-[#0B1B33] font-medium border border-[#124FA3]/25">
              <Building2 className="w-3.5 h-3.5 text-[#124FA3]" />
              <span>Apartment, Unit &amp; Strata Specialists</span>
            </div>

            <h2 id="strata-feature-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight">
              Apartment &amp; Strata Moves Planned for Access
            </h2>

            <p className="text-sm sm:text-base text-[#33445C] leading-relaxed">
              Apartment moves across Adelaide CBD, Glenelg, and Norwood demand tight lift bookings, loading dock coordination, and corner protection. We work within designated time slots to keep body corporate rules respected and your move stress-free.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#33445C]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#124FA3] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Lift window management and loading dock clearances booked to avoid delays.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#124FA3] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Careful navigation through common hallways, fire stairs, and tight foyer doors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#124FA3] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Specialised upright dollies and padded transit covers for lounges and entertainment units.</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/services/apartment-strata-moves"
                onClick={go('/services/apartment-strata-moves')}
                className="min-h-11 px-5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Explore Apartment Moves</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setPresetServiceType('apartment-strata-moves');
                  scrollToQuote();
                }}
                className="min-h-11 px-5 rounded-xl btn-secondary text-[#0B1B33] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Quote an Apartment Move</span>
              </button>
            </div>
          </div>

          {/* Right Column: Image with Strata Move In */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D7E0EC] shadow-xl group order-1 lg:order-2">
            <ResponsiveImage
              src={mrkBusiness.photographyAssets.apartmentRelocation}
              alt="Protected furniture transported through an upscale Adelaide apartment building lobby"
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={1448}
              height={1086}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="px-3 py-1 rounded-full bg-white/95 text-[#0B1B33] font-semibold shadow-xs">
                Strata &amp; Lift Access
              </span>
              <span className="text-white/90">Padded Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PHASE 3 FEATURE 3: OFFICE & COMMERCIAL RELOCATIONS
          Showcases commercial relocation, workstation moving, and minimal downtime.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="office-feature-heading">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Commercial Relocation Image */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D7E0EC] shadow-xl group">
            <ResponsiveImage
              src={mrkBusiness.photographyAssets.officeRelocation}
              alt="MRK Removals team relocating commercial office furniture and desks in Adelaide"
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={1448}
              height={1086}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="px-3 py-1 rounded-full bg-white/95 text-[#0B1B33] font-semibold shadow-xs">
                Commercial Moving
              </span>
              <span className="text-white/90">Desks, Workstations &amp; Tech</span>
            </div>
          </div>

          {/* Right Column: Office Relocation Narrative & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8A6414]/10 text-xs text-[#8A6414] font-semibold border border-[#8A6414]/25">
              <Briefcase className="w-3.5 h-3.5 text-[#8A6414]" />
              <span>Office &amp; Commercial Workspaces</span>
            </div>

            <h2 id="office-feature-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight">
              Office Relocations with Minimal Downtime
            </h2>

            <p className="text-sm sm:text-base text-[#33445C] leading-relaxed">
              Moving your business requires methodical scheduling so your team is back up and running fast. We handle executive desks, monitors, meeting rooms, filing cabinets, and retail stock with weekend or after-hours flexibility.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#33445C]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#8A6414] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Flexible scheduling: after-hours and weekend moves to prevent workflow disruption.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#8A6414] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Dedicated equipment handling: screens, chairs, and conference tables padded in transit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#8A6414] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct on-site supervisor: coordinated room-by-room delivery to match your floor plan.</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/services/office-commercial-relocations"
                onClick={go('/services/office-commercial-relocations')}
                className="min-h-11 px-5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Explore Commercial Moves</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setPresetServiceType('office-commercial-relocations');
                  scrollToQuote();
                }}
                className="min-h-11 px-5 rounded-xl btn-secondary text-[#0B1B33] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Quote an Office Move</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PHASE 3: REMAINING SPECIALIST SERVICES
          Clean, icon-led and description-led service cards without repetitive blocks.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" aria-labelledby="additional-services-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/10 text-xs text-[#124FA3] font-medium border border-[#124FA3]/25 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Complete Moving Solutions</span>
            </div>
            <h2
              id="additional-services-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight"
            >
              Specialist Relocation Services
            </h2>
          </div>
          <a
            href="/services"
            onClick={go('/services')}
            className="text-sm font-semibold text-[#33445C] hover:text-[#C81036] inline-flex items-center gap-1.5 whitespace-nowrap group"
          >
            <span>View all services</span>
            <ArrowRight className="w-4 h-4 text-[#C81036] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingServices.map((service) => (
            <article
              key={service.id}
              className="mrk-surface-interactive rounded-2xl p-6 flex flex-col justify-between gap-5 border border-[#D7E0EC] shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#C81036] bg-[#C81036]/10 px-2.5 py-1 rounded-full">
                    SERVICE {service.indexNumber}
                  </span>
                  {service.id === 'packing-move-preparation' && (
                    <PackageCheck className="w-5 h-5 text-[#C81036]" />
                  )}
                  {service.id === 'furniture-single-item-moves' && (
                    <Truck className="w-5 h-5 text-[#124FA3]" />
                  )}
                  {service.id === 'heavy-bulky-item-moves' && (
                    <ShieldCheck className="w-5 h-5 text-[#8A6414]" />
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-[#0B1B33] tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[#33445C] leading-relaxed">{service.summary}</p>
                <ul className="space-y-1.5 text-xs text-[#33445C] pt-2">
                  {service.idealFor.slice(0, 2).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#D7E0EC] flex items-center justify-between gap-3">
                <a
                  href={`/services/${service.slug}`}
                  onClick={go(`/services/${service.slug}`)}
                  className="min-h-11 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1B33] hover:text-[#C81036]"
                >
                  <span>Explore Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setPresetServiceType(service.slug);
                    scrollToQuote();
                  }}
                  className="min-h-11 px-3.5 rounded-lg text-xs font-semibold text-[#0B1B33] bg-[#E8EEF7] hover:bg-[#C81036] hover:text-white cursor-pointer transition-colors"
                >
                  Quote this
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. PRICING & INCLUSIONS
          Transparent hourly rates: $130–$135/hr, GST included upfront.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="pricing-heading">
        <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/10 text-xs text-[#124FA3] font-semibold border border-[#124FA3]/25">
              <span>Transparent Rates</span>
            </div>
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

      {/* =========================================================================
          8. PROCESS: HOW YOUR MOVE WORKS
          Structured 4-step workflow from quote to completion.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" aria-labelledby="process-heading">
        <div className="space-y-2">
          <h2 id="process-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1B33] tracking-tight">
            How your move works
          </h2>
          <p className="text-sm text-[#33445C]">Four straightforward steps to a stress-free relocation across Adelaide.</p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS_STEPS.map((step) => (
            <li key={step.num} className="mrk-surface rounded-2xl p-5 border border-[#D7E0EC] space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="font-mono text-xs text-[#C81036] font-bold tabular-nums">STEP {step.num}</span>
                <h3 className="font-display text-base font-bold text-[#0B1B33]">{step.title}</h3>
                <p className="text-sm text-[#33445C] leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* =========================================================================
          9. REQUEST A QUOTE (Working Form)
          Preserved /api/quote integration with validation & honest feedback.
          ========================================================================= */}
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

      {/* =========================================================================
          10. ADELAIDE COVERAGE CORRIDORS
          Interactive region corridors with suburb profiles.
          ========================================================================= */}
      <section className="mrk-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" aria-labelledby="coverage-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 id="coverage-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
              Adelaide coverage
            </h2>
            <p className="text-sm text-[#33445C] mt-1">Servicing metropolitan Adelaide and regional South Australia.</p>
          </div>
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
                className={`min-h-11 px-4 rounded-xl text-sm font-semibold border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#C81036] text-white border-[#C81036] shadow-sm'
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

      {/* =========================================================================
          11. OPTIONAL INVENTORY BUILDER
          Collapsible inventory selection tool.
          ========================================================================= */}
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

      {/* =========================================================================
          12. FAQ + CLOSING CINEMATIC BANNER
          ========================================================================= */}
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

        {/* Closing High-Impact Call-to-Action Banner */}
        <div className="relative isolate overflow-hidden rounded-3xl px-6 py-16 sm:py-20 text-center space-y-6 bg-gradient-to-br from-[#A80D2D] via-[#C81036] to-[#124FA3] shadow-[0_30px_60px_-24px_rgba(200,16,54,0.55)]">
          <ResponsiveImage
            src={mrkBusiness.photographyAssets.heroTruckCinematic}
            alt=""
            sizes="(min-width: 1024px) 960px, 100vw"
            width={1672}
            height={941}
            className="mrk-drive absolute inset-0 -z-20 h-full w-full object-cover object-[60%_72%] opacity-35 mix-blend-soft-light"
          />
          <div aria-hidden="true" className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to plan your move?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto">
            Tell us about your move and get a clear, honest quote coordinated directly with Moe.
          </p>
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
          <p className="text-[11px] text-white/70 pt-2">
            Indicative hourly rates: $130–$135 · 3-hour minimum plus 1-hour call-out fee (GST included).
          </p>
        </div>
      </section>
    </div>
  );
};
