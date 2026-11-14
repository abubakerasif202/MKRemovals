export type EvidenceSource =
  | 'owner-brief'
  | 'public-register'
  | 'owner-approved-record'
  | 'verified-provider';

export type ApprovalStatus = 'supplied' | 'verified' | 'approved';

export type EvidenceValue<T> = {
  value: T;
  source: EvidenceSource;
  verifiedAt?: string;
  approvalStatus: ApprovalStatus;
  publicationNote: string;
};

export type MRKBusinessConfig = {
  brandName: 'MRK Removals Adelaide';
  shortName: 'MRK Removals';
  domain: 'mrkremovalsadelaide.com.au';
  canonicalOrigin: 'https://mrkremovalsadelaide.com.au';
  locationLabel: 'Adelaide, South Australia';
  timezone: 'Australia/Adelaide';
  ownerContactName: EvidenceValue<'Mubashar Riaz'>;
  phoneDisplay: '0423 653 342';
  phoneInternational: '+61 423 653 342';
  phoneHref: 'tel:+61423653342';
  abn: EvidenceValue<'95 685 822 473'>;
  indicativeHourlyAUD: EvidenceValue<{
    min: 130;
    max: 135;
    currency: 'AUD';
    unit: 'hour';
    gst: 'unconfirmed';
    package: 'unconfirmed';
    minimumHours: 'unconfirmed';
    callOutFee: 'unconfirmed';
  }>;
  enquiryEmail?: string;
  publicAddress?: EvidenceValue<string>;
  hours?: EvidenceValue<string>;
  insurance?: EvidenceValue<{ wording: string; restrictions: string }>;
  reviews?: EvidenceValue<{ rating: number; count: number; url: string }>;
  approvedServiceIds: string[];
  bookingMode: 'quote-only' | 'verified-booking';
  creativeAgency: {
    name: 'AB Web Studio';
    role: 'Brand Architecture, UI/UX & Digital Engineering';
  };
  brandAssets: {
    fullLogoConcept: string;
    compactLogoConcept: string;
    badgeConcept: string;
    roundCrestConcept: string;
  };
};

export const mrkBusiness: MRKBusinessConfig = {
  brandName: 'MRK Removals Adelaide',
  shortName: 'MRK Removals',
  domain: 'mrkremovalsadelaide.com.au',
  canonicalOrigin: 'https://mrkremovalsadelaide.com.au',
  locationLabel: 'Adelaide, South Australia',
  timezone: 'Australia/Adelaide',
  ownerContactName: {
    value: 'Mubashar Riaz',
    source: 'owner-brief',
    approvalStatus: 'supplied',
    publicationNote: 'Owner and primary contact supplied in MRK brief; do not invent additional staff titles.',
  },
  phoneDisplay: '0423 653 342',
  phoneInternational: '+61 423 653 342',
  phoneHref: 'tel:+61423653342',
  abn: {
    value: '95 685 822 473',
    source: 'owner-brief',
    approvalStatus: 'supplied',
    publicationNote:
      'Owner-supplied ABN (valid 11-digit checksum); independent ABR entity name/status match pending owner confirmation before asserting registry verification.',
  },
  indicativeHourlyAUD: {
    value: {
      min: 130,
      max: 135,
      currency: 'AUD',
      unit: 'hour',
      gst: 'unconfirmed',
      package: 'unconfirmed',
      minimumHours: 'unconfirmed',
      callOutFee: 'unconfirmed',
    },
    source: 'owner-brief',
    approvalStatus: 'supplied',
    publicationNote:
      'Indicative hourly guidance only. Truck size, crew allocation, GST treatment, minimum booking hours, and travel/access charges are confirmed per individual quote.',
  },
  enquiryEmail: undefined,
  publicAddress: undefined,
  hours: undefined,
  insurance: undefined,
  reviews: undefined,
  approvedServiceIds: [
    'house-removals',
    'apartment-strata-moves',
    'office-commercial-relocations',
    'furniture-single-item-moves',
    'packing-move-preparation',
    'heavy-bulky-item-moves',
  ],
  bookingMode: 'quote-only',
  creativeAgency: {
    name: 'AB Web Studio',
    role: 'Brand Architecture, UI/UX & Digital Engineering',
  },
  brandAssets: {
    fullLogoConcept: '/assets/aistudio/ruby_platinum_full_logo_concept_42543a71.png',
    compactLogoConcept: '/assets/aistudio/ruby_platinum_compact_logo_concept_cacda257.png',
    badgeConcept: '/assets/aistudio/ruby_platinum_badge_concept_6a6760d6.png',
    roundCrestConcept: '/assets/aistudio/ruby_platinum_round_crest_concept_ff67e362.png',
  },
};

/**
 * Validates Australian Business Number (ABN) 11-digit mathematical checksum (ATO algorithm).
 * Note: Mathematical validity confirms format, not independent ABR entity registration status.
 */
export function isValidAbnFormat(rawAbn: string): boolean {
  const digits = rawAbn.replace(/\s+/g, '');
  if (!/^\d{11}$/.test(digits)) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const nums = digits.split('').map(Number);
  nums[0] = nums[0] - 1;
  const sum = nums.reduce((acc, digit, idx) => acc + digit * weights[idx], 0);
  return sum % 89 === 0;
}

export function formatIndicativeRateHeadline(): string {
  const { min, max } = mrkBusiness.indicativeHourlyAUD.value;
  return `Indicative hourly rates: $${min}–$${max}. Request a quote for your move.`;
}

export function getMandatoryRateDisclaimer(): string {
  return 'Final pricing depends on your moving requirements; please confirm inclusions, minimums, travel charges and GST.';
}

export type NavItem = {
  label: string;
  path: string;
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Services', path: '/services' },
  { label: 'Service Areas', path: '/service-areas' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services Overview', path: '/services' },
  { label: 'Adelaide Service Areas', path: '/service-areas' },
  { label: 'Indicative Pricing', path: '/pricing' },
  { label: 'About MRK Removals', path: '/about' },
  { label: 'Frequently Asked Questions', path: '/faq' },
  { label: 'Request a Quote', path: '/quote' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms & Conditions', path: '/terms' },
];
