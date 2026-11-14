import React from 'react';

/** Builds a width-descriptor srcset from a `<name>-960.webp` asset path (640 / 960 / 1376 variants exist). */
export function photoSrcSet(src: string): string | undefined {
  if (!src.endsWith('-960.webp')) return undefined;
  const base = src.replace(/-960\.webp$/, '');
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${base}-1376.webp 1376w, ${base}-1920.webp 1920w`;
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  /** Set only for the single above-the-fold LCP image. Everything else is lazy-loaded. */
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  className = '',
  width = 1376,
  height = 768,
}) => (
  <img
    src={src}
    srcSet={photoSrcSet(src)}
    sizes={sizes}
    alt={alt}
    width={width}
    height={height}
    loading={priority ? 'eager' : 'lazy'}
    decoding={priority ? 'sync' : 'async'}
    {...(priority ? { fetchPriority: 'high' as const } : {})}
    className={className}
  />
);
