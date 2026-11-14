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
    id: 'owner-led',
    title: 'Owner-Led Service',
    subtitle: `Direct: ${mrkBusiness.ownerContactName.value}`,
    description: `Enquiries are handled directly by ${mrkBusiness.ownerContactName.value}. Call ${mrkBusiness.phoneDisplay} to talk through your move.`,
    Icon: Users,
    accentColor: '#C5A15C',
  },
  {
    id: 'adelaide-local',
    title: 'Adelaide Local',
    subtitle: 'Metro, CBD & Hills',
    description:
      'Local knowledge of Adelaide CBD apartment lift windows, narrow inner-suburb streets, and steep foothills driveways.',
    Icon: MapPin,
    accentColor: '#124FA3',
  },
  {
    id: 'transparent-quotes',
    title: 'Transparent Quotes',
    subtitle: 'Quote-only, no instant booking',
    description:
      'Indicative hourly rates (including GST) are shown up front: 3-hour minimum plus a 1-hour call-out fee. Inclusions are confirmed in your quote before you commit.',
    Icon: ShieldCheck,
    accentColor: '#C81036',
  },
  {
    id: 'insured',
    title: '$1M Insurance Cover',
    subtitle: 'Insured moves',
    description:
      'MRK Removals Adelaide holds $1 million of insurance coverage. Stairs, lifts, parking and heavy items are also reviewed with you before moving day.',
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
      className={`mrk-surface rounded-2xl border border-[#D7E0EC] overflow-hidden relative ${className}`}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-5 border-b border-[#D7E0EC]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-xs bg-[#C81036] shrink-0" aria-hidden="true" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A6414]">
              Why customers get in touch with MRK Removals
            </h2>
          </div>
          <p className="text-xs text-[#5B6B80] font-mono tabular-nums">
            Direct enquiries: {mrkBusiness.phoneDisplay}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_BANNER_ITEMS.map(({ id, title, subtitle, description, Icon, accentColor }) => (
            <div
              key={id}
              data-testid={`trust-pillar-${id}`}
              className="bg-white/90 rounded-2xl p-5 sm:p-6 border border-[#D7E0EC] hover:border-[#C81036]/40 transition-all shadow-md hover:-translate-y-1 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-[#E8EEF7] border border-[#D7E0EC] flex items-center justify-center shrink-0"
                    style={{
                      boxShadow: `0 0 18px -4px ${accentColor}55`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#0B1B33]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#5B6B80] text-right">
                    {subtitle}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1B33]">
                  {title}
                </h3>

                <p className="text-xs text-[#33445C] leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
