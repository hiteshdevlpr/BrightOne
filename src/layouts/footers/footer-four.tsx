'use client';

import React from "react";
import Link from "next/link";
import { InstagramTwo, Youtube } from "@/components/svg";

export default function FooterFour() {
    return (
        <footer className="tp-footer-area black-bg pt-80 pb-50 border-top border-secondary">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-4 col-lg-4 col-md-6">
                        <div className="tp-footer-widget mb-30">
                            <h3 className="tp-footer-widget-title text-white mb-20">BrightOne Creative</h3>
                            <p className="text-white-50">
                                Professional real estate photography and virtual services to help you sell properties faster and for more money.
                            </p>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 text-center">
                        <div className="tp-footer-social mb-30">
                            <div className="d-flex justify-content-center gap-4">
                                <Link href="https://www.facebook.com/BrightOneInc" target="_blank" className="text-white-50 hover-white">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </Link>
                                <Link href="https://www.instagram.com/brightoneinc" target="_blank" className="text-white-50 hover-white">
                                    <InstagramTwo />
                                </Link>
                                <Link href="https://www.linkedin.com/company/brightoneInc/" target="_blank" className="text-white-50 hover-white">
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </Link>
                                <Link href="https://youtube.com/@brightoneca" target="_blank" className="text-white-50 hover-white">
                                    <Youtube />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 text-lg-end text-center">
                        <div className="tp-footer-contact mb-30">
                            <p className="text-white-50 mb-5">(416) 419-9689</p>
                            <p className="text-white-50">contact@brightone.ca</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="tp-footer-copyright text-center mt-50">
                            <p className="text-white-50 mb-0">© {new Date().getFullYear()} BrightOne Creative. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .hover-white:hover { color: white !important; }
                .gap-4 { gap: 1.5rem; }
            `}</style>
        </footer>
    );
}
