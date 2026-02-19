'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '@/plugins';
import FooterFour from '@/layouts/footers/footer-four';
import { fadeAnimation } from '@/utils/title-animation';
import { PortfolioPicture } from '@/components/portfolio-picture';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WORK_IMG_BASE = '/assets/img/work';
// Use .jpg (compress script outputs JPG + AVIF; PNG sources were converted to .jpg)
const workImageFiles = [
  'brightone-work1.jpg', 'brightone-work2.jpg', 'brightone-work3.jpg', 'brightone-work4.jpg',
  'brightone-work5.jpg', 'brightone-work6.jpg', 'brightone-work7.jpg', 'brightone-work8.jpg',
  'brightone-work9.jpg', 'brightone-work10.jpg', 'brightone-work11.jpg', 'brightone-work12.jpg',
  'brightone-work13.jpg', 'brightone-work14.jpg', 'brightone-work15.jpg',
  'brightone-work17.jpg', 'brightone-work18.jpg', 'brightone-work19.jpg', 'brightone-work20.jpg',
  'brightone-work21.jpg', 'brightone-work22.jpg', 'brightone-work23.jpg', 'brightone-work24.jpg',
];
const galleryImages = workImageFiles.map((file, i) => ({
  src: `${WORK_IMG_BASE}/${file}`,
  alt: `Work sample ${i + 1}`,
}));

// First N gallery images load immediately (above-the-fold); rest use IntersectionObserver lazy load
const PRIORITY_GALLERY_COUNT = 8;
// Low-res placeholder so grid doesn’t jump; neutral dark gray
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8B/9k=';

/**
 * Lazy-loads the image when the container scrolls into view (same pattern as homepage counter / portfolio).
 * Priority items (e.g. first 8) load immediately; others mount the image only after intersecting.
 */
function LazyWorkImage({
  src,
  alt,
  priority,
  blurDataURL,
}: {
  src: string;
  alt: string;
  priority: boolean;
  blurDataURL: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    if (priority) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { root: null, rootMargin: '100px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      {inView ? (
        <PortfolioPicture
          src={src}
          alt={alt}
          fill
          useAvif={false}
          sizes="(max-width: 576px) 50vw, (max-width: 768px) 34vw, (max-width: 992px) 26vw, 25vw"
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#1a1a1a',
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

function youtubeVideoId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function youtubeEmbedUrl(url: string, autoplay = false): string {
  const id = youtubeVideoId(url);
  if (!id) return url;
  const params = new URLSearchParams({ modestbranding: '1', rel: '0' });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function youtubeThumbUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/** Shows thumbnail + play button until click, then embedded iframe (no YouTube API required) */
function WorkVideoBlock({ url, title, className }: { url: string; title: string; className: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = youtubeVideoId(url);

  if (!videoId) return <div className={className} />;
  if (playing) {
    const embedSrc = youtubeEmbedUrl(url, true);
    return (
      <div className={className}>
        <div className="work-video-iframe-wrap">
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
          />
        </div>
        <span className="work-video-title-mask" aria-hidden />
      </div>
    );
  }
  return (
    <button
      type="button"
      className={`${className} work-video-poster`}
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
    >
      <img
        src={youtubeThumbUrl(videoId)}
        alt=""
        className="work-video-poster-img"
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.includes('hqdefault')) t.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <span className="work-video-play-btn" aria-hidden />
    </button>
  );
}

const LISTING_VIDEOS = [
  'https://youtu.be/4Btc-0rRAnw',
  'https://youtu.be/YpQoC9xgUF4',
];

const AGENT_SOCIAL_VIDEOS = [
  'https://youtube.com/shorts/2Ke4KKSewbE?feature=share',
  'https://youtube.com/shorts/dQRjKv12_3w?feature=share',
  'https://youtube.com/shorts/i184CmdH8QU?feature=share'
];

const AGENT_LOCATION_VIDEOS = [
  'https://youtube.com/shorts/q2tFXANqokk?feature=share',
  'https://youtube.com/shorts/bOXYWuLXBzY?feature=share',
  'https://youtube.com/shorts/kfIH9sAnmao?feature=share',
];

export default function WorkPageClient() {
  // Native scroll only (no ScrollSmoother) to avoid jitter from smooth scroll + many ScrollTriggers + lazy images
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Same as homepage: GSAP ScrollTrigger fades in sections when they scroll into view
  useGSAP(() => {
    const timer = setTimeout(() => fadeAnimation(), 100);
    return () => clearTimeout(timer);
  });

  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);
  const goPrev = () =>
    setPreviewIndex((i) => (i === null ? null : i === 0 ? galleryImages.length - 1 : i - 1));
  const goNext = () =>
    setPreviewIndex((i) => (i === null ? null : i === galleryImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="inner-bg" style={{ backgroundImage: 'url(/assets/img/home-01/team/team-details-bg.png)' }}>
            <main className="work-page-main">
              {/* Hero */}
              <section className="work-hero tm-hero-area tm-hero-ptb p-relative">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tm-hero-content">
                        <span className="tm-hero-subtitle tp_fade_left">BrightOne Creative</span>
                        <h1 className="tm-hero-title-big work-hero-title tp_fade_bottom">
                          Our Work
                        </h1>
                        <p className="text-white-50 mt-3 mb-0 tp_fade_bottom" style={{ fontSize: '1.15rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
                          Real estate photography, listing shoots, agent content, and location shoots.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Photos gallery */}
              <section className="work-section work-gallery">
                <div className="container-fluid">
                  <h2 className="work-section-title tp_fade_bottom">Photos</h2>
                  <div className="work-gallery-grid tp_fade_bottom">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className="work-gallery-item"
                        onClick={() => openPreview(index)}
                        aria-label={`View ${img.alt}`}
                      >
                        <LazyWorkImage
                          src={img.src}
                          alt={img.alt}
                          priority={index < PRIORITY_GALLERY_COUNT}
                          blurDataURL={BLUR_DATA_URL}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Listing Shoots - 2 videos 50% width */}
              <section className="work-section work-section-alt">
                <div className="container-fluid">
                  <h2 className="work-section-title tp_fade_bottom">Listing Shoots</h2>
                  <div className="row g-4 tp_fade_bottom">
                    {LISTING_VIDEOS.map((url, i) => (
                      <div key={i} className="col-md-6">
                        <WorkVideoBlock url={url} title={`Listing shoot ${i + 1}`} className="work-video-wrap" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Agent Social Media - 3 vertical videos */}
              <section className="work-section">
                <div className="container-fluid">
                  <h2 className="work-section-title tp_fade_bottom">Agent Social Media Content</h2>
                  <div className="row g-4 work-vertical-videos-row justify-content-center tp_fade_bottom">
                    {AGENT_SOCIAL_VIDEOS.map((url, i) => (
                      <div key={i} className="col-sm-6 col-lg-4">
                        <WorkVideoBlock url={url} title={`Agent social ${i + 1}`} className="work-video-vertical" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Agent Location Shoot - 2 vertical videos */}
              <section className="work-section work-section-alt">
                <div className="container-fluid">
                  <h2 className="work-section-title tp_fade_bottom">Vertical Location Shoots</h2>
                  <div className="row g-4 work-vertical-videos-row justify-content-center tp_fade_bottom">
                    {AGENT_LOCATION_VIDEOS.map((url, i) => (
                      <div key={i} className="col-sm-6 col-md-5 col-lg-4">
                        <WorkVideoBlock url={url} title={`Agent location ${i + 1}`} className="work-video-vertical" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="container-fluid py-5 text-center tp_fade_bottom">
                <Link className="tp-btn-black-2" href="/contact">
                  Get in touch
                  <span className="p-relative ms-2">→</span>
                </Link>
              </div>
            </main>
          </div>
          <FooterFour />
        </div>
      </div>

      {/* Gallery preview overlay */}
      {previewIndex !== null && galleryImages[previewIndex] && (
        <div className="listing-modal-backdrop" onClick={closePreview}>
          <div className="listing-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closePreview}
              className="btn btn-link position-absolute text-white p-3 z-1"
              style={{ top: '1rem', right: '1rem' }}
              aria-label="Close"
            >
              <span style={{ fontSize: '2rem' }}>&times;</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="btn btn-dark position-absolute start-0 z-1 rounded-circle p-3"
              style={{ left: '1rem' }}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="btn btn-dark position-absolute end-0 z-1 rounded-circle p-3"
              style={{ right: '1rem' }}
              aria-label="Next"
            >
              ›
            </button>
            <div className="position-relative" style={{ maxWidth: '75rem', maxHeight: '90vh', width: '100%' }}>
              <Image
                src={galleryImages[previewIndex].src}
                alt={galleryImages[previewIndex].alt}
                width={1200}
                height={800}
                className="img-fluid"
                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                priority
                quality={90}
              />
            </div>
            <div className="position-absolute bottom-0 start-50 translate-middle-x text-white small pb-3 z-1">
              {previewIndex + 1} of {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
