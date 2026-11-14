import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, RotateCcw } from 'lucide-react';
import { SIZE_NOT_SELECTED } from '../forms/QuoteForm';
import { getMandatoryRateDisclaimer } from '../../config/business';

interface MoveScopeBuilderProps {
  onApplyScopeToQuote: (scopeSummary: string, estimatedSizeLabel: string) => void;
}

interface InventoryItem {
  id: string;
  label: string;
  category: 'Living & Dining' | 'Bedrooms' | 'Appliances & Cartons';
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'queen-king-beds', label: 'Queen / King Bed & Mattress', category: 'Bedrooms' },
  { id: 'single-double-beds', label: 'Single / Double Bed', category: 'Bedrooms' },
  { id: 'tallboys-wardrobes', label: 'Tallboy / Chest of Drawers', category: 'Bedrooms' },
  { id: 'sofa-lounge', label: '3-Seater Sofa / Modular Lounge', category: 'Living & Dining' },
  { id: 'dining-suite', label: 'Dining Table & Chairs', category: 'Living & Dining' },
  { id: 'tv-entertainment', label: 'TV & Entertainment Unit', category: 'Living & Dining' },
  { id: 'fridge-freezer', label: 'Fridge / Freezer (Upright)', category: 'Appliances & Cartons' },
  { id: 'washer-dryer', label: 'Washing Machine / Dryer', category: 'Appliances & Cartons' },
  { id: 'moving-cartons-10', label: 'Moving Boxes (Batches of 10)', category: 'Appliances & Cartons' },
];

export type InventoryCounts = Record<string, number>;

/** Neutral starting point: nothing is selected until the customer chooses it. */
export const EMPTY_INVENTORY: InventoryCounts = Object.freeze(
  Object.fromEntries(INVENTORY_ITEMS.map((i) => [i.id, 0]))
) as InventoryCounts;

/** Optional starting points. Applied only when the customer clicks a preset. */
export const SIZE_PRESETS: { label: string; sizeLabel: string; counts: Partial<InventoryCounts> }[] = [
  {
    label: 'Studio / 1 bed',
    sizeLabel: '1 Bedroom Apartment / Studio',
    counts: { 'queen-king-beds': 1, 'sofa-lounge': 1, 'fridge-freezer': 1, 'moving-cartons-10': 2 },
  },
  {
    label: '2 bed',
    sizeLabel: '2 Bedroom Home / Apartment',
    counts: {
      'queen-king-beds': 1,
      'single-double-beds': 1,
      'sofa-lounge': 1,
      'dining-suite': 1,
      'fridge-freezer': 1,
      'washer-dryer': 1,
      'moving-cartons-10': 3,
    },
  },
  {
    label: '3–4 bed',
    sizeLabel: '3–4 Bedroom Home',
    counts: {
      'queen-king-beds': 2,
      'single-double-beds': 2,
      'tallboys-wardrobes': 2,
      'sofa-lounge': 1,
      'dining-suite': 1,
      'tv-entertainment': 1,
      'fridge-freezer': 1,
      'washer-dryer': 1,
      'moving-cartons-10': 5,
    },
  },
];

const ACCESS_FACTORS = [
  'Ground floor driveway access',
  'Internal staircase (two-storey)',
  'Apartment service lift booking',
  'Steep foothills / Hills driveway',
  'Bed frame disassembly needed',
  'Heavy stone / solid timber table',
];

export function buildScopeSummary(counts: InventoryCounts, accessFactors: string[]): string {
  const lines = INVENTORY_ITEMS.filter((i) => (counts[i.id] || 0) > 0).map((i) =>
    i.id === 'moving-cartons-10' ? `~${counts[i.id] * 10} moving boxes` : `${counts[i.id]}x ${i.label}`
  );
  const parts: string[] = [];
  if (lines.length) parts.push(`Customer-selected inventory: ${lines.join(', ')}.`);
  if (accessFactors.length) parts.push(`Access notes: ${accessFactors.join(', ')}.`);
  return parts.join(' ');
}

export const MoveScopeBuilder: React.FC<MoveScopeBuilderProps> = ({ onApplyScopeToQuote }) => {
  const [counts, setCounts] = useState<InventoryCounts>({ ...EMPTY_INVENTORY });
  const [accessFactors, setAccessFactors] = useState<string[]>([]);
  const [presetSize, setPresetSize] = useState<string>(SIZE_NOT_SELECTED);

  const updateItemCount = (id: string, delta: number) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, Math.min(20, (prev[id] || 0) + delta)) }));
  };

  const toggleAccessFactor = (factor: string) => {
    setAccessFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const applyPreset = (preset: (typeof SIZE_PRESETS)[number]) => {
    setCounts({ ...EMPTY_INVENTORY, ...(preset.counts as InventoryCounts) });
    setPresetSize(preset.sizeLabel);
  };

  const reset = () => {
    setCounts({ ...EMPTY_INVENTORY });
    setAccessFactors([]);
    setPresetSize(SIZE_NOT_SELECTED);
  };

  const selectedCount = INVENTORY_ITEMS.filter((i) => counts[i.id] > 0).length;
  const hasSelection = selectedCount > 0 || accessFactors.length > 0;
  const totalBoxes = (counts['moving-cartons-10'] || 0) * 10;

  return (
    <div className="mrk-surface-elevated rounded-3xl p-5 sm:p-8 border border-[#C9D2DC]/25 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#C9D2DC]/15">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A15C] mb-1">
            Optional — for a more accurate quote
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            List Your Items
          </h2>
        </div>
        <p className="text-sm text-[#C9D2DC] max-w-md leading-relaxed">
          Start from nothing, or pick a typical size and adjust. Only what you select is added to
          your quote.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Optional size presets">
        <span className="text-xs text-[#94A3B8] mr-1">Start from:</span>
        {SIZE_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            aria-pressed={presetSize === p.sizeLabel}
            className={`min-h-11 px-4 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              presetSize === p.sizeLabel
                ? 'bg-[#124FA3] text-white border-[#38BDF8]/40'
                : 'bg-[#090D15] text-[#C9D2DC] border-[#C9D2DC]/20 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          disabled={!hasSelection}
          className="min-h-11 px-4 rounded-xl text-xs font-semibold border border-[#C9D2DC]/20 text-[#C9D2DC] hover:text-white disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear all</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {INVENTORY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-[#090D15]/90 rounded-2xl p-4 border border-[#C9D2DC]/15 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="text-[11px] text-[#94A3B8]">{item.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateItemCount(item.id, -1)}
                disabled={counts[item.id] === 0}
                aria-label={`Decrease ${item.label}`}
                className="w-11 h-11 rounded-lg bg-[#161E2E] hover:bg-[#242A34] disabled:opacity-40 text-white inline-flex items-center justify-center border border-[#C9D2DC]/20 cursor-pointer disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span
                className="w-7 text-center font-mono text-sm font-bold text-white tabular-nums"
                aria-live="polite"
              >
                {counts[item.id]}
              </span>
              <button
                type="button"
                onClick={() => updateItemCount(item.id, 1)}
                aria-label={`Increase ${item.label}`}
                className="w-11 h-11 rounded-lg bg-[#161E2E] hover:bg-[#C81036] text-white inline-flex items-center justify-center border border-[#C9D2DC]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-white uppercase tracking-wider">
          Access &amp; handling (tick any that apply)
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCESS_FACTORS.map((factor) => {
            const active = accessFactors.includes(factor);
            return (
              <button
                key={factor}
                type="button"
                onClick={() => toggleAccessFactor(factor)}
                aria-pressed={active}
                className={`min-h-11 px-4 rounded-xl text-xs font-medium transition-colors border cursor-pointer ${
                  active
                    ? 'bg-[#124FA3] text-white border-[#38BDF8]/40 font-semibold'
                    : 'bg-[#090D15] text-[#C9D2DC] border-[#C9D2DC]/20 hover:text-white'
                }`}
              >
                {factor}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#090D15] rounded-2xl p-5 border border-[#C9D2DC]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-mono tabular-nums text-[#C9D2DC]">
            {hasSelection
              ? `${selectedCount} item type${selectedCount === 1 ? '' : 's'} · ~${totalBoxes} boxes · ${presetSize}`
              : 'Nothing selected yet'}
          </p>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">{getMandatoryRateDisclaimer()}</p>
        </div>
        <button
          type="button"
          disabled={!hasSelection}
          onClick={() => onApplyScopeToQuote(buildScopeSummary(counts, accessFactors), presetSize)}
          className="min-h-12 px-6 rounded-xl btn-ruby text-white text-sm font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Add This List to My Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
