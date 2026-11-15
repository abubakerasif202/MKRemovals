import React from 'react';
import { Phone, ArrowRight, ShieldCheck, MapPin, Truck, CheckCircle2, Sparkles } from 'lucide-react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { MRKVectorEmblem } from '../components/brand/MRKLogo';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'About MRK Removals', path: '/about' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81036]/10 border border-[#C81036]/30 text-xs text-[#0B1B33] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C81036]" />
              <span>Adelaide Local Removalists · Direct Operator Accountability</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B33] tracking-tight">
              About {mrkBusiness.brandName}
            </h1>

            <p className="text-base sm:text-lg text-[#33445C] leading-relaxed">
              Led by <strong className="text-[#0B1B33]">{mrkBusiness.ownerContactName.value}</strong>,{' '}
              <strong className="text-[#0B1B33]">{mrkBusiness.brandName}</strong> is built around a
              straightforward principle: moving house, apartment, or commercial workspace works best when the
              person quoting your job understands your property access, respects your furniture, and
              communicates clearly from the first phone call.
            </p>

            <p className="text-sm text-[#33445C] leading-relaxed">
              Rather than relying on generic automated booking engines that ignore Adelaide’s
              steep foothills driveways, narrow heritage lanes, or strict apartment lift windows,
              we review every move enquiry individually so moving day runs smoothly.
            </p>
          </div>

          <div className="lg:col-span-5 mrk-surface-elevated rounded-3xl p-6 sm:p-7 border border-[#D7E0EC] space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-[#D7E0EC]">
              <div className="w-12 h-12 rounded-xl overflow-hidden p-1 bg-gradient-to-br from-[#C81036]/40 via-[#124FA3]/30 to-[#090D15] border border-[#D7E0EC] shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={mrkBusiness.brandAssets.badgeConcept}
                  alt="MRK Removals Adelaide Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1B33]">
                  Verified Business Profile
                </h2>
                <p className="text-xs text-[#8A6414] font-medium">{mrkBusiness.locationLabel}</p>
              </div>
            </div>

            <dl className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Brand / Trading Name</dt>
                <dd className="text-[#0B1B33] font-semibold text-right">{mrkBusiness.brandName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Owner / Primary Contact</dt>
                <dd className="text-[#0B1B33] font-semibold text-right">
                  {mrkBusiness.ownerContactName.value}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Direct Telephone</dt>
                <dd className="font-mono text-[#0B1B33] font-semibold text-right tabular-nums">
                  <a href={mrkBusiness.phoneHref} className="hover:text-[#A00E2C] underline">
                    {mrkBusiness.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Direct Email</dt>
                <dd className="font-mono text-[#0B1B33] text-right text-xs sm:text-sm">
                  <a href={mrkBusiness.enquiryEmailHref} className="hover:text-[#A00E2C] underline">
                    {mrkBusiness.enquiryEmail}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Owner-Supplied ABN</dt>
                <dd className="font-mono text-[#0B1B33] text-right tabular-nums">
                  {mrkBusiness.abn.value}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#5B6B80]">Indicative Hourly Rate</dt>
                <dd className="font-mono text-[#8A6414] font-semibold text-right tabular-nums">
                  AUD $130–$135/hr
                </dd>
              </div>
            </dl>

            <p className="text-[11px] text-[#5B6B80] pt-2 border-t border-[#D7E0EC] leading-relaxed">
              {getMandatoryRateDisclaimer()}
            </p>
          </div>
        </div>
      </div>

      {/* Commercial Fleet & Care Standards Feature */}
      <section className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D7E0EC] h-64 sm:h-80 shadow-2xl group">
          <img
            src={mrkBusiness.photographyAssets.heroTruckCinematic}
            alt="MRK Removals Adelaide commercial pantechnicon moving truck on North Terrace"
            className="w-full h-full object-cover object-center filter brightness-110 saturate-110 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/55 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
            <span className="font-semibold flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C81036]" />
              Heavy-Duty Enclosed Pantechnicon Fleet
            </span>
            <span className="font-mono text-[10px] text-[#8A6414]">ADELAIDE REGISTERED</span>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124FA3]/10 border border-[#124FA3]/25 text-xs text-[#33445C]">
            <Sparkles className="w-3.5 h-3.5 text-[#124FA3]" />
            <span>Operational Rigour</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
            Realistic Fleet Capabilities, Padded Cargo Care
          </h2>

          <p className="text-sm text-[#33445C] leading-relaxed">
            Our pantechnicon moving trucks are equipped specifically for Australian domestic and commercial relocations:
            hydraulic tailgate platforms for heavy appliances and upright pianos, full-height E-track internal tie-rails, and an extensive supply of heavy-duty quilted moving blankets.
          </p>

          <ul className="space-y-2 text-xs text-[#33445C] pt-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" />
              <span>Full weather sealing protects your furniture from rain and road dust during transit.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" />
              <span>Hydraulic tailgate lifts reduce manual strain and prevent drops during heavy loading.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C81036] shrink-0 mt-0.5" />
              <span>Neoprene floor runners keep your hallway floorboards and carpets clean.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Core Operating Principles */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-[#8A6414] font-semibold uppercase tracking-wider">How We Work</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
            What You Can Expect From MRK Removals Adelaide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              index: '01',
              title: 'Honest Scope & Rate Clarity',
              body: 'We discuss your inventory, stairs, parking distance, and target dates before quoting—never promising a misleading one-size-fits-all fee.',
            },
            {
              index: '02',
              title: 'Methodical Furniture Protection',
              body: 'Every load is sequenced with heavy appliances and sturdy cartons anchored first, and furniture wrapped and secured against movement in transit.',
            },
            {
              index: '03',
              title: 'Local Adelaide Familiarity',
              body: 'Whether navigating North Terrace apartment docks, Norwood terraces, or Stirling driveways, we factor local road and access conditions into your plan.',
            },
          ].map((item) => (
            <div
              key={item.index}
              className="mrk-surface rounded-2xl p-6 border border-[#D7E0EC] space-y-2.5 hover:border-[#C81036]/40 transition-colors shadow-md"
            >
              <span className="font-mono text-xs text-[#C81036] font-bold tabular-nums">{item.index}</span>
              <h3 className="font-display text-lg font-bold text-[#0B1B33]">{item.title}</h3>
              <p className="text-sm text-[#33445C] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AB Web Studio Brand Identity & Fleet Concept Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-xs text-[#8A6414] font-semibold uppercase tracking-wider">
              Brand Architecture by {mrkBusiness.creativeAgency.name}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
              MRK Removals Adelaide — Brand &amp; Concept Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#33445C]">
              Showcasing the official Ruby Red, Platinum Silver, Sapphire Blue, and Midnight Black
              brand concepts alongside our scalable vector identity system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Primary Logo',
              subtitle: 'Horizontal lockup: house, truck and wordmark',
              src: mrkBusiness.brandAssets.fullLogoConcept,
            },
            {
              title: 'Stacked Logo',
              subtitle: 'Compact lockup for tight spaces',
              src: mrkBusiness.brandAssets.compactLogoConcept,
            },
            {
              title: 'Shield Emblem',
              subtitle: 'Crest for fleet and uniforms',
              src: mrkBusiness.brandAssets.badgeConcept,
            },
            {
              title: 'Round Emblem',
              subtitle: 'Medallion with Adelaide skyline',
              src: mrkBusiness.brandAssets.roundCrestConcept,
            },
          ].map((asset) => (
            <figure
              key={asset.title}
              className="mrk-surface rounded-2xl p-4 border border-[#D7E0EC] flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="aspect-square rounded-xl bg-white border border-[#D7E0EC] p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={asset.src}
                  alt={`MRK Removals Adelaide — ${asset.title}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <figcaption className="space-y-0.5">
                <p className="font-display text-sm font-bold text-[#0B1B33]">{asset.title}</p>
                <p className="text-xs text-[#5B6B80]">{asset.subtitle}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#D7E0EC] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-[#0B1B33]">
            Planning a Move in Adelaide?
          </h2>
          <p className="text-sm text-[#33445C]">{formatIndicativeRateHeadline()}</p>
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
            className="px-5 py-3 rounded-xl btn-secondary text-[#0B1B33] text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#C81036]" />
            <span>Call {mrkBusiness.phoneDisplay}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
