'use client';

import React from 'react';
import Link from 'next/link';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';

export default function AboutPageClient() {
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
                                                <span className="tm-hero-subtitle">Our Story</span>
                                                <h4 className="tm-hero-title-big" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
                                                    About Us
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container py-5 pb-80">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8 text-center">
                                        <div className="legal-content text-white-50">
                                            <p className="mb-4" style={{ fontSize: '1.25rem' }}>
                                                We&apos;re putting the finishing touches on this page.
                                            </p>
                                            <h2 className="h3 text-white mb-4">Coming Soon</h2>
                                            <p className="mb-5">
                                                BrightOne Creative delivers professional real estate photography, videography, virtual tours, and personal branding across the Greater Toronto Area. Check back soon to learn more about our team and story.
                                            </p>
                                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                                <Link href="/" className="tp-btn-black-2">
                                                    Back to Home
                                                </Link>
                                                <Link href="/contact" className="tp-btn-black-2" style={{ backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)' }}>
                                                    Contact Us
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <FooterFour />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
