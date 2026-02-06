'use client';

import React from "react";
import Link from "next/link";
import HeaderFour from "@/layouts/headers/header-four";
import Wrapper from "@/layouts/wrapper";
import FooterFour from "@/layouts/footers/footer-four";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const services = [
    {
        title: 'Personal Branding Media',
        description: 'Elevate your personal brand with professional headshots, lifestyle portraits, and social media content tailored to make you stand out.',
        image: 'https://picsum.photos/seed/personal-brand/800/500',
        href: '/booking/personal',
    },
    {
        title: 'Real Estate Listing Media',
        description: 'Showcase properties at their best with HDR photography, cinematic video tours, drone aerials, floor plans, and virtual staging.',
        image: 'https://picsum.photos/seed/real-estate/800/500',
        href: '/booking/real-estate',
    },
];

const BookPageClient = () => {
    useScrollSmooth();

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    return (
        <Wrapper>
            <HeaderFour />

            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        {/* hero area */}
                        <div className="tp-hero-3-area tp-hero-3-ptb border-bottom">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="tp-hero-3-content-box text-center p-relative">
                                            <div className="tp-hero-3-circle-shape">
                                                <span></span>
                                            </div>
                                            <h4 className="tp-hero-3-title tp-char-animation text-white">
                                                Book Your Session
                                            </h4>
                                            <span className="tp-hero-3-category text-white-50">
                                                Choose a service to get started
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* service selection */}
                        <div className="pt-100 pb-100" style={{ fontFamily: 'var(--font-inter)' }}>
                            <div className="container">
                                <div className="row justify-content-center">
                                    {services.map((svc) => (
                                        <div key={svc.href} className="col-lg-5 col-md-6 mb-40">
                                            <Link href={svc.href} className="svc-card d-block">
                                                <div className="svc-card-img">
                                                    <img src={svc.image} alt={svc.title} />
                                                </div>
                                                <div className="svc-card-body">
                                                    <h4 className="svc-card-title">{svc.title}</h4>
                                                    <p className="svc-card-desc">{svc.description}</p>
                                                    <span className="svc-card-link">
                                                        Get Started &rarr;
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>

                    <FooterFour />
                </div>
            </div>

            <style jsx global>{`
                .svc-card { text-decoration: none; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; transition: border-color 0.3s, transform 0.3s; display: block; }
                .svc-card:hover { border-color: rgba(255,255,255,0.4); transform: translateY(-4px); }
                .svc-card-img { width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: #0a0a0a; }
                .svc-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
                .svc-card:hover .svc-card-img img { transform: scale(1.04); }
                .svc-card-body { padding: 28px 30px 32px; }
                .svc-card-title { color: #fff; font-size: 22px; font-weight: 600; margin-bottom: 10px; }
                .svc-card-desc { color: rgba(255,255,255,0.55); font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
                .svc-card-link { color: #fff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; transition: opacity 0.2s; }
                .svc-card:hover .svc-card-link { opacity: 0.7; }
            `}</style>
        </Wrapper>
    );
};

export default BookPageClient;
