export type DateFlexibility = 'exact-date' | 'flexible-3-days' | 'flexible-week' | 'planning-ahead';

export type PropertyAccessType =
  | 'single-storey-house'
  | 'two-storey-house'
  | 'apartment-with-lift'
  | 'apartment-stairs-only'
  | 'townhouse-courtyard'
  | 'office-commercial'
  | 'storage-unit';

export interface QuoteFormInput {
  fullName: string;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'either';
  pickupSuburb: string;
  pickupAccess: PropertyAccessType;
  destinationSuburb: string;
  destinationAccess: PropertyAccessType;
  moveDate: string;
  dateFlexibility: DateFlexibility;
  serviceType: string;
  estimatedSize: string;
  stairsOrLiftDetails?: string;
  parkingDistance?: string;
  packingRequired?: boolean;
  disassemblyRequired?: boolean;
  heavyItemsNotes?: string;
  inventoryNotes?: string;
  sourcePage?: string;
  attemptId?: string;
  honeypotWebsite?: string; // Anti-spam trap; must be empty
}

export interface QuoteValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof QuoteFormInput, string>>;
  sanitized?: QuoteFormInput;
  isSpam?: boolean;
}

const AU_PHONE_REGEX = /^(?:\+?61\s?[23478](?:[\s-]?\d){8}|0[23478](?:[\s-]?\d){8})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidAustralianPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  return AU_PHONE_REGEX.test(trimmed);
}

export function isValidEmailAddress(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
}

export function validateQuoteSubmission(raw: Partial<QuoteFormInput>): QuoteValidationResult {
  const errors: Partial<Record<keyof QuoteFormInput, string>> = {};

  // Anti-spam honeypot check
  if (raw.honeypotWebsite && String(raw.honeypotWebsite).trim().length > 0) {
    return {
      valid: false,
      isSpam: true,
      errors: { fullName: 'Automated submission rejected.' },
    };
  }

  const fullName = sanitizeText(raw.fullName, 120);
  const phone = sanitizeText(raw.phone, 32);
  const email = sanitizeText(raw.email, 160);
  const preferredContact =
    raw.preferredContact === 'phone' || raw.preferredContact === 'email' || raw.preferredContact === 'either'
      ? raw.preferredContact
      : 'either';
  const pickupSuburb = sanitizeText(raw.pickupSuburb, 120);
  const destinationSuburb = sanitizeText(raw.destinationSuburb, 120);
  const moveDate = sanitizeText(raw.moveDate, 40);
  const dateFlexibility: DateFlexibility =
    raw.dateFlexibility === 'exact-date' ||
    raw.dateFlexibility === 'flexible-3-days' ||
    raw.dateFlexibility === 'flexible-week' ||
    raw.dateFlexibility === 'planning-ahead'
      ? raw.dateFlexibility
      : 'flexible-3-days';

  const serviceType = sanitizeText(raw.serviceType || 'house-removals', 80);
  const estimatedSize = sanitizeText(raw.estimatedSize || 'Not specified', 80);

  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  if (!phone) {
    errors.phone = 'Please provide an Australian mobile or landline number so we can discuss your quote.';
  } else if (!isValidAustralianPhone(phone)) {
    errors.phone = 'Enter a valid Australian phone number (e.g. 0423 653 342 or +61 423 653 342).';
  }

  if (email && !isValidEmailAddress(email)) {
    errors.email = 'Please enter a valid email address (e.g. name@domain.com.au).';
  } else if (preferredContact === 'email' && !email) {
    errors.email = 'An email address is required when Email is selected as your preferred contact method.';
  }

  if (!pickupSuburb || pickupSuburb.length < 2) {
    errors.pickupSuburb = 'Please enter your pickup suburb or postcode in Adelaide.';
  }

  if (!destinationSuburb || destinationSuburb.length < 2) {
    errors.destinationSuburb = 'Please enter your destination suburb or postcode.';
  }

  if (!moveDate && dateFlexibility !== 'planning-ahead') {
    errors.moveDate = 'Please select your target moving date or choose "Planning ahead / Unsure of date".';
  }

  const sanitized: QuoteFormInput = {
    fullName,
    phone,
    email,
    preferredContact,
    pickupSuburb,
    pickupAccess: raw.pickupAccess || 'single-storey-house',
    destinationSuburb,
    destinationAccess: raw.destinationAccess || 'single-storey-house',
    moveDate,
    dateFlexibility,
    serviceType,
    estimatedSize,
    stairsOrLiftDetails: sanitizeText(raw.stairsOrLiftDetails, 300),
    parkingDistance: sanitizeText(raw.parkingDistance, 160),
    packingRequired: Boolean(raw.packingRequired),
    disassemblyRequired: Boolean(raw.disassemblyRequired),
    heavyItemsNotes: sanitizeText(raw.heavyItemsNotes, 400),
    inventoryNotes: sanitizeText(raw.inventoryNotes, 1200),
    sourcePage: sanitizeText(raw.sourcePage || '/', 160),
    attemptId: sanitizeText(raw.attemptId || '', 80),
    honeypotWebsite: '',
  };

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export function formatMoveBriefText(data: QuoteFormInput): string {
  const lines = [
    `MRK REMOVALS ADELAIDE — MOVE QUOTE BRIEF`,
    `----------------------------------------`,
    `Customer: ${data.fullName}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Preferred Contact: ${data.preferredContact}`,
    `Service: ${data.serviceType} (${data.estimatedSize})`,
    `Pickup: ${data.pickupSuburb} (${data.pickupAccess.replace(/-/g, ' ')})`,
    `Destination: ${data.destinationSuburb} (${data.destinationAccess.replace(/-/g, ' ')})`,
    `Target Date: ${data.moveDate || 'Flexible / Planning ahead'} (${data.dateFlexibility.replace(/-/g, ' ')})`,
    data.parkingDistance ? `Parking / Carry Distance: ${data.parkingDistance}` : null,
    data.stairsOrLiftDetails ? `Stairs / Lift Access: ${data.stairsOrLiftDetails}` : null,
    `Packing Assistance Requested: ${data.packingRequired ? 'Yes' : 'No'}`,
    `Furniture Disassembly Requested: ${data.disassemblyRequired ? 'Yes' : 'No'}`,
    data.heavyItemsNotes ? `Heavy / Bulky Items: ${data.heavyItemsNotes}` : null,
    data.inventoryNotes ? `Inventory & Notes: ${data.inventoryNotes}` : null,
    `----------------------------------------`,
    `Direct MRK Phone: 0423 653 342`,
    `Indicative Rate Note: AUD $130–$135/hr (includes GST; 3-hour minimum plus 1-hour call-out fee; inclusions confirmed in quote)`,
  ].filter(Boolean);

  return lines.join('\n');
}
