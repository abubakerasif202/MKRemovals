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
    gst: 'included';
    package: 'unconfirmed';
    minimumHours: '3 hours';
    callOutFee: '1 hour';
  }>;
  enquiryEmail: 'mkremovalsadelaide@gmail.com';
  enquiryEmailHref: 'mailto:mkremovalsadelaide@gmail.com';
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
    logoFull: string;
    logoWordmark: string;
    compactLogoConcept: string;
    badgeConcept: string;
    roundCrestConcept: string;
  };
  photographyAssets: {
    heroTruckCinematic: string;
    heroTruckMobile: string;
    adelaideSkylineTwilight: string;
    professionalWrapping: string;
    apartmentRelocation: string;
    officeRelocation: string;
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
      gst: 'included',
      package: 'unconfirmed',
      minimumHours: '3 hours',
      callOutFee: '1 hour',
    },
    source: 'owner-brief',
    approvalStatus: 'supplied',
    publicationNote:
      'Indicative hourly guidance. Owner confirmed the hourly rate includes GST, with a 3-hour minimum and a 1-hour call-out fee. Truck size, crew allocation and any other charges are confirmed per individual quote.',
  },
  enquiryEmail: 'mkremovalsadelaide@gmail.com',
  enquiryEmailHref: 'mailto:mkremovalsadelaide@gmail.com',
  publicAddress: undefined,
  hours: undefined,
  insurance: {
    value: {
      wording: '$1 million insurance coverage',
      restrictions: 'Policy type and terms not supplied; do not describe beyond the coverage amount.',
    },
    source: 'owner-brief',
    approvalStatus: 'supplied',
    publicationNote: 'Owner stated MRK holds 1M insurance coverage. Publish only as $1 million insurance coverage; do not name a policy type or insurer.',
  },
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
    // Owner-supplied transparent logos: legible directly on the bright page (no dark badge needed).
    fullLogoConcept: '/assets/brand/mrk-logo-horizontal.webp',
    logoFull: '/assets/brand/mrk-logo-circle.webp',
    logoWordmark: '/assets/brand/mrk-logo-horizontal.webp',
    compactLogoConcept: '/assets/brand/mrk-logo-stacked.webp',
    badgeConcept: '/assets/brand/mrk-logo-shield.webp',
    roundCrestConcept: '/assets/brand/mrk-logo-circle.webp',
  },
  photographyAssets: {
    heroTruckCinematic: '/assets/photography/adelaide_moving_day_hero_banner-960.webp',
    heroTruckMobile: '/assets/photography/adelaide_moving_day_hero_mobile-960.webp',
    adelaideSkylineTwilight: '/assets/photography/boulevard_twilight_truck-960.webp',
    professionalWrapping: '/assets/photography/premium_mrk_removals_adelaide_scene-960.webp',
    apartmentRelocation: '/assets/photography/premium_strata_move_in_adelaide-960.webp',
    officeRelocation: '/assets/photography/mrk_s_seamless_adelaide_office_move-960.webp',
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
  return 'Rates include GST. 3-hour minimum plus a 1-hour call-out fee. Final pricing depends on your moving requirements; please confirm inclusions and any other charges.';
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
