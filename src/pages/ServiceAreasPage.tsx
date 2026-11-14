import React, { useState } from 'react';
import { ArrowRight, Search, Phone } from 'lucide-react';
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
          <p className="text-xs text-[#C5A15C] font-medium">
            Adelaide Metropolitan &amp; Hills Route Coverage
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Adelaide Service-Area Directory &amp; Local Access Guides
          </h1>
          <p className="text-base text-[#C9D2DC] leading-relaxed">
            Every Adelaide corridor has unique access, parking, and property characteristics—from
            CBD apartment service lifts and North Adelaide heritage lanes to steep foothills
            driveways. Browse your region below to plan a smooth move.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mrk-surface rounded-2xl p-5 border border-[#C9D2DC]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by Adelaide region">
          <button
            type="button"
            onClick={() => setSelectedRegion('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedRegion === 'All'
                ? 'bg-[#C81036] text-white'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedRegion === region
                  ? 'bg-[#C81036] text-white'
                  : 'bg-[#090D15] text-[#C9D2DC] hover:text-white border border-[#C9D2DC]/15'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
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
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#090D15] text-xs text-white placeholder-[#64748B] border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
          />
        </div>
      </div>

      {/* Directory Cards */}
      {filteredAreas.length === 0 ? (
        <div className="mrk-surface rounded-2xl p-8 text-center space-y-3 border border-[#C9D2DC]/20">
          <p className="text-base font-semibold text-white">
            No matching suburb corridor found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-[#C9D2DC] max-w-md mx-auto">
            We coordinate moves across greater Adelaide. Submit your exact pickup and destination
            postcodes in our quote form or call {mrkBusiness.phoneDisplay} to confirm availability.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
            }}
            className="px-4 py-2 rounded-lg bg-[#161E2E] text-xs font-semibold text-white border border-[#C9D2DC]/25"
          >
            Reset Directory Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAreas.map((area) => (
            <article
              key={area.id}
              className="mrk-surface-interactive rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#C9D2DC]">
                  <span className="text-[#C5A15C] font-semibold">{area.regionGroup}</span>
                  <span className="font-mono tabular-nums">
                    Postcodes: {area.postcodes.join(', ')}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-white">{area.title}</h2>
                <p className="text-sm text-[#C9D2DC] leading-relaxed">{area.summary}</p>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-white">Suburbs Covered in Corridor:</p>
                  <p className="text-xs text-[#C9D2DC] leading-relaxed">
                    {area.keySuburbs.join(' · ')}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-white">
                    Key Local Access Considerations:
                  </p>
                  <ul className="space-y-1 text-xs text-[#94A3B8]">
                    {area.accessAndParkingConsiderations.slice(0, 2).map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <span className="text-[#C81036] font-bold" aria-hidden="true">
                          —
                        </span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 border-t border-[#C9D2DC]/15 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`/service-areas/${area.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/service-areas/${area.slug}`);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Open {area.shortName} Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`/quote?suburb=${encodeURIComponent(area.keySuburbs[0])}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/quote?suburb=${encodeURIComponent(area.keySuburbs[0])}`);
                  }}
                  className="text-xs font-semibold text-[#C9D2DC] hover:text-white underline whitespace-nowrap"
                >
                  Quote Move in {area.shortName}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Honest Coverage Note (No fake suburb offices per AGENT.md Section 9) */}
      <div className="bg-[#0E1420] rounded-2xl p-6 border border-[#C9D2DC]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#94A3B8]">
        <p className="max-w-3xl leading-relaxed">
          <strong className="text-white">Service Coverage Disclosure:</strong> MRK Removals Adelaide
          operates as a mobile Adelaide removalist service coordinating pickups and deliveries across
          the corridors above. Suburb guides describe local moving logistics and access planning, not
          separate physical branch offices.
        </p>
        <a
          href={mrkBusiness.phoneHref}
          className="px-4 py-2.5 rounded-lg bg-[#161E2E] text-white font-semibold inline-flex items-center gap-2 border border-[#C9D2DC]/20 whitespace-nowrap shrink-0"
        >
          <Phone className="w-3.5 h-3.5 text-[#C81036]" />
          <span>Call {mrkBusiness.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
};
