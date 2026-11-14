import React from 'react';
import { mrkBusiness } from '../config/business';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 space-y-3">
          <p className="text-xs text-[#8A6414] font-medium">
            Prepared for Owner &amp; Legal Review · South Australia
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B1B33]">
            Privacy Policy — {mrkBusiness.brandName}
          </h1>
          <p className="text-xs text-[#5B6B80]">
            Status: Draft prepared for review by {mrkBusiness.ownerContactName.value} (ABN{' '}
            {mrkBusiness.abn.value} supplied) prior to live commercial publication.
          </p>
        </div>
      </div>

      <div className="mrk-surface rounded-2xl p-6 sm:p-8 border border-[#D7E0EC] space-y-6 text-sm text-[#33445C] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-[#0B1B33]">
            1. Scope &amp; Purpose
          </h2>
          <p>
            This Privacy Policy describes how <strong className="text-[#0B1B33]">{mrkBusiness.brandName}</strong>{' '}
            collects, uses, and protects personal information provided by visitors when requesting a
            moving quote or contacting us by telephone on{' '}
            <a href={mrkBusiness.phoneHref} className="text-[#0B1B33] underline font-mono">
              {mrkBusiness.phoneDisplay}
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-[#0B1B33]">
            2. Information We Collect for Moving Quotes
          </h2>
          <p>
            When you submit a quote enquiry, we request only the information reasonably necessary to
            assess and coordinate your relocation:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name, Australian phone number, and optional email address;</li>
            <li>Pickup and destination suburbs or postcodes and property access characteristics;</li>
            <li>Preferred moving date, date flexibility, and service category;</li>
            <li>Furniture inventory notes, stair/lift access details, and packing preferences.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-[#0B1B33]">
            3. How Enquiry Data Is Handled
          </h2>
          <p>
            Enquiry details are used solely to review your moving requirements, communicate quote
            terms, and schedule agreed services. We do not sell, rent, or trade customer contact
            details or property addresses to third-party marketing lists.
          </p>
          <p>
            When analytics are active on the production domain, personal telephone numbers, email
            addresses, full street addresses, and raw free-text inventory notes are excluded from
            analytics event payloads.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-[#0B1B33]">
            4. How Quote Requests Are Delivered
          </h2>
          <p>
                     When you submit the quote form, your details are validated on our server and then
            passed to an email-delivery service provider (currently Web3Forms, with Resend as an
            optional backup) so that they reach MRK Removals Adelaide by email. A request is only
            shown as sent once the provider confirms delivery. We do not keep a separate customer
            database. This section is a draft pending owner and legal review. </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-[#0B1B33]">
            5. Contact &amp; Access Requests
          </h2>
          <p>
            To request access to, correction of, or deletion of any quote enquiry details you have
            shared with <strong className="text-[#0B1B33]">{mrkBusiness.brandName}</strong>, please
            contact <strong className="text-[#0B1B33]">{mrkBusiness.ownerContactName.value}</strong> on{' '}
            <a href={mrkBusiness.phoneHref} className="text-[#0B1B33] underline font-mono">
              {mrkBusiness.phoneDisplay}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
