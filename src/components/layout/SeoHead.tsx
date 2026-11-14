import React, { useEffect } from 'react';
import { resolveRouteSeo } from '../../lib/seo';

interface SeoHeadProps {
  pathname: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ pathname }) => {
  const seo = resolveRouteSeo(pathname);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = seo.title;

    const setOrCreateMeta = (attrName: string, attrValue: string, contentValue: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    const setOrCreateCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    setOrCreateMeta('name', 'description', seo.description);
    setOrCreateMeta('name', 'robots', seo.robots);
    setOrCreateCanonical(seo.canonicalUrl);
    setOrCreateMeta('property', 'og:title', seo.title);
    setOrCreateMeta('property', 'og:description', seo.description);
    setOrCreateMeta('property', 'og:url', seo.canonicalUrl);
    setOrCreateMeta('property', 'og:type', seo.ogType);
    setOrCreateMeta('name', 'twitter:title', seo.title);
    setOrCreateMeta('name', 'twitter:description', seo.description);
  }, [seo]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
    />
  );
};
