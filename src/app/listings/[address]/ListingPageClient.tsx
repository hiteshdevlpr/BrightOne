'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from '@/plugins';
import { charAnimation } from '@/utils/title-animation';
import FooterFour from '@/layouts/footers/footer-four';
import { ListingData } from '@/lib/listing-data';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface ListingPageClientProps {
  listing: ListingData;
  googleMapsApiKey?: string;
}

export default function ListingPageClient({ listing }: ListingPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = listing.images ?? [];

  useGSAP(() => {
    const timer = setTimeout(() => charAnimation(), 100);
    return () => clearTimeout(timer);
  });

  const openModal = (index: number) => { if (images.length) { setCurrentImageIndex(index); setIsModalOpen(true); } };
  const closeModal = () => setIsModalOpen(false);
  const goToPrevious = () => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  const goToNext = () => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);

  return (
    <div className="listing-page">
      <main className="pt-5">
        <section className="listing-hero" style={{ minHeight: '60vh' }}>
          <div className="listing-hero-bg">
            <Image
              src={images[0]?.src ?? '/meta-header.png'}
              alt={images[0]?.alt ?? listing.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="listing-hero-overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
          </div>
          <div className="listing-hero-content" style={{ minHeight: '60vh', alignItems: 'flex-end' }}>
            <div className="container">
              <div className="text-white pb-4">
                <h1 className="tp-char-animation text-white mb-3" style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.8rem)', fontWeight: 700 }}>{listing.title}</h1>
                <p className="text-white mb-3" style={{ fontSize: '1.25rem', opacity: 0.9 }}>{listing.address}</p>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="fw-bold" style={{ fontSize: '1.75rem' }}>{listing.priceFormatted}</span>
                  <span>{listing.bedrooms} bed</span>
                  <span>{listing.bathrooms} bath</span>
                  {listing.squareFootage > 0 && <span>{listing.squareFootage.toLocaleString()} sq ft</span>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="listing-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-12 col-lg-8">
                <div className="mb-5">
                  <h2 className="tp-char-animation h3 fw-bold mb-4 text-dark">Property Photos</h2>
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
                          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
                      ))
                    ) : (
                      <div className="py-5 text-center text-secondary" style={{ gridColumn: '1 / -1' }}>No images available</div>
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <h2 className="tp-char-animation h3 fw-bold mb-4 text-dark">About This Property</h2>
                  <p className="text-secondary lh-base" style={{ fontSize: '1.125rem' }}>{listing.description}</p>
                </div>
                <div className="mb-5">
                  <h2 className="tp-char-animation h3 fw-bold mb-4 text-dark">Property Features</h2>
                  <div className="row g-3">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                          <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                          <div>
                            <div className="fw-semibold text-dark">{feature.label}</div>
                            <div className="text-secondary">{feature.value}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="position-sticky" style={{ top: '6rem' }}>
                  <div className="bg-white border rounded shadow-sm p-4 mb-4">
                    <h3 className="tp-char-animation h5 fw-bold mb-4 text-dark">Contact Agent</h3>
                    <div className="mb-4">
                      <div className="fw-semibold text-dark">{listing.agentName}</div>
                      <div className="text-secondary">Real Estate Agent</div>
                    </div>
                    <div className="mb-4">
                      <a href={`tel:${listing.agentPhone}`} className="d-flex align-items-center gap-2 text-primary text-decoration-none mb-2">
                        <i className="fa-solid fa-phone" /> {listing.agentPhone}
                      </a>
                      <a href={`mailto:${listing.agentEmail}`} className="d-flex align-items-center gap-2 text-primary text-decoration-none">
                        <i className="fa-solid fa-envelope" /> {listing.agentEmail}
                      </a>
                    </div>
                    <a href="/contact" className="btn btn-primary w-100">Schedule a Viewing</a>
                  </div>
                  <div className="bg-light rounded p-4">
                    <h3 className="tp-char-animation h5 fw-bold mb-4 text-dark">Property Details</h3>
                    <div className="d-flex flex-column gap-2">
                      {listing.mlsNumber && (
                        <div className="d-flex justify-content-between">
                          <span className="text-secondary">MLS Number:</span>
                          <span className="fw-semibold">{listing.mlsNumber}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary">Status:</span>
                        <span className={`fw-semibold text-capitalize ${listing.status === 'active' ? 'text-success' : listing.status === 'sold' ? 'text-danger' : 'text-warning'}`}>{listing.status}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary">Listed:</span>
                        <span className="fw-semibold">{new Date(listing.dateListed).toLocaleDateString()}</span>
                      </div>
                      {listing.virtualTourUrl && (
                        <a href={listing.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success mt-3 w-100">Virtual Tour</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterFour />

      {isModalOpen && images.length > 0 && (
        <div className="listing-modal-backdrop" onClick={closeModal}>
          <div className="listing-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="btn btn-link position-absolute text-white p-3 z-1" style={{ top: '1rem', right: '1rem' }} aria-label="Close">
              <span style={{ fontSize: '2rem' }}>&times;</span>
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="btn btn-dark position-absolute rounded-circle p-3 z-1" style={{ left: '1rem' }} aria-label="Previous">
              ‹
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); goToNext(); }} className="btn btn-dark position-absolute rounded-circle p-3 z-1" style={{ right: '1rem' }} aria-label="Next">
              ›
            </button>
            <div className="position-relative" style={{ maxWidth: '75rem', maxHeight: '90vh', width: '100%' }}>
              <Image
                src={images[currentImageIndex]?.src ?? images[0]?.src ?? '/meta-header.png'}
                alt={images[currentImageIndex]?.alt ?? listing.title}
                width={1200}
                height={800}
                className="img-fluid"
                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="position-absolute start-50 translate-middle-x text-white small pb-3 z-1" style={{ bottom: 0 }}>
              {currentImageIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
