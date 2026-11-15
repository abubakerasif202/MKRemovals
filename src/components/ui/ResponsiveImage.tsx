import React from 'react';

/** Builds a width-descriptor srcset from a standard `<base>-960.webp` asset path. */
export function photoSrcSet(src: string, ext = 'webp'): string | undefined {
  if (!src.includes('-960.')) return undefined;
  const base = src.replace(/-\d+\.(webp|avif|jpg|png)$/, '');
  return `${base}-640.${ext} 640w, ${base}-960.${ext} 960w, ${base}-1376.${ext} 1376w, ${base}-1920.${ext} 1920w`;
}

/** Builds mobile-optimised srcset for dedicated mobile art-directed crops. */
export function mobilePhotoSrcSet(src: string, ext = 'webp'): string | undefined {
  if (!src.includes('-960.')) return undefined;
  const base = src.replace(/-\d+\.(webp|avif|jpg|png)$/, '');
  return `${base}-420.${ext} 420w, ${base}-640.${ext} 640w, ${base}-960.${ext} 960w, ${base}-1152.${ext} 1152w`;
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  mobileSrc?: string;
  mobileSizes?: string;
  sizes?: string;
  /** Set only for the single above-the-fold LCP image. Everything else is lazy-loaded. */
  priority?: boolean;
  className?: string;
  pictureClassName?: string;
  width?: number;
  height?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  mobileSrc,
  mobileSizes = '100vw',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  className = '',
  pictureClassName = '',
  width = 1376,
  height = 768,
}) => {
  const avifSet = photoSrcSet(src, 'avif');
  const webpSet = photoSrcSet(src, 'webp');
  const mobileAvifSet = mobileSrc ? mobilePhotoSrcSet(mobileSrc, 'avif') : undefined;
  const mobileWebpSet = mobileSrc ? mobilePhotoSrcSet(mobileSrc, 'webp') : undefined;

  return (
    <picture className={pictureClassName}>
      {mobileSrc && mobileAvifSet && (
        <source
          media="(max-width: 767px)"
          type="image/avif"
          srcSet={mobileAvifSet}
          sizes={mobileSizes}
        />
      )}
      {mobileSrc && mobileWebpSet && (
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcSet={mobileWebpSet}
          sizes={mobileSizes}
        />
      )}
      {avifSet && (
        <source
          type="image/avif"
          srcSet={avifSet}
          sizes={sizes}
        />
      )}
      {webpSet && (
        <source
          type="image/webp"
          srcSet={webpSet}
          sizes={sizes}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={className}
      />
    </picture>
  );
};
