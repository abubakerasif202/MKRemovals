import React, { useState, useRef } from 'react';
import { Phone, ArrowRight, Clock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { MoveScopeBuilder } from '../components/interactive/MoveScopeBuilder';
import { QuoteForm, SIZE_NOT_SELECTED } from '../components/forms/QuoteForm';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [scopeNotes, setScopeNotes] = useState('');
  const [scopeSize, setScopeSize] = useState(SIZE_NOT_SELECTED);
  const quoteFormRef = useRef<HTMLDivElement>(null);

  const handleApplyScope = (summary: string, sizeLabel: string) => {
    setScopeNotes(summary);
    setScopeSize(sizeLabel);
    quoteFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Indicative Pricing', path: '/pricing' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Transparent Rate Guidance · No Hidden Calculators</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Indicative Hourly Rates &amp; Quote Scoping
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Every household and commercial relocation across Adelaide differs in inventory volume,
            truck access, stairs, and travel distance. We publish our owner-supplied indicative
            hourly rate range clearly and confirm all applicable terms before you book.
          </p>
        </div>
      </div>

      {/* Primary Rate Display Card */}
      <section className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
            <span className="text-[#C5A15C] font-semibold uppercase tracking-wider">Owner-Supplied Guidance</span>
            <span aria-hidden="true">·</span>
            <span>Adelaide Metropolitan Relocations</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {formatIndicativeRateHeadline()}
          </h2>

          <p className="text-sm sm:text-base text-[#C9D2DC] leading-relaxed">
            {getMandatoryRateDisclaimer()}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <a
              href="#pricing-quote-form"
              className="px-6 py-3.5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Request Your Specific Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={mrkBusiness.phoneHref}
              className="px-6 py-3.5 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-[#C81036]" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#090D15] rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-mono text-[#C5A15C] font-bold uppercase tracking-wider">
              INDICATIVE HOURLY GUIDANCE
            </p>
            <Clock className="w-4 h-4 text-[#C81036]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums text-platinum-sheen">
              $130–$135
            </span>
            <span className="text-sm text-[#C9D2DC] font-medium">AUD / hour</span>
          </div>

          <div className="pt-3 border-t border-[#C9D2DC]/15 space-y-2 text-xs text-[#C9D2DC]">
            <p className="font-semibold text-white">Confirmed per quote before you commit:</p>
            <ul className="space-y-1.5 text-[#94A3B8]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                <span>Applicable crew size &amp; truck suitability for your inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                <span>Minimum booking hours &amp; billing increments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                <span>Travel / call-out time between depot, pickup, and drop-off</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                <span>Hourly rate includes GST; tax invoice details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C81036] shrink-0 mt-0.5" />
                <span>Any heavy-item, multi-flight stair, or weekend conditions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* What Determines Your Total Moving Time & Cost */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-[#C5A15C] font-semibold uppercase tracking-wider">Practical Cost Drivers</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What Influences Your Moving Time &amp; Quote
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Volume & Preparation Level',
              desc: 'Sealed, uniform cartons stacked ready in accessible rooms load significantly faster than loose household items or unsealed bags.',
            },
            {
              num: '02',
              title: 'Access, Stairs & Walk Distance',
              desc: 'Direct driveway access to a single-storey house requires far less transit time than long apartment corridors, shared passenger lifts, or multi-flight stairs.',
            },
            {
              num: '03',
              title: 'Disassembly & Oversized Items',
              desc: 'Disassembling king bed frames, detaching dining table legs, or navigating solid stone/hardwood furniture around tight corners adds planned handling time.',
            },
          ].map((driver) => (
            <div
              key={driver.num}
              className="mrk-surface rounded-2xl p-6 border border-[#C9D2DC]/15 space-y-2.5 shadow-md hover:border-[#C81036]/40 transition-colors"
            >
              <span className="font-mono text-xs text-[#C81036] font-bold tabular-nums">
                DRIVER {driver.num}
              </span>
              <h3 className="font-display text-lg font-bold text-white">{driver.title}</h3>
              <p className="text-sm text-[#C9D2DC] leading-relaxed">{driver.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Move Scope Builder */}
      <section className="space-y-6">
        <MoveScopeBuilder onApplyScopeToQuote={handleApplyScope} />
      </section>

      {/* Embedded Quote Form on Pricing Page */}
      <section ref={quoteFormRef} id="pricing-quote-form" className="scroll-mt-24 pt-4">
        <QuoteForm
          sourcePage="/pricing"
          initialEstimatedSize={scopeSize}
          initialInventoryNotes={scopeNotes}
        />
      </section>
    </div>
  );
};
