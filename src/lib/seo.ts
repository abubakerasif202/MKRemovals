import { mrkBusiness } from '../config/business';
import { MRK_SERVICES, getServiceBySlug } from '../content/services';
import { MRK_SERVICE_AREAS, getServiceAreaBySlug } from '../content/service-areas';
import { MRK_FAQS } from '../content/faqs';

export type RobotsDirective = 'index, follow' | 'noindex, nofollow';

export interface RouteSeoMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: RobotsDirective;
  ogType: 'website' | 'article';
  breadcrumbs: { name: string; path: string }[];
  jsonLd: Record<string, unknown>[];
}

/**
 * Evaluates whether production indexing is currently authorized.
 * Safe preview by default: requires explicit MRK_PRODUCTION_INDEXING=true or VITE_MRK_PRODUCTION_INDEXING=true.
 */
export function isProductionIndexingEnabled(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.MRK_PREVIEW_ONLY === 'true') return false;
    if (process.env.MRK_PRODUCTION_INDEXING === 'true') return true;
    if (process.env.VITE_MRK_PRODUCTION_INDEXING === 'true') return true;
    if (process.env.VERCEL_ENV === 'production') return true;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    if ((import.meta as any).env.VITE_MRK_PREVIEW_ONLY === 'true') return false;
    if ((import.meta as any).env.VITE_MRK_PRODUCTION_INDEXING === 'true') return true;
    if ((import.meta as any).env.MRK_PRODUCTION_INDEXING === 'true') return true;
    if ((import.meta as any).env.VERCEL_ENV === 'production') return true;
  }
  return false;
}

export function buildCanonicalUrl(pathname: string): string {
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
  return `${mrkBusiness.canonicalOrigin}${cleanPath || '/'}`;
}

/**
 * Approved canonical public routes that are eligible for search engine indexing
 * once production indexing is authorized by the business owner.
 */
export const APPROVED_PUBLIC_CANONICAL_PATHS: string[] = [
  '/',
  '/services',
  ...MRK_SERVICES.map((s) => `/services/${s.slug}`),
  '/service-areas',
  ...MRK_SERVICE_AREAS.map((a) => `/service-areas/${a.slug}`),
  '/pricing',
  '/about',
  '/contact',
  '/quote',
  '/faq',
];

/**
 * Unapproved drafts or internal routes that must ALWAYS remain strictly noindex, nofollow.
 */
export const RESTRICTED_NON_INDEXABLE_PATHS: string[] = [
  '/privacy', // Marked as draft for legal review per AGENT.md
  '/terms',   // Marked as draft for legal review per AGENT.md
  '/404',
];

export function isApprovedPublicRoute(cleanPath: string): boolean {
  return APPROVED_PUBLIC_CANONICAL_PATHS.includes(cleanPath);
}

/**
 * Resolves the precise robots directive for any route.
 * Guarantees that draft policies, unknown routes, and preview deployments stay noindex, nofollow.
 */
export function getRobotsDirectiveForRoute(
  cleanPath: string,
  isProductionAuthorized: boolean = isProductionIndexingEnabled()
): RobotsDirective {
  if (
    cleanPath === '/404' ||
    cleanPath.startsWith('/api/') ||
    RESTRICTED_NON_INDEXABLE_PATHS.includes(cleanPath)
  ) {
    return 'noindex, nofollow';
  }

  if (!isApprovedPublicRoute(cleanPath)) {
    return 'noindex, nofollow';
  }

  return isProductionAuthorized ? 'index, follow' : 'noindex, nofollow';
}

export function buildMovingCompanyJsonLd() {
  // Strictly includes only verified/supplied MRK facts per AGENT.md Section 12.
  // Never includes aggregateRating, review, priceRange, or unverified street address.
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    '@id': `${mrkBusiness.canonicalOrigin}/#organization`,
    name: mrkBusiness.brandName,
    url: mrkBusiness.canonicalOrigin,
    telephone: mrkBusiness.phoneInternational,
    email: mrkBusiness.enquiryEmail,
    areaServed: {
      '@type': 'City',
      name: 'Adelaide',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'South Australia',
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: mrkBusiness.phoneInternational,
      email: mrkBusiness.enquiryEmail,
      contactType: 'customer service',
      areaServed: 'AU-SA',
      availableLanguage: ['English'],
    },
  };
}

export function buildBreadcrumbJsonLd(breadcrumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: buildCanonicalUrl(crumb.path),
    })),
  };
}

export function buildFaqPageJsonLd(faqs = MRK_FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${mrkBusiness.canonicalOrigin}/faq#faqpage`,
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Pure helper computing reading progress percentage [0..100] from scroll metrics.
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const scrollableDistance = scrollHeight - clientHeight;
  if (scrollableDistance <= 0) return 0;
  const ratio = (scrollTop / scrollableDistance) * 100;
  return Math.max(0, Math.min(100, Number(ratio.toFixed(2))));
}

export function resolveRouteSeo(
  pathname: string,
  isProductionAuthorized: boolean = isProductionIndexingEnabled()
): RouteSeoMeta {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const baseOrg = buildMovingCompanyJsonLd();
  const robots = getRobotsDirectiveForRoute(cleanPath, isProductionAuthorized);

  if (cleanPath === '/') {
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    return {
      title: 'MRK Removals Adelaide — House, Apartment & Office Movers',
      description:
        'Careful Adelaide removalists for houses, apartments, offices and furniture moves. Indicative hourly rates $130–$135. Request a quote or call 0423 653 342.',
      canonicalUrl: buildCanonicalUrl('/'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/services') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ];
    return {
      title: 'Moving Services in Adelaide | MRK Removals Adelaide',
      description:
        'Explore residential house removals, apartment & strata moves, office relocations, furniture pickups, and packing prep across Adelaide. Call 0423 653 342.',
      canonicalUrl: buildCanonicalUrl('/services'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath.startsWith('/services/')) {
    const slug = cleanPath.replace('/services/', '');
    const service = getServiceBySlug(slug);
    if (service) {
      const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: service.title, path: `/services/${service.slug}` },
      ];
      const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${service.title} — Adelaide`,
        description: service.summary,
        provider: {
          '@id': `${mrkBusiness.canonicalOrigin}/#organization`,
        },
        areaServed: {
          '@type': 'City',
          name: 'Adelaide',
        },
        url: buildCanonicalUrl(`/services/${service.slug}`),
      };
      return {
        title: `${service.title} Adelaide | MRK Removals Adelaide`,
        description: `${service.summary} Request a tailored moving quote or call 0423 653 342.`,
        canonicalUrl: buildCanonicalUrl(`/services/${service.slug}`),
        robots,
        ogType: 'article',
        breadcrumbs,
        jsonLd: [baseOrg, serviceSchema, buildBreadcrumbJsonLd(breadcrumbs)],
      };
    }
  }

  if (cleanPath === '/service-areas') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Adelaide Service Areas', path: '/service-areas' },
    ];
    return {
      title: 'Adelaide Service Areas & Suburb Moving Guide | MRK Removals',
      description:
        'Local Adelaide moving logistics across Central, East, West, North, South, Hills and Coastal suburbs. Practical access, parking and strata planning tips.',
      canonicalUrl: buildCanonicalUrl('/service-areas'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath.startsWith('/service-areas/')) {
    const slug = cleanPath.replace('/service-areas/', '');
    const area = getServiceAreaBySlug(slug);
    if (area) {
      const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Service Areas', path: '/service-areas' },
        { name: area.title, path: `/service-areas/${area.slug}` },
      ];
      return {
        title: `Removalists ${area.title} | MRK Removals Adelaide`,
        description: `${area.summary} Plan access, parking, and moving logistics with MRK Removals Adelaide. Call 0423 653 342.`,
        canonicalUrl: buildCanonicalUrl(`/service-areas/${area.slug}`),
        robots,
        ogType: 'article',
        breadcrumbs,
        jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
      };
    }
  }

  if (cleanPath === '/pricing') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Indicative Pricing', path: '/pricing' },
    ];
    return {
      title: 'Indicative Hourly Rates ($130–$135/hr) | MRK Removals Adelaide',
      description:
        'Transparent indicative hourly rates ($130–$135/hr) and what affects your Adelaide moving quote. Rates include GST. Confirm inclusions, minimums and travel charges.',
      canonicalUrl: buildCanonicalUrl('/pricing'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/about') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'About MRK Removals', path: '/about' },
    ];
    return {
      title: 'About MRK Removals Adelaide | Careful Local Movers',
      description:
        'Learn how MRK Removals Adelaide approaches house, apartment, and office moves with clear communication, careful loading, and practical local planning.',
      canonicalUrl: buildCanonicalUrl('/about'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/contact') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ];
    return {
      title: 'Contact MRK Removals Adelaide | Call 0423 653 342',
      description:
        'Speak directly with MRK Removals Adelaide on 0423 653 342 or submit your moving quote enquiry online for residential, apartment, and office moves.',
      canonicalUrl: buildCanonicalUrl('/contact'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/quote') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Request a Quote', path: '/quote' },
    ];
    return {
      title: 'Request an Adelaide Moving Quote | MRK Removals Adelaide',
      description:
        'Submit your pickup and destination suburbs, inventory, and access details for a tailored Adelaide moving quote from MRK Removals Adelaide.',
      canonicalUrl: buildCanonicalUrl('/quote'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/faq') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'FAQs', path: '/faq' },
    ];
    return {
      title: 'Moving FAQs — Rates, Access & Preparation | MRK Removals Adelaide',
      description:
        'Answers to common Adelaide moving questions including indicative $130–$135/hr rates, apartment lift windows, appliance preparation, and restricted items.',
      canonicalUrl: buildCanonicalUrl('/faq'),
      robots,
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/privacy') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy' },
    ];
    return {
      title: 'Privacy Policy (Draft for Legal Review) | MRK Removals Adelaide',
      description:
        'How MRK Removals Adelaide collects, uses, and safeguards moving quote enquiry information in accordance with Australian Privacy Principles.',
      canonicalUrl: buildCanonicalUrl('/privacy'),
      robots: 'noindex, nofollow', // Strictly restricted draft
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  if (cleanPath === '/terms') {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Terms & Conditions', path: '/terms' },
    ];
    return {
      title: 'Website & Quote Terms (Draft for Legal Review) | MRK Removals Adelaide',
      description:
        'Terms governing website usage, indicative hourly rate guidance ($130–$135/hr), and quote enquiries for MRK Removals Adelaide.',
      canonicalUrl: buildCanonicalUrl('/terms'),
      robots: 'noindex, nofollow', // Strictly restricted draft
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

  // 404 / Unknown route fallback
  return {
    title: 'Page Not Found (404) | MRK Removals Adelaide',
    description: 'The requested page could not be found on MRK Removals Adelaide.',
    canonicalUrl: buildCanonicalUrl(cleanPath),
    robots: 'noindex, nofollow',
    ogType: 'website',
    breadcrumbs: [{ name: 'Home', path: '/' }],
    jsonLd: [baseOrg],
  };
}

/**
 * Returns all approved public indexable canonical paths for sitemap and prerender generation.
 */
export function getAllCanonicalPaths(): string[] {
  return [...APPROVED_PUBLIC_CANONICAL_PATHS];
}

/**
 * Generates XML Sitemap containing strictly approved public canonical indexable routes.
 * Excludes legal drafts, 404 pages, and administrative routes.
 */
export function generateSitemapXml(): string {
  const paths = APPROVED_PUBLIC_CANONICAL_PATHS;
  const urls = paths
    .map((p) => {
      const loc = buildCanonicalUrl(p);
      const priority = p === '/' ? '1.0' : p.startsWith('/services') || p === '/quote' ? '0.9' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

/**
 * Generates robots.txt based on production indexing authorization.
 * In preview mode, crawlers are globally disallowed.
 * In authorized production mode, public routes are allowed while /api/, drafts, and 404s remain restricted.
 */
export function generateRobotsTxt(isProductionAuthorized: boolean = isProductionIndexingEnabled()): string {
  if (!isProductionAuthorized) {
    return [
      '# MRK Removals Adelaide — Preview Robots Configuration',
      '# Safe Preview: Search indexing is paused pending owner sign-off.',
      '# Set MRK_PRODUCTION_INDEXING=true to authorize live production crawling.',
      'User-agent: *',
      'Disallow: /',
    ].join('\n');
  }

  return [
    '# MRK Removals Adelaide — Production Robots Configuration',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /privacy',
    'Disallow: /terms',
    'Disallow: /404',
    `Sitemap: ${mrkBusiness.canonicalOrigin}/sitemap.xml`,
  ].join('\n');
}
