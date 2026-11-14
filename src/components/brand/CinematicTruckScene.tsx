import React, { useState } from 'react';
import { Sparkles, Eye, ShieldCheck, MapPin, Layers } from 'lucide-react';
import { mrkBusiness } from '../../config/business';

interface CinematicTruckSceneProps {
  onSelectQuoteWithMode?: (presetSize: string) => void;
}

type ViewMode = 'exterior' | 'city' | 'cutaway';
type LightingMode = 'twilight' | 'golden-hour';

/**
 * Cinematic Hero Scene: Photorealistic MRK Branded Moving Truck on Adelaide North Terrace
 * with architectural twilight reflections, city skyline backdrop, interactive inspection modes,
 * and selective 2.5D gyroscopic perspective tilt.
 */
export const CinematicTruckScene: React.FC<CinematicTruckSceneProps> = ({
  onSelectQuoteWithMode,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('exterior');
  const [lightingMode, setLightingMode] = useState<LightingMode>('twilight');
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 6).toFixed(2)),
      ry: Number((x * 8).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setActiveHotspot(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      {/* Interactive Mode & Perspective Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* View Mode Toggle */}
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#090D15]/90 border border-[#C9D2DC]/20 shadow-lg"
          role="group"
          aria-label="Cinematic scene view selector"
        >
          <button
            type="button"
            onClick={() => setViewMode('exterior')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'exterior'
                ? 'bg-gradient-to-r from-[#C81036] to-[#DF143E] text-white shadow-md'
                : 'text-[#C9D2DC] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>MRK Fleet View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('city')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'city'
                ? 'bg-gradient-to-r from-[#124FA3] to-[#1E6BDB] text-white shadow-md'
                : 'text-[#C9D2DC] hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Adelaide Horizon</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('cutaway')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'cutaway'
                ? 'bg-gradient-to-r from-[#C81036] to-[#DF143E] text-white shadow-md'
                : 'text-[#C9D2DC] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cargo Protection</span>
          </button>
        </div>

        {/* Ambient Atmosphere Switch */}
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#090D15]/90 border border-[#C9D2DC]/20 shadow-lg"
          role="group"
          aria-label="Adelaide atmospheric lighting"
        >
          <button
            type="button"
            onClick={() => setLightingMode('twilight')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              lightingMode === 'twilight'
                ? 'bg-[#124FA3] text-white font-semibold'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            Twilight Blue
          </button>
          <button
            type="button"
            onClick={() => setLightingMode('golden-hour')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              lightingMode === 'golden-hour'
                ? 'bg-[#C5A15C] text-[#090D15] font-bold'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            Golden Glow
          </button>
        </div>
      </div>

      {/* Main 3D Perspective Stage Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="perspective-stage relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-[#C9D2DC]/20 bg-[#090D15] shadow-2xl"
      >
        <div
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
          className="dimensional-card relative w-full h-full flex flex-col justify-between overflow-hidden"
        >
          {/* Layer 1: Photographic Backdrops based on View Mode */}
          {viewMode === 'exterior' && (
            <div className="absolute inset-0">
              <img
                src={mrkBusiness.photographyAssets.heroTruckCinematic}
                alt="MRK Removals Adelaide cinematic commercial moving truck on North Terrace Adelaide at twilight"
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              />
              {/* Dynamic Atmospheric Overlay Filter */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                  lightingMode === 'twilight'
                    ? 'bg-gradient-to-t from-[#090D15] via-[#090D15]/30 to-transparent opacity-85'
                    : 'bg-gradient-to-t from-[#090D15] via-[#C5A15C]/15 to-[#124FA3]/20 opacity-80'
                }`}
              />
              {/* Specular Ruby/Platinum Edge Lighting */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C81036]/25 via-transparent to-transparent" />
            </div>
          )}

          {viewMode === 'city' && (
            <div className="absolute inset-0">
              <img
                src={mrkBusiness.photographyAssets.adelaideSkylineTwilight}
                alt="Adelaide City Skyline and River Torrens panorama at twilight"
                className="w-full h-full object-cover object-center filter brightness-[0.95]"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090D15] via-[#090D15]/40 to-transparent" />
            </div>
          )}

          {viewMode === 'cutaway' && (
            <div className="absolute inset-0">
              <img
                src={mrkBusiness.photographyAssets.professionalWrapping}
                alt="Professional removalists wrapping luxury timber furniture in heavy-duty blankets with strapping"
                className="w-full h-full object-cover object-center filter brightness-[0.88]"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090D15] via-[#090D15]/50 to-transparent" />
            </div>
          )}

          {/* Layer 2: Top Floating Badge & Corridor Metadata */}
          <div className="relative z-20 p-4 sm:p-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#090D15]/85 backdrop-blur-md border border-[#C9D2DC]/25 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#C81036] animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wide">
                {viewMode === 'exterior'
                  ? 'Adelaide Fleet · North Terrace Corridor'
                  : viewMode === 'city'
                  ? 'Riverbank & CBD Panorama'
                  : 'White-Glove Care & Strapping Standard'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090D15]/85 backdrop-blur-md border border-[#C9D2DC]/20">
              <span className="text-[11px] font-mono text-[#C5A15C] font-semibold">
                {lightingMode === 'twilight' ? 'TWILIGHT HORIZON' : 'GOLDEN HOUR'}
              </span>
            </div>
          </div>

          {/* Layer 3: Interactive Hotspots (Only on Exterior Mode) */}
          {viewMode === 'exterior' && (
            <div className="relative z-20 my-auto px-6 py-4 flex flex-col justify-center">
              {/* Hotspot 1: Cargo Pantechnicon */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onMouseEnter={() => setActiveHotspot('box')}
                  onClick={() => setActiveHotspot(activeHotspot === 'box' ? null : 'box')}
                  className="group px-3 py-1.5 rounded-lg bg-[#090D15]/90 hover:bg-[#C81036] border border-[#C9D2DC]/30 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C81036] group-hover:text-white" />
                  <span>Enclosed Pantechnicon Box</span>
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setActiveHotspot('tailgate')}
                  onClick={() => setActiveHotspot(activeHotspot === 'tailgate' ? null : 'tailgate')}
                  className="group px-3 py-1.5 rounded-lg bg-[#090D15]/90 hover:bg-[#C81036] border border-[#C9D2DC]/30 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#124FA3] group-hover:text-white" />
                  <span>Hydraulic Tailgate Lift</span>
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setActiveHotspot('crew')}
                  onClick={() => setActiveHotspot(activeHotspot === 'crew' ? null : 'crew')}
                  className="group px-3 py-1.5 rounded-lg bg-[#090D15]/90 hover:bg-[#C81036] border border-[#C9D2DC]/30 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A15C] group-hover:text-white" />
                  <span>Direct Operator Dispatch</span>
                </button>
              </div>

              {/* Dynamic Hotspot Detail Toast */}
              {activeHotspot && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#090D15]/95 backdrop-blur-xl border border-[#C81036]/40 shadow-2xl max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {activeHotspot === 'box' && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C81036]" />
                        Dust-Sealed &amp; Fully Weatherproof Cargo Pantechnicon
                      </p>
                      <p className="text-[11px] text-[#C9D2DC] leading-relaxed">
                        Internal structural tie-down rails at 3 height levels. Mattresses, timber buffets, and upholstered lounges are strapped securely to eliminate transit vibration.
                      </p>
                    </div>
                  )}

                  {activeHotspot === 'tailgate' && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#124FA3]" />
                        Commercial Hydraulic Tailgate Platform
                      </p>
                      <p className="text-[11px] text-[#C9D2DC] leading-relaxed">
                        Enables level, zero-drop mechanical lifting for heavy double-door fridges, solid timber dining tables, washing machines, and upright pianos without awkward tilting.
                      </p>
                    </div>
                  )}

                  {activeHotspot === 'crew' && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15C]" />
                        Direct Leadership: {mrkBusiness.ownerContactName.value}
                      </p>
                      <p className="text-[11px] text-[#C9D2DC] leading-relaxed">
                        Direct communication with the business owner from quote confirmation to moving day arrival. No call centers or unassigned subcontractors.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Layer 4: Cutaway Explanation Overlay (Cutaway Mode) */}
          {viewMode === 'cutaway' && (
            <div className="relative z-20 my-auto p-5 sm:p-6 bg-[#090D15]/85 backdrop-blur-md rounded-2xl border border-[#C9D2DC]/20 max-w-lg mx-4">
              <span className="text-[11px] font-mono font-semibold text-[#C81036] uppercase tracking-wider">
                Load Architecture Standard
              </span>
              <h4 className="font-display text-lg font-bold text-white mt-1">
                Triple-Layer Furniture Defense
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs text-[#C9D2DC]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C81036] font-bold">—</span>
                  <span><strong>Layer 1 (Padded Blankets):</strong> Heavy quilted moving blankets cover all finished timber, glass, and polished surfaces.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#124FA3] font-bold">—</span>
                  <span><strong>Layer 2 (Neoprene Runners):</strong> Doorways and floor corridors are safeguarded from heel marks, trolley scuffs, and dust.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A15C] font-bold">—</span>
                  <span><strong>Layer 3 (E-Track Strapping):</strong> Webbed ratchets pin load tiers against internal body ribs every 1.5 meters.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Layer 5: City Explanation Overlay (City Mode) */}
          {viewMode === 'city' && (
            <div className="relative z-20 my-auto p-5 sm:p-6 bg-[#090D15]/85 backdrop-blur-md rounded-2xl border border-[#C9D2DC]/20 max-w-lg mx-4">
              <span className="text-[11px] font-mono font-semibold text-[#124FA3] uppercase tracking-wider">
                Local Adelaide Territory
              </span>
              <h4 className="font-display text-lg font-bold text-white mt-1">
                Servicing Greater Adelaide &amp; Hills
              </h4>
              <p className="mt-2 text-xs text-[#C9D2DC] leading-relaxed">
                From high-density apartment lift windows along North Terrace to character villas in Norwood and steep winding blocks through Stirling, Bridgewater, and the Adelaide Hills.
              </p>
            </div>
          )}

          {/* Bottom Bar: Move Profile Pre-Fill Buttons & Concept Credit */}
          <div className="relative z-20 p-4 sm:p-5 border-t border-[#C9D2DC]/15 bg-[#090D15]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={mrkBusiness.brandAssets.badgeConcept}
                alt="MRK Removals Adelaide Ruby and Platinum Crest Concept"
                className="w-10 h-10 rounded-lg object-contain bg-[#0E1420] p-1 border border-[#C9D2DC]/25 shrink-0 shadow-md"
              />
              <div>
                <p className="text-xs font-semibold text-white">
                  Pre-fill your moving quote:
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  Select your move size to jump to our tailored quote builder
                </p>
              </div>
            </div>

            {onSelectQuoteWithMode && (
              <div className="flex flex-wrap items-center gap-2">
                {['1–2 Bed Apartment', '3–4 Bed House', 'Office Relocation'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onSelectQuoteWithMode(preset)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#161E2E] hover:bg-[#C81036] text-[#F5F7FA] border border-[#C9D2DC]/20 hover:border-[#C81036] transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
