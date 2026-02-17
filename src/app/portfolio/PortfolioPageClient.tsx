'use client';

import React from 'react';
import Link from 'next/link';
import Wrapper from '@/layouts/wrapper';
import { PortfolioPicture } from '@/components/portfolio-picture';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import type { ListingData } from '@/lib/listing-data';

interface PortfolioPageClientProps {
    listings: ListingData[];
}

export default function PortfolioPageClient({ listings }: PortfolioPageClientProps) {
    useScrollSmooth();

    return (
        <Wrapper>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div className="inner-bg" style={{ backgroundImage: "url(/assets/img/home-01/team/team-details-bg.png)" }}>
                        <main>
                            <div className="tm-hero-area tm-hero-ptb p-relative">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="tm-hero-content">
                                                <span className="tm-hero-subtitle">Our Work</span>
                                                <h4 className="tm-hero-title-big" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
                                                    Portfolio
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container py-5">
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8 text-center">
                                        <p className="text-white-50 mb-0" style={{ fontSize: '1.15rem' }}>
                                            Explore our real estate photography, videography, and virtual tour projects across the GTA.
                                        </p>
                                    </div>
                                </div>

                                {listings.length > 0 ? (
                                    <div className="row g-4 pb-5">
                                        {listings.map((listing) => {
                                            const thumb = listing.images?.[0];
                                            const thumbSrc = thumb?.src ?? '/meta-header.png';
                                            return (
                                                <div key={listing.id} className="col-sm-6 col-lg-4 col-xl-3">
                                                    <Link href={`/listings/${listing.id}`} className="portfolio-listing-card h-100">
                                                        <div className="portfolio-listing-card__img-wrap">
                                                            <PortfolioPicture
                                                                src={thumbSrc}
                                                                alt={thumb?.alt ?? listing.title}
                                                                className="portfolio-listing-card__img"
                                                                fill
                                                                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1200px) 50vw, 50vw"
                                                            />
                                                        </div>
                                                        <div className="portfolio-listing-card__body">
                                                            <h3 className="portfolio-listing-card__title">{listing.title}</h3>
                                                            <p className="portfolio-listing-card__address">{listing.address}</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="row justify-content-center pb-5">
                                        <div className="col-lg-8 text-center">
                                            <p className="text-white-50 mb-4">No listings in the portfolio yet. Check back soon.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="row justify-content-center pb-80">
                                    <div className="col-auto">
                                        <div className="d-flex flex-wrap justify-content-center gap-3">
                                            <Link href="/contact" className="tp-btn-black-2">
                                                Get a Quote
                                            </Link>
                                            <Link href="/booking" className="tp-btn-black-2" style={{ backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)' }}>
                                                Book a Session
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <FooterFour />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .portfolio-listing-card {
                    display: block;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    text-decoration: none;
                    color: inherit;
                }
                .portfolio-listing-card:hover {
                    border-color: rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
                }
                .portfolio-listing-card__img-wrap {
                    position: relative;
                    aspect-ratio: 3 / 2;
                    overflow: hidden;
                    background: #1a1a1a;
                }
                .portfolio-listing-card__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.35s ease;
                }
                .portfolio-listing-card:hover .portfolio-listing-card__img {
                    transform: scale(1.05);
                }
                .portfolio-listing-card__body {
                    padding: 1.25rem 1.25rem 1.5rem;
                }
                .portfolio-listing-card__title {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #fff;
                    margin: 0 0 0.35rem 0;
                    line-height: 1.3;
                }
                .portfolio-listing-card__address {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.65);
                    margin: 0;
                    line-height: 1.4;
                }
            `}</style>
        </Wrapper>
    );
}
