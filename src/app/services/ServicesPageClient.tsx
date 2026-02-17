'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';

const SERVICES = [
    {
        id: 'real-estate-photography',
        title: 'Real Estate Photography',
        description: 'Professional HDR photography for listings — interior and exterior shots that showcase your property and attract serious buyers.',
        image: 'https://picsum.photos/seed/re-photo/600/400',
    },
    {
        id: 'listing-walkthrough-video',
        title: 'Listing Walkthrough Video',
        description: 'Cinematic walkthrough videos that bring your listing to life. Perfect for social media and listing platforms.',
        image: 'https://picsum.photos/seed/walkthrough-vid/600/400',
    },
    {
        id: 'agent-on-camera-video',
        title: 'Agent on Camera Video',
        description: 'Personalized agent introduction and property highlight videos that build trust and put you in the spotlight.',
        image: 'https://picsum.photos/seed/agent-video/600/400',
    },
    {
        id: 'drone-photos-videos',
        title: 'Drone Photos and Videos',
        description: 'Aerial photography and video that capture the full property, lot, and neighbourhood from a unique perspective.',
        image: 'https://picsum.photos/seed/drone/600/400',
    },
    {
        id: '3d-virtual-tours-iguide',
        title: '3D Virtual Tours with iGuide',
        description: 'Interactive 3D virtual tours and accurate 2D floor plans so buyers can explore every room from anywhere.',
        image: 'https://picsum.photos/seed/iguide/600/400',
    },
    {
        id: '2d-floor-plans',
        title: '2D Floor Plans',
        description: 'Accurate 2D floor plans that help buyers understand layout and flow. Standard or detailed options available.',
        image: 'https://picsum.photos/seed/floorplan/600/400',
    },
    {
        id: 'realtor-personal-branding',
        title: 'Realtor Personal Branding Media',
        description: 'Headshots, brand videos, and social content that strengthen your personal brand and attract more clients.',
        image: 'https://picsum.photos/seed/branding/600/400',
    },
    {
        id: 'virtual-staging',
        title: 'Virtual Staging',
        description: 'Digitally furnished and decorated spaces to help buyers visualize potential. Perfect for empty or dated rooms.',
        image: 'https://picsum.photos/seed/virtual-staging/600/400',
    },
];

export default function ServicesPageClient() {
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
                                                <span className="tm-hero-subtitle">What We Offer</span>
                                                <h4 className="tm-hero-title-big" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
                                                    Services
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
                                            Professional real estate listing media and personal branding across the Greater Toronto Area.
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-4 pb-5">
                                    {SERVICES.map((service) => (
                                        <div key={service.id} className="col-sm-6 col-lg-4 col-xl-3">
                                            <div className="services-page-card h-100">
                                                <div className="services-page-card__img-wrap">
                                                    <Image
                                                        src={service.image}
                                                        alt={service.title}
                                                        width={600}
                                                        height={400}
                                                        className="services-page-card__img"
                                                        sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1200px) 50vw, 50vw"
                                                        quality={90}
                                                    />
                                                </div>
                                                <div className="services-page-card__body">
                                                    <h3 className="services-page-card__title">{service.title}</h3>
                                                    <p className="services-page-card__desc">{service.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="row justify-content-center pb-80">
                                    <div className="col-auto">
                                        <div className="d-flex flex-wrap justify-content-center gap-3">
                                            <Link href="/booking" className="tp-btn-black-2">
                                                Book Now
                                            </Link>
                                            <Link href="/contact" className="tp-btn-black-2" style={{ backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)' }}>
                                                Contact Us
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
                .services-page-card {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: border-color 0.25s, box-shadow 0.25s;
                }
                .services-page-card:hover {
                    border-color: rgba(255, 255, 255, 0.25);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }
                .services-page-card__img-wrap {
                    position: relative;
                    aspect-ratio: 3 / 2;
                    overflow: hidden;
                    background: #1a1a1a;
                }
                .services-page-card__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.35s ease;
                }
                .services-page-card:hover .services-page-card__img {
                    transform: scale(1.05);
                }
                .services-page-card__body {
                    padding: 1.25rem 1.25rem 1.5rem;
                }
                .services-page-card__title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #fff;
                    margin: 0 0 0.5rem 0;
                    line-height: 1.3;
                }
                .services-page-card__desc {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    line-height: 1.5;
                }
            `}</style>
        </Wrapper>
    );
}
