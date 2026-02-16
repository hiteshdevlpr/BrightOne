'use client';

import React from 'react';

/**
 * Derives AVIF path from a portfolio/listing image src.
 * Only for paths under /assets/img/portfolio that end in .jpg or .jpeg.
 */
export function getPortfolioAvifSrc(src: string): string | null {
  if (!src || typeof src !== 'string') return null;
  const n = src.replace(/\.(jpe?g)$/i, '.avif');
  return n !== src ? n : null;
}

export interface PortfolioPictureProps {
  /** JPG (or JPEG) image src — fallback. */
  src: string;
  alt: string;
  /** Optional AVIF src; if omitted, derived from src (replace .jpg with .avif). */
  avifSrc?: string | null;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Renders <picture> with AVIF source and JPG fallback for portfolio/listing images.
 * Use when the image is under /assets/img/portfolio and we have .avif + .jpg.
 */
export function PortfolioPicture({
  src,
  alt,
  avifSrc,
  className,
  style,
  fill,
  sizes,
  width,
  height,
  priority,
}: PortfolioPictureProps) {
  const avif = avifSrc ?? getPortfolioAvifSrc(src);
  const jpgSrc = src;

  if (fill) {
    return (
      <picture className={className} style={{ position: 'absolute', inset: 0, ...style }}>
        {avif && <source type="image/avif" srcSet={avif} />}
        <img
          src={jpgSrc}
          alt={alt}
          className={className}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          sizes={sizes}
          loading={priority ? 'eager' : undefined}
          decoding={priority ? 'sync' : undefined}
        />
      </picture>
    );
  }

  return (
    <picture className={className} style={style}>
      {avif && <source type="image/avif" srcSet={avif} />}
      <img
        src={jpgSrc}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : undefined}
        decoding={priority ? 'sync' : undefined}
      />
    </picture>
  );
}
