import React from "react";
import Image from "next/image";
import { Hand } from "@/components/svg";

// images
import shape from "@/assets/img/inner-about/about/shape-1.png";
import ab_1 from "@/assets/img/vertical-walkthrough.gif";
import ab_2 from "@/assets/img/landscape-walkthrough.gif";
import ab_3 from "@/assets/img/vertical-walkthrough.gif";

export default function AboutUsArea() {
    return (
        <div className="ab-about-area mt-120 pb-30 z-index-5">
            <div className="container">
                <div id="about-info" className="row">
                    <div className="col-12">
                        <div className="ab-about-content p-relative">
                            <span>
                                <Hand />
                                Hi!
                            </span>
                            <p className="tp-dropcap tp_fade_bottom">
                                We are a creative media studio specializing in professional
                                real estate photography, videography, and personal branding
                                services. Our team delivers high-quality visual content including
                                HDR photography, cinematic video tours, drone aerials, virtual
                                staging, and social media content to help you showcase properties
                                and elevate your personal brand.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
