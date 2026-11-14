import { mrkBusiness } from '../config/business';
import { MRK_SERVICES, getServiceBySlug } from '../content/services';
import { MRK_SERVICE_AREAS, getServiceAreaBySlug } from '../content/service-areas';
import { MRK_FAQS } from '../content/faqs';

export interface RouteSeoMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'article';
  breadcrumbs: { name: string; path: string }[];
  jsonLd: Record<string, unknown>[];
}

export function buildCanonicalUrl(pathname: string): string {
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
  return `${mrkBusiness.canonicalOrigin}${cleanPath || '/'}`;
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

export function resolveRouteSeo(pathname: string): RouteSeoMeta {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const baseOrg = buildMovingCompanyJsonLd();

  if (cleanPath === '/') {
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    return {
      title: 'MRK Removals Adelaide — House, Apartment & Office Movers',
      description:
        'Careful Adelaide removalists for houses, apartments, offices and furniture moves. Indicative hourly rates $130–$135. Request a quote or call 0423 653 342.',
      canonicalUrl: buildCanonicalUrl('/'),
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
        robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
        robots: 'noindex, nofollow',
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
        'Transparent indicative hourly rates ($130–$135/hr) and what affects your Adelaide moving quote. Confirm inclusions, minimums, travel charges and GST.',
      canonicalUrl: buildCanonicalUrl('/pricing'),
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
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
      robots: 'noindex, nofollow',
      ogType: 'website',
      breadcrumbs,
      jsonLd: [baseOrg, buildBreadcrumbJsonLd(breadcrumbs)],
    };
  }

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

export function getAllCanonicalPaths(): string[] {
  const staticPaths = [
    '/',
    '/services',
    '/service-areas',
    '/pricing',
    '/about',
    '/contact',
    '/quote',
    '/faq',
    '/privacy',
    '/terms',
  ];
  const servicePaths = MRK_SERVICES.map((s) => `/services/${s.slug}`);
  const areaPaths = MRK_SERVICE_AREAS.map((a) => `/service-areas/${a.slug}`);
  return [...staticPaths, ...servicePaths, ...areaPaths];
}

export function generateSitemapXml(): string {
  const paths = getAllCanonicalPaths();
  const urls = paths
    .map((p) => {
      const loc = buildCanonicalUrl(p);
      const priority = p === '/' ? '1.0' : p.startsWith('/services') || p === '/quote' ? '0.9' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function generateRobotsTxt(isProductionAuthorized = false): string {
  if (!isProductionAuthorized) {
    // Per AGENT.md Section 3.4 & 12: Keep preview safe from premature search indexing until owner authorizes live launch
    return [
      '# MRK Removals Adelaide — Preview Robots Configuration',
      '# Set MRK_PRODUCTION_INDEXING=true after domain verification & owner sign-off.',
      'User-agent: *',
      'Disallow: /api/',
      `Sitemap: ${mrkBusiness.canonicalOrigin}/sitemap.xml`,
    ].join('\n');
  }
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Sitemap: ${mrkBusiness.canonicalOrigin}/sitemap.xml`,
  ].join('\n');
}
