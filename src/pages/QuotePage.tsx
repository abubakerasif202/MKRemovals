import React, { useState } from 'react';
import { Phone, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { QuoteForm, SIZE_NOT_SELECTED } from '../components/forms/QuoteForm';
import { MoveScopeBuilder } from '../components/interactive/MoveScopeBuilder';

interface QuotePageProps {
  searchQuery?: string;
  onNavigate: (path: string) => void;
}

export const QuotePage: React.FC<QuotePageProps> = ({ searchQuery = '', onNavigate }) => {
  const params = new URLSearchParams(searchQuery);
  const initialService = params.get('service') || 'house-removals';
  const initialSuburb = params.get('suburb') || '';

  const [scopeNotes, setScopeNotes] = useState('');
  const [scopeSize, setScopeSize] = useState(SIZE_NOT_SELECTED);

  const handleApplyScope = (summary: string, sizeLabel: string) => {
    setScopeNotes(summary);
    setScopeSize(sizeLabel);
    const formEl = document.getElementById('dedicated-quote-form');
    formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Request a Quote', path: '/quote' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Tailored Adelaide Relocation Quotes</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Request a Moving Quote
            </h1>
            <p className="text-sm sm:text-base text-[#C9D2DC] leading-relaxed">
              Provide your pickup and destination suburbs, property access details, and key furniture items
              below, or call <strong className="text-white font-mono font-semibold">{mrkBusiness.phoneDisplay}</strong> to
              discuss your move directly with Mubashar.
            </p>
          </div>

          <div className="mrk-surface-elevated rounded-2xl p-5 border border-[#C9D2DC]/25 space-y-2.5 shrink-0 max-w-sm shadow-xl">
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C81036]" />
              <span>{formatIndicativeRateHeadline()}</span>
            </p>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">{getMandatoryRateDisclaimer()}</p>
            <a
              href={mrkBusiness.phoneHref}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C81036] hover:text-white pt-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {mrkBusiness.phoneDisplay} Directly</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quote Form */}
      <div id="dedicated-quote-form" className="scroll-mt-24">
        <QuoteForm
          sourcePage="/quote"
          initialServiceType={initialService}
          initialPickupSuburb={initialSuburb}
          initialEstimatedSize={scopeSize}
          initialInventoryNotes={scopeNotes}
          compactHeader
        />
      </div>

      {/* Interactive Inventory Scope Builder */}
      <div className="pt-4">
        <MoveScopeBuilder onApplyScopeToQuote={handleApplyScope} />
      </div>
    </div>
  );
};
