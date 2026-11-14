import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../../config/business';

interface MoveScopeBuilderProps {
  onApplyScopeToQuote: (scopeSummary: string, estimatedSizeLabel: string) => void;
}

interface InventoryCounter {
  id: string;
  label: string;
  category: 'Living & Dining' | 'Bedrooms' | 'Appliances & Cartons';
  count: number;
}

const INITIAL_ITEMS: InventoryCounter[] = [
  { id: 'queen-king-beds', label: 'Queen / King Bed & Mattress', category: 'Bedrooms', count: 2 },
  { id: 'single-double-beds', label: 'Single / Double Bed', category: 'Bedrooms', count: 1 },
  { id: 'tallboys-wardrobes', label: 'Tallboy / Chest of Drawers', category: 'Bedrooms', count: 2 },
  { id: 'sofa-lounge', label: '3-Seater Sofa / Modular Lounge', category: 'Living & Dining', count: 1 },
  { id: 'dining-suite', label: 'Dining Table & Chairs', category: 'Living & Dining', count: 1 },
  { id: 'tv-entertainment', label: 'TV & Entertainment Unit', category: 'Living & Dining', count: 1 },
  { id: 'fridge-freezer', label: 'Fridge / Freezer (Upright)', category: 'Appliances & Cartons', count: 1 },
  { id: 'washer-dryer', label: 'Washing Machine / Dryer', category: 'Appliances & Cartons', count: 1 },
  { id: 'moving-cartons-10', label: 'Moving Boxes (Batches of 10)', category: 'Appliances & Cartons', count: 3 },
];

export const MoveScopeBuilder: React.FC<MoveScopeBuilderProps> = ({
  onApplyScopeToQuote,
}) => {
  const [items, setItems] = useState<InventoryCounter[]>(INITIAL_ITEMS);
  const [accessFactors, setAccessFactors] = useState<string[]>([
    'Ground floor driveway access',
  ]);

  const updateItemCount = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: Math.max(0, Math.min(20, item.count + delta)) } : item
      )
    );
  };

  const toggleAccessFactor = (factor: string) => {
    setAccessFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const selectedItems = items.filter((i) => i.count > 0);
  const totalBoxes =
    (items.find((i) => i.id === 'moving-cartons-10')?.count || 0) * 10;
  const totalBeds =
    (items.find((i) => i.id === 'queen-king-beds')?.count || 0) +
    (items.find((i) => i.id === 'single-double-beds')?.count || 0);

  const inferredSizeLabel =
    totalBeds <= 1
      ? '1 Bedroom Apartment / Studio'
      : totalBeds === 2
      ? '2 Bedroom Home / Apartment'
      : totalBeds <= 4
      ? '3–4 Bedroom Home'
      : '5+ Bedroom Large Residence';

  const buildSummaryText = () => {
    const itemLines = selectedItems.map((i) => {
      if (i.id === 'moving-cartons-10') {
        return `~${i.count * 10} Moving Boxes`;
      }
      return `${i.count}x ${i.label}`;
    });
    const accessLine =
      accessFactors.length > 0 ? `Access Notes: ${accessFactors.join(', ')}` : '';
    return [
      `Prepared Inventory (${inferredSizeLabel}): ${itemLines.join(', ')}.`,
      accessLine,
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#C9D2DC]/25 space-y-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#C9D2DC]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Interactive Move Preparation Tool</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Build Your Adelaide Move Inventory &amp; Access Checklist
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#C9D2DC] max-w-md leading-relaxed">
          Select your major furniture items and access conditions below, then send your list
          straight to the Quote Form—no guesswork required.
        </p>
      </div>

      {/* Inventory Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#090D15]/90 rounded-2xl p-4 border border-[#C9D2DC]/15 flex items-center justify-between gap-3 hover:border-[#C9D2DC]/30 transition-colors shadow-sm"
          >
            <div>
              <p className="text-xs font-semibold text-white">{item.label}</p>
              <p className="text-[11px] text-[#94A3B8]">{item.category}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateItemCount(item.id, -1)}
                aria-label={`Decrease ${item.label}`}
                className="w-8 h-8 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white inline-flex items-center justify-center border border-[#C9D2DC]/20 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-mono text-sm font-bold text-white tabular-nums">
                {item.count}
              </span>
              <button
                type="button"
                onClick={() => updateItemCount(item.id, 1)}
                aria-label={`Increase ${item.label}`}
                className="w-8 h-8 rounded-lg bg-[#161E2E] hover:bg-[#C81036] text-white inline-flex items-center justify-center border border-[#C9D2DC]/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Access & Property Condition Toggles */}
      <div className="pt-2 space-y-2.5">
        <p className="text-xs font-semibold text-white uppercase tracking-wider">
          Select Applicable Access &amp; Handling Factors:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Ground floor driveway access',
            'Internal staircase (two-storey)',
            'Apartment service lift booking',
            'Steep foothills / Hills driveway',
            'Bed frame disassembly needed',
            'Heavy stone / solid timber table',
          ].map((factor) => {
            const active = accessFactors.includes(factor);
            return (
              <button
                key={factor}
                type="button"
                onClick={() => toggleAccessFactor(factor)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                  active
                    ? 'bg-[#124FA3] text-white border-[#38BDF8]/40 shadow-md font-semibold'
                    : 'bg-[#090D15] text-[#C9D2DC] border-[#C9D2DC]/20 hover:text-white'
                }`}
              >
                {factor}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary & Action Bar */}
      <div className="bg-[#090D15] rounded-2xl p-5 sm:p-6 border border-[#C9D2DC]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[#C9D2DC]">
            <span className="text-white font-bold">{inferredSizeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedItems.length} categories</span>
            <span aria-hidden="true">·</span>
            <span>~{totalBoxes} moving boxes</span>
          </div>
          <p className="text-xs text-[#F5F7FA] font-semibold">
            {formatIndicativeRateHeadline()}
          </p>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">{getMandatoryRateDisclaimer()}</p>
        </div>

        <button
          type="button"
          onClick={() => onApplyScopeToQuote(buildSummaryText(), inferredSizeLabel)}
          className="px-6 py-3.5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg active:scale-98"
        >
          <span>Attach Scope to Quote Request</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
