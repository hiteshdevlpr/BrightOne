'use client';

import React, { useRef } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterFour from "@/layouts/footers/footer-four";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function BookingLandingClient() {
    const formSectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    return (
        <Wrapper>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
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
                                            <p className="text-white-50 mt-3 mb-0">Choose your service type to get started</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={formSectionRef} className="booking-form-section-light">
                            <div className="cn-contactform-area booking-theme-light pt-100 pb-100">
                                <div className="container">
                                    <div className="row justify-content-center g-4">
                                        <div className="col-lg-6 col-md-6">
                                            <Link
                                                href="/booking/listing"
                                                className="booking-thumb-card d-block text-decoration-none"
                                            >
                                                <div className="booking-thumb-icon">
                                                    <i className="fa-solid fa-home"></i>
                                                </div>
                                                <h3 className="booking-thumb-title">Real Estate Listing Media</h3>
                                                <p className="booking-thumb-desc">
                                                    HDR photography, video tours, drone aerials, virtual staging, and more for property listings.
                                                </p>
                                                <span className="booking-thumb-cta">Book Listing Media →</span>
                                            </Link>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <Link
                                                href="/booking/personal"
                                                className="booking-thumb-card d-block text-decoration-none"
                                            >
                                                <div className="booking-thumb-icon">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <h3 className="booking-thumb-title">Personal Branding Media</h3>
                                                <p className="booking-thumb-desc">
                                                    Professional headshots, lifestyle portraits, and social media content for your brand.
                                                </p>
                                                <span className="booking-thumb-cta">Book Personal Branding →</span>
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

            <style jsx global>{`
                .booking-hero-light { background: #f5f5f5; }
                .booking-hero-title-light { color: #1a1a1a !important; }
                .booking-hero-subtitle-light { color: #555 !important; }
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
                .booking-thumb-card {
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 16px;
                    padding: 40px 32px;
                    height: 100%;
                    transition: all 0.3s ease;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                }
                .booking-thumb-card:hover {
                    border-color: rgba(0,0,0,0.15);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    transform: translateY(-4px);
                }
                .booking-thumb-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.06);
                    border-radius: 50%;
                    font-size: 32px;
                    color: #1a1a1a;
                }
                .booking-thumb-card:hover .booking-thumb-icon {
                    background: rgba(0,0,0,0.1);
                }
                .booking-thumb-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 12px;
                }
                .booking-thumb-desc {
                    font-size: 15px;
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .booking-thumb-cta {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1a1a1a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .booking-thumb-card:hover .booking-thumb-cta {
                    text-decoration: underline;
                }
            `}</style>
        </Wrapper>
    );
}
