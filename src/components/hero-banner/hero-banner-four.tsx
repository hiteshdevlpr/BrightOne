'use client';
import React from "react";
import { ArrowBg, RightArrowTwo } from "../svg";
import Link from "next/link";

export default function HeroBannerFour() {
    return (
        <div className="tp-hero-3-area tp-hero-3-ptb fix p-relative">
            <video
                className="tp-hero-3-bg-video"
                src="/assets/vids/home-banner.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
            />
            <div className="tp-hero-3-overlay" aria-hidden />
            <div className="container p-relative" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="tp-hero-3-content-box text-center p-relative">
                            <h4 className="tp-hero-3-title tp_reveal_anim">
                                <span className="tp-reveal-line">{"We're"} a Real Estate </span>
                                <span className="tp-reveal-line">Media Agency</span>
                            </h4>
                            <span className="tp-hero-3-category tp_reveal_anim">
                                real estate / media / branding / development
                            </span>
                            <Link className="tp-btn-black-2" href="/contact">
                                Say Hello{" "}
                                <span className="p-relative">
                                    <RightArrowTwo />
                                    <ArrowBg />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .tp-hero-3-area .tp-hero-3-bg-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 0;
                    pointer-events: none;
                }
                .tp-hero-3-area .tp-hero-3-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
