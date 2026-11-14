import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { QuoteForm } from '../components/forms/QuoteForm';
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
  const [scopeSize, setScopeSize] = useState('3–4 Bedroom Home');

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
            <p className="text-xs text-[#C5A15C] font-medium">
              Tailored Adelaide Relocation Quotes
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Request a Moving Quote
            </h1>
            <p className="text-sm sm:text-base text-[#C9D2DC] leading-relaxed">
              Provide your pickup and destination suburbs, access details, and key furniture items
              below, or call <strong className="text-white">{mrkBusiness.phoneDisplay}</strong> to
              discuss your move directly.
            </p>
          </div>

          <div className="bg-[#0E1420] rounded-xl p-4 border border-[#C9D2DC]/20 space-y-2 shrink-0 max-w-sm">
            <p className="text-xs font-semibold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-[11px] text-[#94A3B8]">{getMandatoryRateDisclaimer()}</p>
            <a
              href={mrkBusiness.phoneHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#C81036] hover:text-white pt-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quote Form */}
      <div id="dedicated-quote-form" className="scroll-mt-20">
        <QuoteForm
          sourcePage="/quote"
          initialServiceType={initialService}
          initialPickupSuburb={initialSuburb}
          initialEstimatedSize={scopeSize}
          initialInventoryNotes={scopeNotes}
          compactHeader
        />
      </div>

      {/* Optional Inventory Builder */}
      <div className="pt-4">
        <MoveScopeBuilder onApplyScopeToQuote={handleApplyScope} />
      </div>
    </div>
  );
};
