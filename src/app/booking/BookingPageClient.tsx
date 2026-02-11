'use client';

import React, { Suspense, useRef } from "react";
import Link from "next/link";
import BookingArea from "@/components/booking/booking-area";
import Wrapper from "@/layouts/wrapper";
import FooterFour from "@/layouts/footers/footer-four";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const BookPageClient = () => {
    const formSectionRef = useRef<HTMLDivElement>(null);

    useScrollSmooth();

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Wrapper>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        {/* hero area - matches brightone.ca/booking */}
                        <div className="tp-hero-3-area tp-hero-3-ptb border-bottom">
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
                                            <span className="tp-hero-3-category text-white-50 d-block mb-4">
                                                Get a personalized quote and book your professional real estate photography session
                                            </span>
                                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                                <button
                                                    type="button"
                                                    className="tp-btn-black-2"
                                                    onClick={scrollToForm}
                                                >
                                                    Start Booking
                                                </button>
                                                <Link href="/contact" className="tp-btn-black-2 booking-hero-outline">
                                                    Ask Questions
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={formSectionRef}>
                            <Suspense fallback={<div className="cn-contactform-area pt-100 pb-100 text-center"><p className="text-white-50">Loading...</p></div>}>
                                <BookingArea />
                            </Suspense>
                        </div>
                    </main>

                    <FooterFour />
                </div>
            </div>

            <style jsx global>{`
                .booking-hero-outline { background-color: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); text-decoration: none; display: inline-flex; align-items: center; }
                .booking-hero-outline:hover { background-color: #fff; color: #000; border-color: #fff; color: #000; }
            `}</style>
        </Wrapper>
    );
};

export default BookPageClient;
