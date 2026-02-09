'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderMenus from "./header-menus";
import logo_2 from '../../../public/assets/img/logo/logo-wo-shadow.png';
import MobileOffcanvas from "@/components/offcanvas/mobile-offcanvas";
import useStickyHeader from "@/hooks/use-sticky-header";

export default function HeaderFour() {
    const pathname = usePathname();
    const { isSticky, headerFullWidth, adjustMenuBackground } = useStickyHeader(20);
    const [openOffCanvas, setOpenOffCanvas] = React.useState(false);
    const isListingPage = pathname?.startsWith('/listings/') ?? false;

    useEffect(() => {
        headerFullWidth();
        adjustMenuBackground();
        
        // Recalculate menu background after DOM updates
        const timeoutId = setTimeout(() => {
            adjustMenuBackground();
        }, 100);
        
        // Recalculate on window resize
        const handleResize = () => {
            adjustMenuBackground();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <header className="header-compact">
                <div id="header-sticky" className={`tp-header-3-area z-index-5 ${isSticky && !isListingPage ? 'header-sticky' : ''}`}>
                    <span className="menu-bg"></span>
                    <div className="container container-1740">
                        <div className="row align-items-center">
                            <div className="col-xl-3 col-lg-6 col-md-6 col-6">
                                <div className="tp-header-logo tp-header-3-logo tp-header-logo-with-tagline">
                                    <Link className="logo-1" href="/">
                                        <Image src="/logo-wo-shadow.png" alt="BrightOne Creative" width={200} height={52} style={{ height: 52, width: 'auto' }} />
                                    </Link>
                                    <Link className="logo-2" href="/">
                                        <Image src={logo_2} alt="BrightOne Creative" width={200} height={52} style={{ height: 52, width: 'auto' }} />
                                    </Link>
                                    <span className="tp-header-tagline">Real Estate Media & Personal Branding</span>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 d-none d-xl-block">
                                <div className="tp-header-3-menu-wrap text-center">
                                    <div className="tp-header-3-menu-box d-inline-flex align-items-center justify-content-between">
                                        <div className="tp-header-3-menu header-main-menu">
                                            <nav className="tp-main-menu-content">
                                                {/* header menus */}
                                                <HeaderMenus />
                                                {/* header menus */}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-6 col-6">
                                <div className="tp-header-3-right d-flex align-items-center justify-content-end">
                                    <div className="tp-header-3-social d-none d-sm-block">
                                        <Link href="https://www.facebook.com/BrightOneInc" target="_blank">
                                            <i className="fa-brands fa-facebook-f"></i>
                                        </Link>
                                        <Link href="https://www.instagram.com/brightoneinc" target="_blank">
                                            <i className="fa-brands fa-instagram"></i>
                                        </Link>
                                        <Link href="https://www.linkedin.com/company/brightoneInc/" target="_blank">
                                            <i className="fa-brands fa-linkedin-in"></i>
                                        </Link>
                                        <Link href="https://www.youtube.com/@BrightOneInc" target="_blank">
                                            <i className="fa-brands fa-youtube"></i>
                                        </Link>
                                    </div>
                                    <button onClick={() => setOpenOffCanvas(true)} className="tp-header-3-bar tp-offcanvas-open-btn d-xl-none">
                                        <i className="fa-solid fa-bars"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* off canvas */}
            <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffCanvas} />
            {/* off canvas */}
        </>
    );
}
