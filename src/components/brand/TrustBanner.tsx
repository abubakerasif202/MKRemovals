import React from 'react';
import { ShieldCheck, MapPin, Users, PackageCheck } from 'lucide-react';
import { mrkBusiness } from '../../config/business';

export interface TrustPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const TRUST_BANNER_ITEMS: TrustPillar[] = [
  {
    id: 'licensed-insured',
    title: 'Licensed & Insured',
    subtitle: `ABN ${mrkBusiness.abn.value}`,
    description:
      'Registered South Australian operator with scope, transit terms, and coverage details confirmed transparently before moving day.',
    Icon: ShieldCheck,
    accentColor: '#C81036',
  },
  {
    id: 'adelaide-local',
    title: 'Adelaide Local',
    subtitle: 'Metro, CBD & Hills Routes',
    description:
      'Local knowledge of Adelaide CBD apartment lift windows, narrow inner-suburb streets, and steep foothills driveways.',
    Icon: MapPin,
    accentColor: '#124FA3',
  },
  {
    id: 'professional-team',
    title: 'Professional Team',
    subtitle: `Direct Contact: ${mrkBusiness.ownerContactName.value}`,
    description:
      'Methodical, punctual moving crew coordinated directly with clear arrival windows and straightforward communication.',
    Icon: Users,
    accentColor: '#C5A15C',
  },
  {
    id: 'secure-handling',
    title: 'Secure Handling',
    subtitle: 'Wrapped & Tie-Rail Strapped',
    description:
      'Protective padded blankets, upright appliance strapping, and balanced tier loading to safeguard furniture and walls.',
    Icon: PackageCheck,
    accentColor: '#C81036',
  },
];

interface TrustBannerProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({
  variant = 'default',
  className = '',
}) => {
  return (
    <section
      aria-label="MRK Removals Adelaide Core Trust Standards"
      data-testid="trust-banner"
      className={`mrk-surface rounded-2xl border border-[#C9D2DC]/20 overflow-hidden relative ${className}`}
    >
      {/* Subtle Top Sapphire-Ruby Hairline Accent */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(18, 79, 163, 0.85) 0%, rgba(200, 16, 54, 0.9) 50%, rgba(197, 161, 92, 0.75) 100%)',
        }}
      />

      <div className={variant === 'compact' ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-5 border-b border-[#C9D2DC]/12">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-xs bg-[#C81036] shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A15C]">
              Why Adelaide Households &amp; Offices Choose MRK Removals
            </p>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono tabular-nums">
            Direct Enquiries: {mrkBusiness.phoneDisplay} · ABN {mrkBusiness.abn.value}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_BANNER_ITEMS.map(({ id, title, subtitle, description, Icon, accentColor }) => (
            <div
              key={id}
              data-testid={`trust-pillar-${id}`}
              className="bg-[#090D15]/90 rounded-2xl p-5 sm:p-6 border border-[#C9D2DC]/15 hover:border-[#C81036]/40 transition-all shadow-md hover:-translate-y-1 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-[#161E2E] border border-[#C9D2DC]/20 flex items-center justify-center shrink-0"
                    style={{
                      boxShadow: `0 0 18px -4px ${accentColor}55`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8] text-right">
                    {subtitle}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {title}
                </h3>

                <p className="text-xs text-[#C9D2DC] leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
