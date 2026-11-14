import React, { useState } from 'react';
import { mrkBusiness } from '../../config/business';

interface CinematicTruckSceneProps {
  onSelectQuoteWithMode?: (presetSize: string) => void;
}

/**
 * Interactive 2.5D/3D Perspective MRK Branded Moving Truck & Adelaide Twilight Scene.
 * Built with crisp vector geometry, atmospheric lighting layers, and interactive inspection modes
 * (Exterior Livery View vs Protected Cargo Cutaway View + Twilight/Daylight lighting switch).
 */
export const CinematicTruckScene: React.FC<CinematicTruckSceneProps> = ({
  onSelectQuoteWithMode,
}) => {
  const [viewMode, setViewMode] = useState<'exterior' | 'cutaway'>('exterior');
  const [lightingMode, setLightingMode] = useState<'twilight' | 'daylight'>('twilight');
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 5).toFixed(2)),
      ry: Number((x * 7).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Interactive Stage Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#090D15]/90 border border-[#C9D2DC]/15"
          role="group"
          aria-label="Truck visual inspection mode"
        >
          <button
            type="button"
            onClick={() => setViewMode('exterior')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'exterior'
                ? 'bg-[#C81036] text-white'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            MRK Livery View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cutaway')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'cutaway'
                ? 'bg-[#C81036] text-white'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            Cargo Protection View
          </button>
        </div>

        <div
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#090D15]/90 border border-[#C9D2DC]/15"
          role="group"
          aria-label="Adelaide scene lighting"
        >
          <button
            type="button"
            onClick={() => setLightingMode('twilight')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              lightingMode === 'twilight'
                ? 'bg-[#124FA3] text-white'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            Adelaide Twilight
          </button>
          <button
            type="button"
            onClick={() => setLightingMode('daylight')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              lightingMode === 'daylight'
                ? 'bg-[#124FA3] text-white'
                : 'text-[#C9D2DC] hover:text-white'
            }`}
          >
            Clear Morning
          </button>
        </div>
      </div>

      {/* Main 3D Perspective Stage */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="perspective-stage relative flex-1 min-h-[340px] sm:min-h-[390px] rounded-2xl overflow-hidden border border-[#C9D2DC]/20 select-none"
      >
        <div
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
          className={`dimensional-card relative w-full h-full flex flex-col justify-between p-5 sm:p-6 transition-colors duration-500 ${
            lightingMode === 'twilight'
              ? 'bg-gradient-to-b from-[#090D15] via-[#0F1B33] to-[#090D15]'
              : 'bg-gradient-to-b from-[#13294B] via-[#1E3A5F] to-[#0E1726]'
          }`}
        >
          {/* Atmospheric Sapphire & Ruby Horizon Glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                lightingMode === 'twilight'
                  ? 'radial-gradient(circle at 72% 28%, rgba(18, 79, 163, 0.36), transparent 55%), radial-gradient(circle at 28% 68%, rgba(200, 16, 54, 0.24), transparent 50%)'
                  : 'radial-gradient(circle at 75% 22%, rgba(201, 210, 220, 0.28), transparent 55%), radial-gradient(circle at 30% 65%, rgba(18, 79, 163, 0.25), transparent 50%)',
            }}
          />

          {/* Top Scene Context Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-[#C9D2DC]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Adelaide Metropolitan Corridor</span>
              <span aria-hidden="true">·</span>
              <span>North Terrace &amp; Park Lands Aspect</span>
            </div>
            <span className="font-mono tabular-nums text-[#C5A15C]">
              {viewMode === 'exterior' ? 'CONCEPT LIVERY' : 'LOAD SEQUENCING'}
            </span>
          </div>

          {/* Centerpiece Vector Scene: Adelaide Skyline + Realistic MRK Pantechnicon Truck */}
          <div className="relative z-10 my-auto py-1">
            <svg
              viewBox="0 55 800 305"
              className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.75)]"
              role="img"
              aria-label="MRK Removals Adelaide conceptual branded moving truck positioned against the Adelaide city skyline"
            >
              <defs>
                <linearGradient id="mrkBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#161E2E" />
                  <stop offset="55%" stopColor="#0B101B" />
                  <stop offset="100%" stopColor="#060911" />
                </linearGradient>
                <linearGradient id="mrkCabPlatinum" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="45%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                <linearGradient id="mrkRubyArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#990A27" />
                  <stop offset="50%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#C81036" />
                </linearGradient>
                <linearGradient id="roadSurface" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#111827" />
                  <stop offset="100%" stopColor="#05080F" />
                </linearGradient>
              </defs>

              {/* Distant Adelaide Hills Silhouette */}
              <path
                d="M0 245 Q160 205 330 228 T660 210 L800 225 L800 275 L0 275 Z"
                fill="#0B1324"
                opacity="0.85"
              />

              {/* Adelaide Skyline Architectural Silhouette (St Peter's Spires, Adelaide Oval Roofline, CBD Towers) */}
              <g opacity={lightingMode === 'twilight' ? '0.88' : '0.72'}>
                {/* CBD High-Rise Towers */}
                <rect x="65" y="125" width="38" height="145" fill="#111C30" stroke="#C9D2DC" strokeOpacity="0.18" />
                <rect x="112" y="102" width="46" height="168" fill="#0E1729" stroke="#C9D2DC" strokeOpacity="0.22" />
                <rect x="166" y="138" width="34" height="132" fill="#132038" stroke="#C9D2DC" strokeOpacity="0.15" />

                {/* Illuminated Tower Windows */}
                {lightingMode === 'twilight' && (
                  <g fill="#C5A15C" opacity="0.55">
                    <rect x="120" y="116" width="6" height="3" />
                    <rect x="132" y="116" width="6" height="3" />
                    <rect x="120" y="130" width="6" height="3" />
                    <rect x="142" y="144" width="6" height="3" />
                    <rect x="75" y="142" width="5" height="3" />
                    <rect x="86" y="158" width="5" height="3" />
                  </g>
                )}

                {/* St Peter's Cathedral Twin Spires Silhouette */}
                <path
                  d="M610 265 V165 L620 112 L630 165 V265 Z M642 265 V165 L652 112 L662 165 V265 Z M618 195 H654 V265 H618 Z"
                  fill="#101B2E"
                  stroke="#C9D2DC"
                  strokeOpacity="0.24"
                />

                {/* Iconic Curved Adelaide Oval Roof Shell */}
                <path
                  d="M668 265 Q722 215 776 265 Z"
                  fill="#16243D"
                  stroke="#C9D2DC"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <path
                  d="M682 265 Q722 232 762 265"
                  fill="none"
                  stroke="#124FA3"
                  strokeWidth="1.2"
                />
              </g>

              {/* Asphalt Highway Apron & Motion Perspective Lines */}
              <polygon points="0,268 800,268 800,375 0,375" fill="url(#roadSurface)" />
              <line x1="0" y1="268" x2="800" y2="268" stroke="#C9D2DC" strokeOpacity="0.25" strokeWidth="1.5" />
              <line
                x1="30"
                y1="336"
                x2="770"
                y2="336"
                stroke="#C81036"
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeDasharray="28 18"
              />

              {/* Ground Headlight & Underglow Reflection */}
              <ellipse
                cx="660"
                cy="318"
                rx="95"
                ry="14"
                fill={lightingMode === 'twilight' ? '#38BDF8' : '#E2E8F0'}
                opacity={lightingMode === 'twilight' ? '0.28' : '0.12'}
              />
              <ellipse cx="340" cy="318" rx="185" ry="14" fill="#000000" opacity="0.65" />

              {/* === MRK BRANDED PANTECHNICON MOVING TRUCK === */}
              <g transform="translate(15, 0)">
                {/* Rear Hydraulic Tailgate Lift Platform */}
                <path d="M105 256 L82 282 L112 282 Z" fill="#242A34" stroke="#C9D2DC" strokeWidth="1.2" />

                {/* Main Pantechnicon Box Body */}
                <rect
                  x="105"
                  y="92"
                  width="395"
                  height="176"
                  rx="6"
                  fill="url(#mrkBodyGrad)"
                  stroke="#C9D2DC"
                  strokeWidth="2.2"
                />

                {/* Top Aerodynamic Nose Cone above Cab */}
                <path
                  d="M500 96 Q548 96 568 134 L500 134 Z"
                  fill="url(#mrkCabPlatinum)"
                  stroke="#C9D2DC"
                  strokeWidth="1.5"
                />

                {viewMode === 'exterior' ? (
                  /* EXTERIOR BRANDED LIVERY VIEW */
                  <g>
                    {/* Sapphire Blue Lower Dynamic Ribbon */}
                    <path
                      d="M115 244 Q285 210 490 232 L490 246 Q285 226 115 254 Z"
                      fill="#124FA3"
                      opacity="0.9"
                    />
                    {/* Ruby Red Signature Motion Sweep */}
                    <path
                      d="M115 224 Q265 132 490 144 L490 164 Q275 154 115 242 Z"
                      fill="url(#mrkRubyArc)"
                    />
                    {/* Subtle Champagne Gold Pinstripe (< 5% accent rule) */}
                    <path
                      d="M135 232 Q280 158 488 168"
                      fill="none"
                      stroke="#C5A15C"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />

                    {/* Crisp MRK Typography on Truck Box */}
                    <text
                      x="305"
                      y="196"
                      textAnchor="middle"
                      fill="#F5F7FA"
                      fontFamily="Outfit, sans-serif"
                      fontWeight="800"
                      fontSize="54"
                      letterSpacing="4"
                    >
                      MRK
                    </text>
                    <text
                      x="305"
                      y="220"
                      textAnchor="middle"
                      fill="#C9D2DC"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="700"
                      fontSize="14"
                      letterSpacing="6"
                    >
                      REMOVALS ADELAIDE
                    </text>
                    <text
                      x="305"
                      y="256"
                      textAnchor="middle"
                      fill="#F5F7FA"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                      fontSize="12"
                      letterSpacing="1.5"
                    >
                      0423 653 342 · mrkremovalsadelaide.com.au
                    </text>
                  </g>
                ) : (
                  /* CARGO PROTECTION CUTAWAY VIEW */
                  <g>
                    <rect
                      x="118"
                      y="106"
                      width="368"
                      height="148"
                      rx="4"
                      fill="#090D15"
                      stroke="#C81036"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    {/* Internal Tie-Down Rails */}
                    <line x1="118" y1="152" x2="486" y2="152" stroke="#C9D2DC" strokeOpacity="0.3" strokeWidth="2" />
                    <line x1="118" y1="202" x2="486" y2="202" stroke="#C9D2DC" strokeOpacity="0.3" strokeWidth="2" />

                    {/* Zone 1: Padded Upright Appliances & Tall Cabinetry */}
                    <rect x="130" y="122" width="68" height="126" rx="3" fill="#1E293B" stroke="#C9D2DC" strokeWidth="1.2" />
                    <text x="164" y="182" textAnchor="middle" fill="#F5F7FA" fontSize="10" fontWeight="600">
                      WHITEGOODS
                    </text>
                    <text x="164" y="196" textAnchor="middle" fill="#C9D2DC" fontSize="9">
                      Strapped Upright
                    </text>

                    {/* Zone 2: Blanket-Wrapped Lounge & Mattresses */}
                    <rect x="208" y="136" width="125" height="112" rx="3" fill="#172554" stroke="#38BDF8" strokeWidth="1.2" />
                    <text x="270" y="186" textAnchor="middle" fill="#F5F7FA" fontSize="10" fontWeight="600">
                      PADDED FURNITURE
                    </text>
                    <text x="270" y="200" textAnchor="middle" fill="#C9D2DC" fontSize="9">
                      Blanket &amp; Tie Protection
                    </text>

                    {/* Zone 3: Tiered Labelled Moving Cartons */}
                    <g fill="#242A34" stroke="#C5A15C" strokeWidth="1.2">
                      <rect x="344" y="196" width="62" height="52" rx="2" />
                      <rect x="412" y="196" width="62" height="52" rx="2" />
                      <rect x="344" y="140" width="62" height="52" rx="2" />
                      <rect x="412" y="140" width="62" height="52" rx="2" />
                    </g>
                    <text x="408" y="128" textAnchor="middle" fill="#C5A15C" fontSize="10" fontWeight="600">
                      LABELLED CARTONS &amp; TROLLEYS
                    </text>
                  </g>
                )}

                {/* Side Underrun Protection Skirts */}
                <rect x="255" y="274" width="185" height="18" rx="2" fill="#1E293B" stroke="#C9D2DC" strokeWidth="1" />

                {/* Truck Cab (Platinum Metallic Finish) */}
                <path
                  d="M500 134 H582 Q602 134 612 158 L632 212 Q636 224 636 240 V276 H500 V134 Z"
                  fill="url(#mrkCabPlatinum)"
                  stroke="#F8FAFC"
                  strokeWidth="1.8"
                />
                {/* Windshield & Side Window */}
                <path
                  d="M524 148 H576 L598 202 H524 V148 Z"
                  fill="#0F172A"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                {/* Cab Door MRK Monogram */}
                <text
                  x="558"
                  y="232"
                  textAnchor="middle"
                  fill="#090D15"
                  fontFamily="Outfit, sans-serif"
                  fontWeight="800"
                  fontSize="16"
                  letterSpacing="1.5"
                >
                  MRK
                </text>
                <line x1="524" y1="238" x2="594" y2="238" stroke="#C81036" strokeWidth="2.5" />

                {/* Front Grille & LED Headlight Assembly */}
                <rect x="618" y="218" width="18" height="34" rx="2" fill="#090D15" />
                <rect
                  x="616"
                  y="254"
                  width="20"
                  height="12"
                  rx="2"
                  fill="#F8FAFC"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />

                {/* Headlight Beam Cone in Twilight Mode */}
                {lightingMode === 'twilight' && (
                  <polygon
                    points="636,256 785,232 785,310 636,268"
                    fill="#38BDF8"
                    opacity="0.18"
                  />
                )}

                {/* Amber Top Clearance Marker Lights */}
                <circle cx="115" cy="98" r="3.5" fill="#F59E0B" />
                <circle cx="492" cy="98" r="3.5" fill="#F59E0B" />

                {/* Dual Rear Axle Wheels & Front Steer Wheel */}
                {[165, 222, 565].map((cx) => (
                  <g key={cx}>
                    <circle cx={cx} cy="286" r="30" fill="#090D15" stroke="#334155" strokeWidth="5" />
                    <circle cx={cx} cy="286" r="17" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="2" />
                    <circle cx={cx} cy="286" r="6" fill="#090D15" />
                  </g>
                ))}
              </g>
            </svg>
          </div>

          {/* Bottom Interactive Load Presets + Authentic Brand Concept Thumbnail */}
          <div className="relative z-10 pt-3 border-t border-[#C9D2DC]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={mrkBusiness.brandAssets.badgeConcept}
                alt="MRK Removals Adelaide Ruby and Platinum Crest Concept"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-contain bg-[#090D15] p-0.5 border border-[#C9D2DC]/20 shrink-0"
              />
              <div>
                <p className="text-xs font-medium text-white">
                  Select a move profile to pre-fill your quote:
                </p>
                <p className="text-[11px] text-[#C9D2DC]">
                  Conceptual MRK brand livery &amp; Adelaide visual by AB Web Studio
                </p>
              </div>
            </div>

            {onSelectQuoteWithMode && (
              <div className="flex flex-wrap items-center gap-1.5">
                {['1–2 Bed Apartment', '3–4 Bed House', 'Office Relocation'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onSelectQuoteWithMode(preset)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-[#161E2E] hover:bg-[#C81036] text-[#F5F7FA] border border-[#C9D2DC]/20 transition-colors whitespace-nowrap shrink-0"
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
