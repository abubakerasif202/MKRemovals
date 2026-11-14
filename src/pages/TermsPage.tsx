import React from 'react';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Terms & Conditions', path: '/terms' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 space-y-3">
          <p className="text-xs text-[#C5A15C] font-medium">
            Prepared for Owner &amp; Legal Review · South Australia
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Website &amp; Quote Terms — {mrkBusiness.brandName}
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Status: Draft prepared for review by {mrkBusiness.ownerContactName.value} (ABN{' '}
            {mrkBusiness.abn.value} supplied) prior to live commercial publication.
          </p>
        </div>
      </div>

      <div className="mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/20 space-y-6 text-sm text-[#C9D2DC] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">
            1. Quote Enquiries Are Not Automated Bookings
          </h2>
          <p>
            Submitting a quote form on <strong className="text-white">{mrkBusiness.domain}</strong>{' '}
            constitutes an enquiry for a moving estimate and does not create a confirmed reservation
            or binding contract. A moving date and arrival window are only confirmed after{' '}
            <strong className="text-white">{mrkBusiness.brandName}</strong> reviews your inventory
            and access requirements and both parties explicitly agree to the quoted scope and terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">
            2. Indicative Hourly Rate Guidance ($130–$135/hr)
          </h2>
          <p className="text-white font-medium">{formatIndicativeRateHeadline()}</p>
          <p>{getMandatoryRateDisclaimer()}</p>
          <p>
            Any hourly figures shown on this website are general indicative guidance only. Crew
            allocation, truck capacity, minimum booking hours, travel/call-out charges, stair or
            heavy-item conditions, and GST treatment must be confirmed directly with{' '}
            <strong className="text-white">{mrkBusiness.brandName}</strong> for your specific job.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">
            3. Customer Disclosures &amp; Safe Access
          </h2>
          <p>
            Accurate quoting and safe moving-day execution depend on complete disclosure of:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Stairs, steep driveways, low overhanging trees, or restricted parking zones;</li>
            <li>Apartment service-lift dimensions, loading dock height limits, and booking windows;</li>
            <li>Heavy, fragile, or oversized items (including stone tables, gym gear, or large appliances);</li>
            <li>Exclusion of dangerous or prohibited goods (such as LPG gas bottles, fuel, or chemicals).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">
            4. Pending Commercial Policy Confirmation
          </h2>
          <p>
            Before entering into a moving service agreement, customers should request and review the
            applicable service terms covering cancellation/rescheduling notice, payment methods,
            transit goods handling, and liability/insurance provisions directly from{' '}
            <strong className="text-white">{mrkBusiness.brandName}</strong> on{' '}
            <a href={mrkBusiness.phoneHref} className="text-white underline font-mono">
              {mrkBusiness.phoneDisplay}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
