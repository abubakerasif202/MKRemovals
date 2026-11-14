import React, { useState, useEffect } from 'react';
import { Phone, Check, Copy, AlertCircle, RotateCcw, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import {
  validateQuoteSubmission,
  formatMoveBriefText,
  type QuoteFormInput,
  type PropertyAccessType,
  type DateFlexibility,
} from '../../lib/quote-validation';
import {
  mrkBusiness,
  formatIndicativeRateHeadline,
  getMandatoryRateDisclaimer,
} from '../../config/business';
import { MRK_SERVICES } from '../../content/services';

interface QuoteFormProps {
  sourcePage?: string;
  initialServiceType?: string;
  initialEstimatedSize?: string;
  initialPickupSuburb?: string;
  initialInventoryNotes?: string;
  compactHeader?: boolean;
}

interface SubmissionOutcome {
  ok: boolean;
  status: string;
  referenceId?: string;
  timestamp?: string;
  message: string;
  moveBrief?: string;
}

/** Sentinel used until the customer chooses a size; never pre-selects a real house size. */
export const SIZE_NOT_SELECTED = 'Not sure yet (described below)';

const newAttemptId = () =>
  `attempt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const QuoteForm: React.FC<QuoteFormProps> = ({
  sourcePage = '/',
  initialServiceType = 'house-removals',
  initialEstimatedSize = SIZE_NOT_SELECTED,
  initialPickupSuburb = '',
  initialInventoryNotes = '',
  compactHeader = false,
}) => {
  const [formData, setFormData] = useState<QuoteFormInput>({
    fullName: '',
    phone: '',
    email: '',
    preferredContact: 'phone',
    pickupSuburb: initialPickupSuburb,
    pickupAccess: 'single-storey-house',
    destinationSuburb: '',
    destinationAccess: 'single-storey-house',
    moveDate: '',
    dateFlexibility: 'flexible-3-days',
    serviceType: initialServiceType,
    estimatedSize: initialEstimatedSize,
    stairsOrLiftDetails: '',
    parkingDistance: 'Driveway / Direct Kerbside (<15m)',
    packingRequired: false,
    disassemblyRequired: false,
    heavyItemsNotes: '',
    inventoryNotes: initialInventoryNotes,
    sourcePage,
    attemptId: newAttemptId(),
    honeypotWebsite: '',
  });

  const [showExtendedDetails, setShowExtendedDetails] = useState<boolean>(
    Boolean(initialInventoryNotes)
  );
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof QuoteFormInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Sync external preset updates (e.g. from Hero or MoveScopeBuilder)
  useEffect(() => {
    if (initialServiceType) {
      setFormData((prev) => ({ ...prev, serviceType: initialServiceType }));
    }
  }, [initialServiceType]);

  useEffect(() => {
    if (initialEstimatedSize) {
      setFormData((prev) => ({ ...prev, estimatedSize: initialEstimatedSize }));
    }
  }, [initialEstimatedSize]);

  useEffect(() => {
    if (initialPickupSuburb) {
      setFormData((prev) => ({ ...prev, pickupSuburb: initialPickupSuburb }));
    }
  }, [initialPickupSuburb]);

  useEffect(() => {
    if (initialInventoryNotes) {
      setFormData((prev) => ({ ...prev, inventoryNotes: initialInventoryNotes }));
      setShowExtendedDetails(true);
    }
  }, [initialInventoryNotes]);

  const updateField = <K extends keyof QuoteFormInput>(key: K, value: QuoteFormInput[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateQuoteSubmission(formData);
    if (!validation.valid || !validation.sanitized) {
      setFieldErrors(validation.errors);
      setOutcome({
        ok: false,
        status: 'validation_error',
        message: 'Please review the highlighted required fields before submitting your quote request.',
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setOutcome(null);

    const moveBrief = formatMoveBriefText(validation.sanitized);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let payload: Record<string, any> = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }

      // Success is shown only when the server reports provider-confirmed delivery.
      if (response.ok && payload.ok === true && payload.status === 'delivered') {
        setOutcome({
          ok: true,
          status: 'delivered',
          referenceId: payload.referenceId,
          timestamp: payload.timestamp,
          message: `Your quote request has been sent to ${mrkBusiness.shortName}. ${mrkBusiness.ownerContactName.value} will review your details and contact you on ${formData.phone}.`,
          moveBrief: payload.moveBrief || moveBrief,
        });
        return;
      }

      if (payload.errors) {
        setFieldErrors(payload.errors);
      }
      setOutcome({
        ok: false,
        status: payload.status || 'delivery_failed',
        referenceId: payload.referenceId,
        message:
          payload.message ||
          `We could not send your request, and nothing has been delivered. Your details are still here. Please try again, email ${mrkBusiness.enquiryEmail} or call ${mrkBusiness.phoneDisplay}.`,
        moveBrief: payload.moveBrief || moveBrief,
      });
    } catch {
      setOutcome({
        ok: false,
        status: 'network_error',
        message: `We could not reach the server, so your request has not been sent. Your details are still here. Please check your connection and try again, email ${mrkBusiness.enquiryEmail} or call ${mrkBusiness.phoneDisplay}.`,
        moveBrief,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBrief = async () => {
    if (!outcome?.moveBrief) return;
    try {
      await navigator.clipboard.writeText(outcome.moveBrief);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    } catch {
      setCopiedBrief(false);
    }
  };

  const handleResetNewEnquiry = () => {
    setOutcome(null);
    setFormData((prev) => ({
      ...prev,
      attemptId: newAttemptId(),
    }));
  };

  if (outcome?.ok) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mrk-surface rounded-2xl p-6 sm:p-8 border border-[#C9D2DC]/25 space-y-6 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#C9D2DC]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#C5A15C] font-mono tabular-nums">
              <span>REFERENCE: {outcome.referenceId}</span>
              <span aria-hidden="true">·</span>
              <span>DELIVERY CONFIRMED</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Quote Sent Successfully
            </h3>
          </div>

          <button
            type="button"
            onClick={handleResetNewEnquiry}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#161E2E] hover:bg-[#242A34] text-[#C9D2DC] hover:text-white border border-[#C9D2DC]/20 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Send Another Quote</span>
          </button>
        </div>

        <p className="text-sm text-[#C9D2DC] leading-relaxed">{outcome.message}</p>

        {/* Direct Call Action & Copyable Move Brief */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-[#090D15] rounded-xl p-4 border border-[#C9D2DC]/15 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">
                Structured Move Summary
              </span>
              <button
                type="button"
                onClick={handleCopyBrief}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#161E2E] hover:bg-[#C81036] text-white transition-colors"
              >
                {copiedBrief ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Summary</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Move Summary</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-mono text-[#C9D2DC] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64">
              {outcome.moveBrief}
            </pre>
          </div>

          <div className="lg:col-span-5 bg-[#161E2E]/70 rounded-xl p-5 border border-[#C9D2DC]/20 space-y-4">
            <h4 className="font-display text-base font-semibold text-white">
              Speak Directly with {mrkBusiness.ownerContactName.value}
            </h4>
            <p className="text-xs text-[#C9D2DC] leading-relaxed">
              For fast confirmation of truck availability, crew size, inclusions for your move between{' '}
              <strong className="text-white">{formData.pickupSuburb}</strong> and{' '}
              <strong className="text-white">{formData.destinationSuburb}</strong>, call directly:
            </p>
            <a
              href={mrkBusiness.phoneHref}
              className="w-full py-3 px-4 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call {mrkBusiness.phoneDisplay}</span>
            </a>
            <a
              href={`${mrkBusiness.enquiryEmailHref}?subject=${encodeURIComponent(`Moving Quote Request: ${formData.pickupSuburb} to ${formData.destinationSuburb} [${outcome.referenceId || 'MRK'}]`)}&body=${encodeURIComponent(outcome.moveBrief || '')}`}
              className="w-full py-2.5 px-4 rounded-lg bg-[#090D15] hover:bg-[#1A2234] border border-[#C5A15C]/40 hover:border-[#C5A15C] text-[#F5F7FA] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A15C]" />
              <span>Email Move Brief to {mrkBusiness.enquiryEmail}</span>
            </a>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              {getMandatoryRateDisclaimer()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Request a Moving Quote Form"
      className="mrk-surface-elevated rounded-3xl p-6 sm:p-10 border border-[#C9D2DC]/25 space-y-6 shadow-2xl"
    >
      {!compactHeader && (
        <div className="pb-5 border-b border-[#C9D2DC]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#C5A15C] font-medium mb-1">
              Adelaide Residential, Apartment &amp; Commercial Moves
            </p>
            <h3 className="font-display text-2xl font-bold text-white">
              Request Your Tailored Moving Quote
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold text-white">{formatIndicativeRateHeadline()}</p>
            <p className="text-[11px] text-[#94A3B8]">
              Or call directly:{' '}
              <a
                href={mrkBusiness.phoneHref}
                className="font-mono text-[#F5F7FA] underline hover:text-[#C81036]"
              >
                {mrkBusiness.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Error Banner if validation or network error occurred */}
      {outcome && !outcome.ok && (
        <div
          role="alert"
          className="rounded-xl bg-[#C81036]/15 border border-[#C81036] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-white"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#C81036] shrink-0 mt-0.5" />
            <span>{outcome.message}</span>
          </div>
          {outcome.status !== 'validation_error' && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <a
                href={mrkBusiness.phoneHref}
                className="px-3.5 py-2 rounded-lg bg-[#C81036] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {mrkBusiness.phoneDisplay}</span>
              </a>
              <a
                href={`${mrkBusiness.enquiryEmailHref}?subject=${encodeURIComponent('Moving quote request')}&body=${encodeURIComponent(outcome.moveBrief || '')}`}
                className="px-3.5 py-2 rounded-lg border border-[#C9D2DC]/40 text-white text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Instead</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Anti-spam honeypot field (hidden from screen readers and visual users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="mrk-website-trap">Leave this field blank</label>
        <input
          id="mrk-website-trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypotWebsite}
          onChange={(e) => updateField('honeypotWebsite', e.target.value)}
        />
      </div>

      {/* Section 1: Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="quote-fullName"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Full Name <span className="text-[#C81036]">*</span>
          </label>
          <input
            id="quote-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="e.g. Jordan Taylor"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
            className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] border ${
              fieldErrors.fullName ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
            } focus:outline-none focus:border-[#C81036]`}
          />
          {fieldErrors.fullName && (
            <p id="err-fullName" className="mt-1 text-xs text-[#FDA4AF]">
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="quote-phone"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Australian Phone Number <span className="text-[#C81036]">*</span>
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="e.g. 0423 653 342"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
            className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] font-mono tabular-nums border ${
              fieldErrors.phone ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
            } focus:outline-none focus:border-[#C81036]`}
          />
          {fieldErrors.phone && (
            <p id="err-phone" className="mt-1 text-xs text-[#FDA4AF]">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label
            htmlFor="quote-email"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Email Address{' '}
            <span className="text-[#94A3B8] font-normal">(Optional if calling)</span>
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com.au"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] border ${
              fieldErrors.email ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
            } focus:outline-none focus:border-[#C81036]`}
          />
          {fieldErrors.email && (
            <p id="err-email" className="mt-1 text-xs text-[#FDA4AF]">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Pickup & Destination Suburbs + Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#C9D2DC]/10">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="quote-pickupSuburb"
              className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
            >
              Pickup Suburb or Postcode <span className="text-[#C81036]">*</span>
            </label>
            <input
              id="quote-pickupSuburb"
              name="pickupSuburb"
              type="text"
              required
              placeholder="e.g. Norwood 5067 or Adelaide CBD"
              value={formData.pickupSuburb}
              onChange={(e) => updateField('pickupSuburb', e.target.value)}
              aria-invalid={Boolean(fieldErrors.pickupSuburb)}
              aria-describedby={fieldErrors.pickupSuburb ? 'err-pickupSuburb' : undefined}
              className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] border ${
                fieldErrors.pickupSuburb ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
              } focus:outline-none focus:border-[#C81036]`}
            />
            {fieldErrors.pickupSuburb && (
              <p id="err-pickupSuburb" className="mt-1 text-xs text-[#FDA4AF]">
                {fieldErrors.pickupSuburb}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quote-pickupAccess"
              className="block text-xs font-medium text-[#C9D2DC] mb-1"
            >
              Pickup Property Type &amp; Access
            </label>
            <select
              id="quote-pickupAccess"
              value={formData.pickupAccess}
              onChange={(e) =>
                updateField('pickupAccess', e.target.value as PropertyAccessType)
              }
              className="w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
            >
              <option value="single-storey-house">Single-Storey House (Ground Access)</option>
              <option value="two-storey-house">Two-Storey / Split-Level Home</option>
              <option value="apartment-with-lift">Apartment Building (With Service Lift)</option>
              <option value="apartment-stairs-only">Apartment Walk-Up (Stairs Only)</option>
              <option value="townhouse-courtyard">Townhouse / Shared Driveway</option>
              <option value="office-commercial">Commercial Office / Suite</option>
              <option value="storage-unit">Storage Facility Unit</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="quote-destinationSuburb"
              className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
            >
              Destination Suburb or Postcode <span className="text-[#C81036]">*</span>
            </label>
            <input
              id="quote-destinationSuburb"
              name="destinationSuburb"
              type="text"
              required
              placeholder="e.g. Glenelg 5045 or Stirling 5152"
              value={formData.destinationSuburb}
              onChange={(e) => updateField('destinationSuburb', e.target.value)}
              aria-invalid={Boolean(fieldErrors.destinationSuburb)}
              aria-describedby={
                fieldErrors.destinationSuburb ? 'err-destinationSuburb' : undefined
              }
              className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] border ${
                fieldErrors.destinationSuburb ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
              } focus:outline-none focus:border-[#C81036]`}
            />
            {fieldErrors.destinationSuburb && (
              <p id="err-destinationSuburb" className="mt-1 text-xs text-[#FDA4AF]">
                {fieldErrors.destinationSuburb}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quote-destinationAccess"
              className="block text-xs font-medium text-[#C9D2DC] mb-1"
            >
              Destination Property Type &amp; Access
            </label>
            <select
              id="quote-destinationAccess"
              value={formData.destinationAccess}
              onChange={(e) =>
                updateField('destinationAccess', e.target.value as PropertyAccessType)
              }
              className="w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
            >
              <option value="single-storey-house">Single-Storey House (Ground Access)</option>
              <option value="two-storey-house">Two-Storey / Split-Level Home</option>
              <option value="apartment-with-lift">Apartment Building (With Service Lift)</option>
              <option value="apartment-stairs-only">Apartment Walk-Up (Stairs Only)</option>
              <option value="townhouse-courtyard">Townhouse / Shared Driveway</option>
              <option value="office-commercial">Commercial Office / Suite</option>
              <option value="storage-unit">Storage Facility Unit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Service Category, Move Size, Target Date & Flexibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#C9D2DC]/10">
        <div>
          <label
            htmlFor="quote-serviceType"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Service Category
          </label>
          <select
            id="quote-serviceType"
            value={formData.serviceType}
            onChange={(e) => updateField('serviceType', e.target.value)}
            className="w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
          >
            {MRK_SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.shortTitle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="quote-estimatedSize"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Estimated Move Size
          </label>
          <select
            id="quote-estimatedSize"
            value={formData.estimatedSize}
            onChange={(e) => updateField('estimatedSize', e.target.value)}
            className="w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
          >
            <option value={SIZE_NOT_SELECTED}>Not sure yet</option>
            <option value="Single Item / Few Furniture Pieces">Single Item / Few Pieces</option>
            <option value="1 Bedroom Apartment / Studio">1 Bedroom Apartment / Studio</option>
            <option value="2 Bedroom Home / Apartment">2 Bedroom Home / Apartment</option>
            <option value="3–4 Bedroom Home">3–4 Bedroom Home</option>
            <option value="5+ Bedroom Large Residence">5+ Bedroom Large Residence</option>
            <option value="Office / Commercial Relocation">Office / Commercial Suite</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="quote-moveDate"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Target Move Date{' '}
            {formData.dateFlexibility !== 'planning-ahead' && (
              <span className="text-[#C81036]">*</span>
            )}
          </label>
          <input
            id="quote-moveDate"
            name="moveDate"
            type="date"
            value={formData.moveDate}
            onChange={(e) => updateField('moveDate', e.target.value)}
            aria-invalid={Boolean(fieldErrors.moveDate)}
            aria-describedby={fieldErrors.moveDate ? 'err-moveDate' : undefined}
            className={`w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white font-mono border ${
              fieldErrors.moveDate ? 'border-[#C81036]' : 'border-[#C9D2DC]/25'
            } focus:outline-none focus:border-[#C81036]`}
          />
          {fieldErrors.moveDate && (
            <p id="err-moveDate" className="mt-1 text-xs text-[#FDA4AF]">
              {fieldErrors.moveDate}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="quote-dateFlexibility"
            className="block text-xs font-semibold text-[#F5F7FA] mb-1.5"
          >
            Date Flexibility
          </label>
          <select
            id="quote-dateFlexibility"
            value={formData.dateFlexibility}
            onChange={(e) =>
              updateField('dateFlexibility', e.target.value as DateFlexibility)
            }
            className="w-full rounded-lg bg-[#090D15] px-3.5 py-2.5 text-sm text-white border border-[#C9D2DC]/25 focus:outline-none focus:border-[#C81036]"
          >
            <option value="exact-date">Fixed Date (Settlement / Lease)</option>
            <option value="flexible-3-days">Flexible (±3 Days)</option>
            <option value="flexible-week">Flexible (±1 Week)</option>
            <option value="planning-ahead">Planning Ahead / Date Unconfirmed</option>
          </select>
        </div>
      </div>

      {/* Collapsible Optional Inventory, Stairs, Parking & Packing Details */}
      <div className="pt-2 border-t border-[#C9D2DC]/10">
        <button
          type="button"
          onClick={() => setShowExtendedDetails((prev) => !prev)}
          aria-expanded={showExtendedDetails}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9D2DC] hover:text-white transition-colors"
        >
          {showExtendedDetails ? (
            <ChevronUp className="w-4 h-4 text-[#C81036]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#C81036]" />
          )}
          <span>
            {showExtendedDetails
              ? 'Hide Inventory, Stairs, Parking & Packing Options'
              : 'Add Inventory List, Stairs/Lift Windows, or Packing Support (Recommended)'}
          </span>
        </button>

        {showExtendedDetails && (
          <div className="mt-4 space-y-4 bg-[#090D15]/70 rounded-xl p-4 border border-[#C9D2DC]/15">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quote-parkingDistance"
                  className="block text-xs font-medium text-[#C9D2DC] mb-1"
                >
                  Truck Parking &amp; Carry Distance
                </label>
                <select
                  id="quote-parkingDistance"
                  value={formData.parkingDistance}
                  onChange={(e) => updateField('parkingDistance', e.target.value)}
                  className="w-full rounded-lg bg-[#0E1420] px-3.5 py-2 text-sm text-white border border-[#C9D2DC]/20"
                >
                  <option value="Driveway / Direct Kerbside (<15m)">
                    Driveway / Direct Kerbside (&lt;15m)
                  </option>
                  <option value="Moderate Walk / Shared Courtyard (15m–40m)">
                    Moderate Walk / Shared Courtyard (15m–40m)
                  </option>
                  <option value="Long Carry / Loading Dock Corridor (40m+)">
                    Long Carry / Loading Dock Corridor (40m+)
                  </option>
                  <option value="Steep Driveway / Hills Access">
                    Steep Driveway / Adelaide Hills Access
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quote-stairsOrLiftDetails"
                  className="block text-xs font-medium text-[#C9D2DC] mb-1"
                >
                  Stairs, Lift Window, or Clearance Notes
                </label>
                <input
                  id="quote-stairsOrLiftDetails"
                  type="text"
                  placeholder="e.g. Lift booked 9am–12pm, or 14 internal stairs"
                  value={formData.stairsOrLiftDetails}
                  onChange={(e) => updateField('stairsOrLiftDetails', e.target.value)}
                  className="w-full rounded-lg bg-[#0E1420] px-3.5 py-2 text-sm text-white placeholder-[#64748B] border border-[#C9D2DC]/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 text-xs text-[#F5F7FA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.packingRequired)}
                  onChange={(e) => updateField('packingRequired', e.target.checked)}
                  className="rounded border-[#C9D2DC]/30 bg-[#090D15] text-[#C81036] focus:ring-[#C81036]"
                />
                <span>Include packing / carton preparation discussion</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-[#F5F7FA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.disassemblyRequired)}
                  onChange={(e) => updateField('disassemblyRequired', e.target.checked)}
                  className="rounded border-[#C9D2DC]/30 bg-[#090D15] text-[#C81036] focus:ring-[#C81036]"
                />
                <span>Bed frame / dining table disassembly required</span>
              </label>
            </div>

            <div>
              <label
                htmlFor="quote-inventoryNotes"
                className="block text-xs font-medium text-[#C9D2DC] mb-1"
              >
                Key Furniture Inventory &amp; Bulky Items
              </label>
              <textarea
                id="quote-inventoryNotes"
                rows={3}
                placeholder="List major items (e.g. 2 queen beds, L-shape sofa, double-door fridge, washing machine, 6-seater dining table, ~30 boxes) and any heavy or fragile pieces..."
                value={formData.inventoryNotes}
                onChange={(e) => updateField('inventoryNotes', e.target.value)}
                className="w-full rounded-lg bg-[#0E1420] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] border border-[#C9D2DC]/20 focus:outline-none focus:border-[#C81036]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Row & Honest Pricing Disclosure */}
      <div className="pt-3 border-t border-[#C9D2DC]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
          {getMandatoryRateDisclaimer()}
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl btn-ruby disabled:opacity-60 text-white text-sm font-bold transition-all whitespace-nowrap shrink-0 shadow-lg cursor-pointer active:scale-98"
          >
            {isSubmitting
              ? 'Sending…'
              : outcome && !outcome.ok && outcome.status !== 'validation_error'
              ? 'Try Sending Again'
              : 'Submit Quote Request'}
          </button>
        </div>
      </div>
    </form>
  );
};
