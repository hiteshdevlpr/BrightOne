'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PortfolioPicture } from '@/components/portfolio-picture';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from '@/plugins';
import { charAnimation } from '@/utils/title-animation';
import FooterFour from '@/layouts/footers/footer-four';
import { ListingData } from '@/lib/listing-data';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface EnhancedListingPageClientProps {
  listing: ListingData;
  googleMapsApiKey?: string;
}

export default function EnhancedListingPageClient({ listing, googleMapsApiKey }: EnhancedListingPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useGSAP(() => {
    const timer = setTimeout(() => charAnimation(), 100);
    return () => clearTimeout(timer);
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const hasFloorPlans = (listing.floorPlans && listing.floorPlans.length > 0) || !!listing.floorPlanUrl;
  const hasVirtualTour = !!listing.virtualTourEmbedUrl;

  useEffect(() => {
    const handleScroll = () => {
      const is13151 = listing.id === '13151-lakeridge-road';
      const afterGallery = hasVirtualTour ? ['virtual-tour'] : [];
      const sections = hasFloorPlans
        ? is13151
          ? ['hero', 'videos', 'gallery', ...afterGallery, 'floor-plans', 'location']
          : ['hero', 'gallery', ...afterGallery, 'videos', 'floor-plans', 'location']
        : is13151
          ? ['hero', 'videos', 'gallery', ...afterGallery, 'location']
          : ['hero', 'gallery', ...afterGallery, 'videos', 'location'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasFloorPlans, hasVirtualTour, listing.id]);

  const images = listing.images ?? [];
  const openModal = (index: number) => { if (images.length) { setCurrentImageIndex(index); setIsModalOpen(true); } };
  const closeModal = () => setIsModalOpen(false);
  const goToPrevious = () => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  const goToNext = () => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);

  const is13151 = listing.id === '13151-lakeridge-road';
  const hasHighlights = (listing.highlights?.length ?? 0) > 0;
  const highlightBullets = hasHighlights ? listing.highlights! : (is13151 ? ['Many forested trails for many activities.', 'Excellent Privacy throughout.', 'Very low taxes.', 'Low operating costs for the utilities.', 'Many upgrades throughout.', '2 min to Lakeridge ski hill.', '10 min to 407.'] : []);
  const showHighlightsBox = highlightBullets.length > 0;
  const virtualTourNav = hasVirtualTour ? [{ id: 'virtual-tour' as const, label: '3D Virtual Tour' }] : [];
  const navItems = is13151
    ? [
        { id: 'hero', label: 'Overview' },
        { id: 'videos', label: 'Videos' },
        { id: 'gallery', label: 'Gallery' },
        ...virtualTourNav,
        ...(hasFloorPlans ? [{ id: 'floor-plans' as const, label: 'Floor Plans' }] : []),
        { id: 'location', label: 'Location' },
      ]
    : [
        { id: 'hero', label: 'Overview' },
        { id: 'gallery', label: 'Gallery' },
        ...virtualTourNav,
        { id: 'videos', label: 'Videos' },
        ...(hasFloorPlans ? [{ id: 'floor-plans' as const, label: 'Floor Plans' }] : []),
        { id: 'location', label: 'Location' },
      ];

  return (
    <div className="listing-page">
      <nav className="listing-nav">
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap py-3" style={{ gap: '0.5rem 2rem' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="btn btn-link p-0 text-decoration-none border-0 rounded-0 bg-transparent"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: activeSection === item.id ? 600 : 400,
                  color: activeSection === item.id ? '#0d6efd' : '#6c757d',
                  borderBottom: activeSection === item.id ? '2px solid #0d6efd' : '2px solid transparent',
                  paddingBottom: '0.25rem',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <section id="hero" className="listing-hero scroll-mt-nav">
          <div className="listing-hero-bg">
            <PortfolioPicture
              src={images[0]?.src ?? '/meta-header.png'}
              alt={images[0]?.alt ?? listing.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="listing-hero-overlay" />
          </div>
          <div className="listing-hero-content">
            <div className="container">
              <div className={`row align-items-center ${showHighlightsBox ? 'row-cols-1 row-cols-lg-2' : ''} g-4`} style={{ maxWidth: '80rem', margin: '0 auto' }}>
                <div className="col">
                  <h1 className="tp-char-animation text-white mb-4" style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.2 }}>
                    {listing.title}
                  </h1>
                  <p className="text-white mb-4" style={{ fontSize: '1.25rem', opacity: 0.9 }}>{listing.address}</p>
                  {!showHighlightsBox && (
                    <div className="d-flex flex-wrap gap-3 text-white" style={{ fontSize: '1.25rem' }}>
                      <span>{listing.bedrooms} bed</span>
                      <span>{listing.bathrooms} bath</span>
                      {listing.squareFootage > 0 && <span>{listing.squareFootage.toLocaleString()} sq ft</span>}
                    </div>
                  )}
                  {showHighlightsBox && (listing.bedrooms > 0 || listing.bathrooms > 0 || listing.squareFootage > 0) && (
                    <div className="d-flex flex-wrap gap-3 text-white mb-3" style={{ fontSize: '1.25rem' }}>
                      {listing.bedrooms > 0 && <span>{listing.bedrooms} bed</span>}
                      {listing.bathrooms > 0 && <span>{listing.bathrooms} bath</span>}
                      {listing.squareFootage > 0 && <span>{listing.squareFootage.toLocaleString()} sq ft</span>}
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => scrollToSection(is13151 ? 'videos' : 'gallery')}
                      className="btn btn-primary btn-lg"
                    >
                      {is13151 ? 'View Video' : 'View Gallery'}
                    </button>
                  </div>
                </div>
                {showHighlightsBox && (
                  <div className="col">
                    <div className="listing-highlights-box text-white">
                      <h2 className="tp-char-animation mb-4 text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Highlights of the Property</h2>
                      <ul className="list-unstyled mb-0" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                        {highlightBullets.map((text, i) => (
                          <li key={i} className="d-flex align-items-start mb-2">
                            <span className="me-2" style={{ color: '#93c5fd' }}>•</span>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {is13151 && (
          <section id="videos" className="listing-section scroll-mt-nav">
            <div className="container">
              <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <h3 className="tp-char-animation text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>Property Walkthrough</h3>
                <div className="listing-aspect-video">
                  {listing.walkthroughVideoUrl ? (
                    <iframe src={listing.walkthroughVideoUrl} title="Property Walkthrough" allowFullScreen />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-secondary text-white" style={{ position: 'absolute', inset: 0 }}>
                      Video coming soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="gallery" className="listing-section listing-section-alt scroll-mt-nav">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="tp-char-animation mb-3" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>Property Gallery</h2>
              <p className="mb-0" style={{ fontSize: '1.25rem', color: '#6c757d', maxWidth: '48rem', margin: '0 auto' }}>
                Explore every corner of this beautiful property through our professional photography
              </p>
            </div>
            <div className="listing-gallery-grid">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div
                    key={index}
                    className="listing-gallery-item"
                    onClick={() => openModal(index)}
                    onKeyDown={(e) => e.key === 'Enter' && openModal(index)}
                    role="button"
                    tabIndex={0}
                  >
                    <PortfolioPicture
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 992px) 33vw, 25vw"
                    />
                  </div>
                ))
              ) : (
                <div className="py-5 text-center" style={{ gridColumn: '1 / -1', color: '#6c757d' }}>No images available</div>
              )}
            </div>
          </div>
        </section>

        {listing.virtualTourEmbedUrl && (
          <section id="virtual-tour" className="listing-section scroll-mt-nav">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="tp-char-animation mb-3" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>3D Virtual Tour</h2>
                <p className="mb-0" style={{ fontSize: '1.25rem', color: '#6c757d', maxWidth: '48rem', margin: '0 auto' }}>
                  Explore this property in 3D — walk through every room at your own pace
                </p>
              </div>
              <div
                className="listing-virtual-tour-wrap"
                style={{ display: 'block', position: 'relative', padding: '0 0 57% 0', overflow: 'hidden', height: 0, width: '100%', borderRadius: '0.5rem' }}
              >
                <iframe
                  src={listing.virtualTourEmbedUrl}
                  style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  scrolling="no"
                  frameBorder={0}
                  allowFullScreen
                  title="3D Virtual Tour"
                />
              </div>
            </div>
          </section>
        )}

        {!is13151 && listing.walkthroughVideoUrl && (
          <section id="videos" className="listing-section">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="tp-char-animation mb-3" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>Property Videos</h2>
                <p className="mb-0" style={{ fontSize: '1.25rem', color: '#6c757d' }}>Take a virtual tour and see the property in motion</p>
              </div>
              <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <h3 className="tp-char-animation text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>Property Walkthrough</h3>
                <div className="listing-aspect-video">
                  <iframe src={listing.walkthroughVideoUrl} title="Property Walkthrough" allowFullScreen />
                </div>
              </div>
            </div>
          </section>
        )}

        {(listing.floorPlans?.length ?? 0) > 0 || listing.floorPlanUrl ? (
          <section id="floor-plans" className="listing-section listing-section-alt scroll-mt-nav">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="tp-char-animation mb-3" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>Floor Plans</h2>
                <p className="mb-0" style={{ fontSize: '1.25rem', color: '#6c757d' }}>Explore the layout and flow of this beautiful home</p>
              </div>
              <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                {listing.floorPlans && listing.floorPlans.length > 0 ? (
                  <div className="row g-4">
                    {listing.floorPlans.map((fp, index) => (
                      <div key={index} className="col-12 col-lg-6">
                        <div className="bg-white rounded shadow-sm p-4">
                          <Image src={fp.src} alt={fp.alt} width={600} height={450} className="w-100 h-auto rounded mb-3" style={{ width: '100%', height: 'auto' }} />
                          <div className="text-center">
                            <h3 className="h6 fw-semibold text-dark mb-2">{fp.alt}</h3>
                            {fp.caption && <p className="text-muted small mb-0">{fp.caption}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : listing.floorPlanUrl ? (
                  <div className="bg-white rounded shadow-sm p-4">
                    <Image src={listing.floorPlanUrl} alt="Floor Plan" width={800} height={600} className="w-100 h-auto rounded" style={{ width: '100%', height: 'auto' }} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section id="location" className="listing-section scroll-mt-nav">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="tp-char-animation mb-3" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>Location</h2>
              <p className="mb-0" style={{ fontSize: '1.25rem', color: '#6c757d' }}>Discover the neighborhood and surrounding amenities</p>
            </div>
            <div className="listing-map-wrap">
              {listing.mapEmbedUrl ? (
                <iframe
                  src={listing.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              ) : googleMapsApiKey ? (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(listing.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-light h-100">
                  <div className="text-center p-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <FooterFour />

      {isModalOpen && images.length > 0 && (
        <div className="listing-modal-backdrop" onClick={closeModal}>
          <div className="listing-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="btn btn-link position-absolute top-0 end-0 text-white p-3 z-1" style={{ top: '1rem', right: '1rem' }} aria-label="Close">
              <span style={{ fontSize: '2rem' }}>&times;</span>
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="btn btn-dark position-absolute start-0 z-1 rounded-circle p-3" style={{ left: '1rem' }} aria-label="Previous">
              ‹
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); goToNext(); }} className="btn btn-dark position-absolute end-0 z-1 rounded-circle p-3" style={{ right: '1rem' }} aria-label="Next">
              ›
            </button>
            <div className="position-relative" style={{ maxWidth: '75rem', maxHeight: '90vh', width: '100%' }}>
              <PortfolioPicture
                src={images[currentImageIndex]?.src ?? images[0]?.src ?? '/meta-header.png'}
                alt={images[currentImageIndex]?.alt ?? images[0]?.alt ?? listing.title}
                width={1200}
                height={800}
                className="img-fluid"
                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="position-absolute bottom-0 start-50 translate-middle-x text-white small pb-3 z-1">
              {currentImageIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
