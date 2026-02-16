'use client';

import React, { Suspense, useRef } from "react";
import Link from "next/link";
import BookingArea from "@/components/booking/booking-area";
import Wrapper from "@/layouts/wrapper";
import FooterFour from "@/layouts/footers/footer-four";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(ScrollTrigger, SplitText);

const BookPageClient = () => {
    const formSectionRef = useRef<HTMLDivElement>(null);

    // Smooth scroll disabled for booking page

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    return (
        <Wrapper>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        {/* hero area - dark theme */}
                        <div className="tp-hero-3-area tp-hero-3-ptb booking-page-hero booking-hero-dark">
                            <video
                                className="booking-page-hero-bg-video"
                                autoPlay
                                muted
                                loop
                                playsInline
                                aria-hidden
                            >
                                <source src="/assets/vids/booking-page-bg.mp4" type="video/mp4" />
                            </video>
                            <div className="booking-page-hero-overlay" aria-hidden />
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="tp-hero-3-content-box text-center p-relative">
                                            <div className="tp-hero-3-circle-shape">
                                                <span></span>
                                            </div>
                                            <h4 className="tp-hero-3-title tp-char-animation text-white">
                                                Book Your Shoot
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={formSectionRef} className="booking-form-section-light">
                            <Suspense fallback={<div className="cn-contactform-area booking-theme-light pt-100 pb-100 text-center"><p className="booking-text-muted">Loading...</p></div>}>
                                <BookingArea />
                            </Suspense>
                        </div>
                    </main>

                    <FooterFour />
                </div>
            </div>

            <style jsx global>{`
                .booking-hero-light { background: #f5f5f5; }
                .booking-hero-title-light { color: #1a1a1a !important; }
                .booking-hero-subtitle-light { color: #555 !important; }
                .booking-hero-outline-light { background-color: transparent; color: #1a1a1a; border: 2px solid rgba(0,0,0,0.25); text-decoration: none; display: inline-flex; align-items: center; }
                .booking-hero-outline-light:hover { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .booking-form-section-light { background: #f8f9fa; }
                .booking-page-hero { position: relative; overflow: hidden; }
                .booking-page-hero-bg-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
                .booking-page-hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 1; }
                .booking-page-hero .container { position: relative; z-index: 2; }
                .booking-page-hero .tp-hero-3-title { font-size: 78px; }
                @media (max-width: 1199px) { .booking-page-hero .tp-hero-3-title { font-size: 64px; } }
                @media (max-width: 991px) { .booking-page-hero .tp-hero-3-title { font-size: 53px; } }
                @media (max-width: 767px) { .booking-page-hero .tp-hero-3-title { font-size: 34px; } }
                .booking-page-hero.tp-hero-3-ptb { padding-top: 147px; }
                @media (max-width: 991px) { .booking-page-hero.tp-hero-3-ptb { padding-top: 140px; } }
                @media (max-width: 767px) { .booking-page-hero.tp-hero-3-ptb { padding-top: 98px; } }
            `}</style>
        </Wrapper>
    );
};

export default BookPageClient;
