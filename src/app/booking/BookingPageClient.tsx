'use client';

import React, { useEffect } from "react";
import HeaderFour from "@/layouts/headers/header-four";
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
    useScrollSmooth();

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    return (
        <Wrapper>
            {/* header area start */}
            <HeaderFour />
            {/* header area end */}

            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        {/* hero area start */}
                        <div className="tp-hero-3-area tp-hero-3-ptb black-bg">
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
                                                Professional Real Estate Media Services
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* hero area end */}

                        {/* booking form area */}
                        <BookingArea />
                        {/* booking form area */}
                    </main>

                    <FooterFour />
                </div>
            </div>
        </Wrapper>
    );
};

export default BookPageClient;
