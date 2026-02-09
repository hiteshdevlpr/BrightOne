'use client';

import React from "react";
import Link from "next/link";
import { InstagramTwo, Youtube } from "@/components/svg";

export default function FooterFour() {
    return (
        <footer className="tp-footer-area black-bg border-top border-secondary footer-compact">
            <div className="container">
                <div className="footer-compact-row">
                    <div className="tp-footer-widget">
                        <h3 className="tp-footer-widget-title text-white">BrightOne Creative</h3>
                        <p className="text-white-50 mb-0">
                            Real estate photography & virtual services.
                        </p>
                    </div>
                    <div className="tp-footer-social">
                        <div className="d-flex align-items-center gap-4">
                            <Link href="https://www.facebook.com/BrightOneInc" target="_blank" className="text-white-50 hover-white" aria-label="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </Link>
                            <Link href="https://www.instagram.com/brightoneinc" target="_blank" className="text-white-50 hover-white" aria-label="Instagram">
                                <InstagramTwo />
                            </Link>
                            <Link href="https://www.linkedin.com/company/brightoneInc/" target="_blank" className="text-white-50 hover-white" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </Link>
                            <Link href="https://www.youtube.com/@BrightOneInc" target="_blank" className="text-white-50 hover-white" aria-label="YouTube">
                                <Youtube />
                            </Link>
                        </div>
                    </div>
                    <div className="tp-footer-contact">
                        <p className="text-white-50 mb-0">(416) 419-9689 · contact@brightone.ca</p>
                    </div>
                    <div className="tp-footer-legal d-flex align-items-center flex-wrap gap-2">
                        <Link href="/terms" className="text-white-50 hover-white">Terms</Link>
                        <span className="text-white-50">|</span>
                        <Link href="/privacy" className="text-white-50 hover-white">Privacy</Link>
                        <span className="text-white-50">|</span>
                        <span className="text-white-50">© {new Date().getFullYear()} BrightOne Creative</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .hover-white:hover { color: white !important; }
                .gap-4 { gap: 0.5rem; }
                .tp-footer-legal a { text-decoration: none; }
            `}</style>
        </footer>
    );
}
