'use client';

import React, { Suspense } from "react";
import BookingArea from "@/components/booking/booking-area";
import Wrapper from "@/layouts/wrapper";
import FooterFour from "@/layouts/footers/footer-four";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const RealEstateBookingClient = () => {
    useScrollSmooth();

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
                        <div className="tp-hero-3-area tp-hero-3-ptb border-bottom">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="tp-hero-3-content-box text-center p-relative">
                                            <div className="tp-hero-3-circle-shape">
                                                <span></span>
                                            </div>
                                            <h4 className="tp-hero-3-title tp-char-animation text-white">
                                                Real Estate Listing Media
                                            </h4>
                                            <span className="tp-hero-3-category text-white-50">
                                                Professional Media for Property Listings
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Suspense fallback={<div className="cn-contactform-area pt-100 pb-100 text-center"><p className="text-white-50">Loading...</p></div>}>
                            <BookingArea />
                        </Suspense>
                    </main>

                    <FooterFour />
                </div>
            </div>
        </Wrapper>
    );
};

export default RealEstateBookingClient;
