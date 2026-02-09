import React from "react";
import Image from "next/image";
import { Behance, CloseTwo, Dribble, InstagramTwo, Youtube } from "../svg";

// images
import gallery_1 from "../../../public/assets/img/menu/offcanvas/offcanvas-1.jpg";
import gallery_2 from "../../../public/assets/img/menu/offcanvas/offcanvas-2.jpg";
import gallery_3 from "../../../public/assets/img/menu/offcanvas/offcanvas-3.jpg";
import gallery_4 from "../../../public/assets/img/menu/offcanvas/offcanvas-4.jpg";
import MobileMenus from "./mobile-menus";
import Link from "next/link";

const gallery_images = [gallery_1, gallery_2, gallery_3, gallery_4];

// prop type
type IProps = {
    openOffcanvas: boolean;
    setOpenOffcanvas: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileOffcanvas({ openOffcanvas, setOpenOffcanvas }: IProps) {
    return (
        <>
            <div className={`tp-offcanvas-area ${openOffcanvas ? "opened" : ""}`}>
                <div className="tp-offcanvas-wrapper">
                    <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
                        <div className="tp-offcanvas-logo">
                            <Link href="/" onClick={() => setOpenOffcanvas(false)}>
                                <Image src="/logo-wo-shadow.png" alt="logo" width={85} height={100} />
                            </Link>
                        </div>
                        <div className="tp-offcanvas-close">
                            <button
                                className="tp-offcanvas-close-btn"
                                onClick={() => setOpenOffcanvas(false)}
                            >
                                <CloseTwo />
                            </button>
                        </div>
                    </div>
                    <div className="tp-offcanvas-main">
                        <div className="tp-offcanvas-content">
                            <h3 className="tp-offcanvas-title">BrightOne</h3>
                            <p>Creative real estate marketing. Listings, branding, and video in the Greater Toronto Area.</p>
                        </div>
                        <div className="tp-main-menu-mobile d-xl-none">
                            <MobileMenus />
                        </div>
                        <div className="tp-offcanvas-gallery">
                            <div className="row gx-2">
                                {gallery_images.map((item, i) => (
                                    <div className="col-md-3 col-3" key={i}>
                                        <div className="tp-offcanvas-gallery-img fix">
                                            <Link href="/portfolio" onClick={() => setOpenOffcanvas(false)}>
                                                <Image style={{ width: "100%", height: "auto" }} src={item} alt="Portfolio" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tp-offcanvas-contact">
                            <h3 className="tp-offcanvas-title sm">Information</h3>

                            <ul>
                                <li>
                                    <Link href="tel:4164199689" onClick={() => setOpenOffcanvas(false)}>(416) 419-9689</Link>
                                </li>
                                <li>
                                    <Link href="mailto:contact@brightone.ca" onClick={() => setOpenOffcanvas(false)}>contact@brightone.ca</Link>
                                </li>
                                <li>
                                    <Link href="/contact" onClick={() => setOpenOffcanvas(false)}>Greater Toronto Area, ON</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="tp-offcanvas-social">
                            <h3 className="tp-offcanvas-title sm">Follow Us</h3>
                            <ul>
                                <li>
                                    <Link href="https://www.facebook.com/BrightOneInc" target="_blank" rel="noopener noreferrer" onClick={() => setOpenOffcanvas(false)}><i className="fa-brands fa-facebook-f"></i></Link>
                                </li>
                                <li>
                                    <Link href="https://www.instagram.com/brightoneinc" target="_blank" rel="noopener noreferrer" onClick={() => setOpenOffcanvas(false)}><InstagramTwo /></Link>
                                </li>
                                <li>
                                    <Link href="https://www.linkedin.com/company/brightoneInc/" target="_blank" rel="noopener noreferrer" onClick={() => setOpenOffcanvas(false)}><i className="fa-brands fa-linkedin-in"></i></Link>
                                </li>
                                <li>
                                    <Link href="https://youtube.com/@brightoneca" target="_blank" rel="noopener noreferrer" onClick={() => setOpenOffcanvas(false)}><Youtube /></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div
                onClick={() => setOpenOffcanvas(false)}
                className={`body-overlay ${openOffcanvas ? "opened" : ""}`}
            ></div>
        </>
    );
}
