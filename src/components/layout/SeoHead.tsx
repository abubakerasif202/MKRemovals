import React, { useEffect } from 'react';
import { resolveRouteSeo } from '../../lib/seo';

interface SeoHeadProps {
  pathname: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ pathname }) => {
  const seo = resolveRouteSeo(pathname);

  useEffect(() => {
    document.title = seo.title;

    const updateMeta = (selector: string, attr: 'content' | 'href', value: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attr, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', seo.description);
    updateMeta('meta[name="robots"]', 'content', seo.robots);
    updateMeta('link[rel="canonical"]', 'href', seo.canonicalUrl);
    updateMeta('meta[property="og:title"]', 'content', seo.title);
    updateMeta('meta[property="og:description"]', 'content', seo.description);
    updateMeta('meta[property="og:url"]', 'content', seo.canonicalUrl);
    updateMeta('meta[property="og:type"]', 'content', seo.ogType);
    updateMeta('meta[name="twitter:title"]', 'content', seo.title);
    updateMeta('meta[name="twitter:description"]', 'content', seo.description);
  }, [seo]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
    />
  );
};
