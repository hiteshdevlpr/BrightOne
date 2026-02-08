"use client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "@/plugins"; // Modified import
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { gsap } from "gsap";

export default function useScrollSmooth() {
    const [isScrollSmooth] = useState<boolean>(true);

    useGSAP(() => {
        // Register plugins properly
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        const smoothWrapper = document.getElementById("smooth-wrapper");
        const smoothContent = document.getElementById("smooth-content");

        if (smoothWrapper && smoothContent && isScrollSmooth) {
            gsap.config({
                nullTargetWarn: false,
            });

            // create the smooth scroller FIRST
            ScrollSmoother.create({
                wrapper: smoothWrapper,
                content: smoothContent,
                smooth: 2,
                effects: true,
                smoothTouch: 0.1,
                normalizeScroll: false,
                ignoreMobileResize: true,
            });

            // Only create shape pin if element exists
            const shapeEl = document.querySelector(".shape");
            if (shapeEl) {
                ScrollTrigger.create({
                    trigger: ".shape",
                    pin: true,
                    start: "center center",
                    end: "+=300",
                    markers: false,
                });
            }
            ScrollTrigger.refresh();
        }
    }, [isScrollSmooth]);
}
