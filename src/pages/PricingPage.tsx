import React, { useState, useRef } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { MoveScopeBuilder } from '../components/interactive/MoveScopeBuilder';
import { QuoteForm } from '../components/forms/QuoteForm';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [scopeNotes, setScopeNotes] = useState('');
  const [scopeSize, setScopeSize] = useState('3–4 Bedroom Home');
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
          <p className="text-xs text-[#C5A15C] font-medium">
            Transparent Rate Guidance · No Hidden Calculators
          </p>
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
      <section className="mrk-surface rounded-2xl p-6 sm:p-10 border border-[#C9D2DC]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#C9D2DC]">
            <span className="text-[#C5A15C] font-semibold">Owner-Supplied Rate Guidance</span>
            <span aria-hidden="true">·</span>
            <span>Adelaide Metropolitan Relocations</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {formatIndicativeRateHeadline()}
          </h2>

          <p className="text-sm sm:text-base text-[#C9D2DC] leading-relaxed">
            {getMandatoryRateDisclaimer()}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#pricing-quote-form"
              className="px-5 py-3 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>Request Your Specific Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={mrkBusiness.phoneHref}
              className="px-5 py-3 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white border border-[#C9D2DC]/25 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C81036]" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#090D15] rounded-2xl p-6 border border-[#C9D2DC]/20 space-y-4">
          <p className="text-xs font-mono text-[#C5A15C] tabular-nums">
            INDICATIVE HOURLY GUIDANCE
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums">
              $130–$135
            </span>
            <span className="text-sm text-[#C9D2DC] font-medium">AUD / hour</span>
          </div>
          <div className="pt-3 border-t border-[#C9D2DC]/15 space-y-2 text-xs text-[#C9D2DC]">
            <p className="font-semibold text-white">Confirmed per quote before you commit:</p>
            <ul className="space-y-1.5 text-[#94A3B8]">
              <li>· Applicable crew size &amp; truck suitability for your inventory</li>
              <li>· Minimum booking hours &amp; billing increments</li>
              <li>· Travel / call-out time between depot, pickup, and drop-off</li>
              <li>· GST treatment &amp; formal tax invoice details</li>
              <li>· Any heavy-item, multi-flight stair, or weekend conditions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What Determines Your Total Moving Time & Cost */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-[#C5A15C] font-medium">Practical Cost Drivers</p>
          <h2 className="font-display text-2xl font-bold text-white">
            What Influences Your Moving Time &amp; Quote
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              className="mrk-surface rounded-xl p-6 border border-[#C9D2DC]/15 space-y-2"
            >
              <span className="font-mono text-xs text-[#C81036] tabular-nums">{driver.num}</span>
              <h3 className="font-display text-lg font-bold text-white">{driver.title}</h3>
              <p className="text-sm text-[#C9D2DC] leading-relaxed">{driver.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scope Preparation Builder */}
      <section>
        <MoveScopeBuilder onApplyScopeToQuote={handleApplyScope} />
      </section>

      {/* Embedded Quote Form */}
      <section ref={quoteFormRef} id="pricing-quote-form" className="scroll-mt-20">
        <QuoteForm
          sourcePage="/pricing"
          initialEstimatedSize={scopeSize}
          initialInventoryNotes={scopeNotes}
        />
      </section>
    </div>
  );
};
