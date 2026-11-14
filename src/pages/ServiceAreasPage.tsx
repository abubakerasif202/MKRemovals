import React, { useState } from 'react';
import { ArrowRight, Search, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import {
  MRK_SERVICE_AREAS,
  ADELAIDE_REGION_GROUPS,
  type AdelaideRegionGroup,
} from '../content/service-areas';
import { mrkBusiness } from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface ServiceAreasPageProps {
  onNavigate: (path: string) => void;
}

export const ServiceAreasPage: React.FC<ServiceAreasPageProps> = ({ onNavigate }) => {
  const [selectedRegion, setSelectedRegion] = useState<AdelaideRegionGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = MRK_SERVICE_AREAS.filter((area) => {
    const matchesRegion = selectedRegion === 'All' || area.regionGroup === selectedRegion;
    if (!matchesRegion) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      area.title.toLowerCase().includes(q) ||
      area.keySuburbs.some((s) => s.toLowerCase().includes(q)) ||
      area.postcodes.some((p) => p.includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Service Areas', path: '/service-areas' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/20 border border-[#124FA3]/35 text-xs text-[#C9D2DC]">
            <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Adelaide Metropolitan &amp; Hills Route Coverage</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Adelaide Service-Area Directory &amp; Local Access Guides
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Every Adelaide corridor has unique access, parking, and property characteristics—from
            CBD apartment service lifts and North Adelaide heritage lanes to steep foothills
            driveways. Browse your region below to plan a smooth, well-sequenced move.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mrk-surface-elevated rounded-2xl p-5 sm:p-6 border border-[#C9D2DC]/25 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by Adelaide region">
          <button
            type="button"
            onClick={() => setSelectedRegion('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedRegion === 'All'
                ? 'bg-[#C81036] text-white shadow-md'
                : 'bg-[#090D15] text-[#C9D2DC] hover:text-white border border-[#C9D2DC]/15'
            }`}
          >
            All Regions ({MRK_SERVICE_AREAS.length})
          </button>
          {ADELAIDE_REGION_GROUPS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedRegion === region
                  ? 'bg-[#C81036] text-white shadow-md'
                  : 'bg-[#090D15] text-[#C9D2DC] hover:text-white border border-[#C9D2DC]/15'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <label htmlFor="suburb-search" className="sr-only">
            Search suburb or postcode
          </label>
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="suburb-search"
            type="search"
            placeholder="Search suburb or postcode (e.g. 5067)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090D15] text-xs text-white placeholder-[#64748B] border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036] shadow-inner"
          />
        </div>
      </div>

      {/* Directory Cards */}
      {filteredAreas.length === 0 ? (
        <div className="mrk-surface-elevated rounded-3xl p-10 text-center space-y-4 border border-[#C9D2DC]/20 shadow-xl">
          <p className="text-lg font-bold text-white">
            No matching suburb corridor found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-[#C9D2DC] max-w-md mx-auto leading-relaxed">
            We coordinate moves across metropolitan Adelaide and the Hills. Submit your exact pickup and destination
            postcodes in our quote form or call {mrkBusiness.phoneDisplay} to discuss your access directly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
            }}
            className="px-5 py-2.5 rounded-xl btn-secondary text-xs font-semibold text-white shadow-md cursor-pointer"
          >
            Reset Directory Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAreas.map((area) => (
            <article
              key={area.id}
              className="mrk-surface-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#C9D2DC]">
                  <span className="text-[#C5A15C] font-semibold uppercase tracking-wider">{area.regionGroup}</span>
                  <span className="font-mono tabular-nums text-white px-2 py-0.5 rounded bg-[#161E2E] border border-[#C9D2DC]/20">
                    Postcodes: {area.postcodes.join(', ')}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-white tracking-tight">{area.title}</h2>
                <p className="text-sm text-[#C9D2DC] leading-relaxed">{area.summary}</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">Key Suburbs:</p>
                  <p className="text-xs text-[#C9D2DC] leading-relaxed">
                    {area.keySuburbs.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-[#C9D2DC]/15 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/service-areas/${area.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/service-areas/${area.slug}`);
                  }}
                  className="px-4 py-2.5 rounded-xl btn-ruby text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>View Corridor Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`/quote?suburb=${encodeURIComponent(area.shortName)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/quote?suburb=${encodeURIComponent(area.shortName)}`);
                  }}
                  className="text-xs font-semibold text-[#C9D2DC] hover:text-white underline"
                >
                  Quote Move in {area.shortName}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Regional SA & Direct Call Notice */}
      <div className="mrk-surface-elevated rounded-3xl p-6 sm:p-8 border border-[#C9D2DC]/25 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-[#C5A15C] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#C81036]" />
            <span>Adelaide Hills &amp; Regional SA Routes</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Moving Outside the Core Adelaide Metropolitan Corridors?
          </h2>
          <p className="text-xs sm:text-sm text-[#C9D2DC] leading-relaxed">
            Moves to Victor Harbor, the Barossa Valley, Murray Bridge, or regional South Australia are
            reviewed case-by-case based on route transit time, truck capacity, and scheduling.
          </p>
        </div>

        <a
          href={mrkBusiness.phoneHref}
          className="px-5 py-3 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shrink-0 shadow-md"
        >
          <Phone className="w-4 h-4 text-[#C81036]" />
          <span>Call {mrkBusiness.phoneDisplay} to Discuss</span>
        </a>
      </div>
    </div>
  );
};
