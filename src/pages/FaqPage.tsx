import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { MRK_FAQS, type FaqCategory } from '../content/faqs';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { buildFaqPageJsonLd } from '../lib/seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES: Array<FaqCategory | 'All'> = [
  'All',
  'Pricing & Quotes',
  'Moving Day & Access',
  'Packing & Items',
  'Scheduling & Areas',
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'All'>('All');
  const [openId, setOpenId] = useState<string>(MRK_FAQS[0].id);

  const visibleFaqs =
    selectedCategory === 'All'
      ? MRK_FAQS
      : MRK_FAQS.filter((f) => f.category === selectedCategory);

  const faqJsonLd = buildFaqPageJsonLd(MRK_FAQS);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <script
        id="mrk-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'FAQs', path: '/faq' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
            <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Honest Moving Guidance · Adelaide, South Australia</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Clear answers regarding our indicative $130–$135 hourly rate range, what details to
            confirm for your quote, apartment service lifts, and pre-move preparation.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter FAQs by category">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === category
                ? 'bg-[#C81036] text-white shadow-md'
                : 'bg-[#0E1420] text-[#C9D2DC] hover:text-white border border-[#C9D2DC]/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {visibleFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="mrk-surface rounded-2xl border border-[#C9D2DC]/15 overflow-hidden transition-colors hover:border-[#C9D2DC]/30 shadow-md"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? '' : faq.id)}
                aria-expanded={isOpen}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-[#161E2E]/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-[11px] text-[#C5A15C] font-semibold uppercase tracking-wider">{faq.category}</p>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    {faq.question}
                  </h2>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#C81036] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#C9D2DC] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-2 text-sm text-[#C9D2DC] leading-relaxed border-t border-[#C9D2DC]/10">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#C9D2DC]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Still Have a Question About Your Adelaide Move?
          </h2>
          <p className="text-xs sm:text-sm text-[#C9D2DC]">{formatIndicativeRateHeadline()}</p>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">{getMandatoryRateDisclaimer()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/quote"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/quote');
            }}
            className="px-5 py-3 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={mrkBusiness.phoneHref}
            className="px-5 py-3 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#C81036]" />
            <span>Call {mrkBusiness.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
