import { gsap, Power2 } from "gsap";

export default function cursorAnimation() {
    if (typeof window !== 'undefined') {
        const body = document.body;
        if (body.classList.contains("tp-magic-cursor") && !body.classList.contains("is-mobile")) {

            const magneticItems = document.querySelectorAll(".tp-magnetic-item");
            magneticItems.forEach(item => {
                // Equivalent to .wrap('<div class="tp-magnetic-wrap"></div>')
                const wrapper = document.createElement('div');
                wrapper.classList.add('tp-magnetic-wrap');
                item.parentNode?.insertBefore(wrapper, item);
                wrapper.appendChild(item);

                if (item.tagName.toLowerCase() === 'a') {
                    item.classList.add("not-hide-cursor");
                }
            });

            let mouse = { x: 0, y: 0 }; // Cursor position
            let pos = { x: 0, y: 0 }; // Cursor position
            let ratio = 0.15; // delay follow cursor
            let active = false;
            let ball = document.getElementById("ball");
            if (!ball) {
                // Create ball if not exists, or just return if expected to be there
                // ball = document.createElement("div"); maby?
                // Assuming ball exists in HTML
                return;
            }

            let ballWidth = 14; // Ball default width
            let ballHeight = 14; // Ball default height
            let ballScale = 1; // Ball default scale
            let ballOpacity = 1; // Ball default opacity
            let ballBorderWidth = 1; // Ball default border width

            gsap.set(ball, {  // scale from middle and style ball
                xPercent: -50,
                yPercent: -50,
                width: ballWidth,
                height: ballHeight,
                borderWidth: ballBorderWidth,
                opacity: ballOpacity
            });

            document.addEventListener("mousemove", (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            gsap.ticker.add(() => {
                if (!active) {
                    pos.x += (mouse.x - pos.x) * ratio;
                    pos.y += (mouse.y - pos.y) * ratio;

                    gsap.set(ball, { x: pos.x, y: pos.y });
                }
            });

            const magneticWraps = document.querySelectorAll(".tp-magnetic-wrap");
            magneticWraps.forEach(wrap => {
                wrap.addEventListener("mousemove", (e) => {
                    const evt = e; // MouseEvent type assertion removed for plain JS
                    parallaxCursor(evt, wrap, 2);
                    callParallax(evt, wrap);
                });

                wrap.addEventListener("mouseenter", () => {
                    gsap.to(ball, { duration: 0.3, scale: 2, borderWidth: 1, opacity: ballOpacity });
                    active = true;
                });

                wrap.addEventListener("mouseleave", (e) => {
                    gsap.to(ball, { duration: 0.3, scale: ballScale, borderWidth: ballBorderWidth, opacity: ballOpacity });
                    const item = wrap.querySelector(".tp-magnetic-item");
                    if (item) {
                        gsap.to(item, { duration: 0.3, x: 0, y: 0, clearProps: "all" });
                    }
                    active = false;
                });
            });

            function callParallax(e, parent) {
                const item = parent.querySelector(".tp-magnetic-item");
                if (item) parallaxIt(e, parent, item, 25);
            }

            function parallaxIt(e, parent, target, movement) {
                var boundingRect = parent.getBoundingClientRect();
                var relX = e.clientX - boundingRect.left;
                var relY = e.clientY - boundingRect.top;

                gsap.to(target, {
                    duration: 0.3,
                    x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
                    y: ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
                    ease: Power2.easeOut
                });
            }

            function parallaxCursor(e, parent, movement) {
                var rect = parent.getBoundingClientRect();
                var relX = e.clientX - rect.left;
                var relY = e.clientY - rect.top;
                pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
                pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
                gsap.to(ball, { duration: 0.3, x: pos.x, y: pos.y });
            }


            // Cursor view on hover (data attribute "data-cursor="...").
            const dataCursorItems = document.querySelectorAll("[data-cursor]");
            dataCursorItems.forEach((item) => {
                item.addEventListener("mouseenter", () => {
                    const ballView = ball.querySelector(".ball-view");
                    if (!ballView) {
                        ball.classList.add("with-blur");
                        const newView = document.createElement("div");
                        newView.classList.add("ball-view");
                        newView.innerHTML = item.getAttribute("data-cursor") || "";
                        ball.appendChild(newView);

                        gsap.to(ball, {
                            duration: 0.3,
                            yPercent: -75,
                            width: 110,
                            height: 110,
                            opacity: 1,
                            borderWidth: 0,
                            zIndex: 1,
                            backdropFilter: "blur(14px)",
                            backgroundColor: "#fff",
                            boxShadow: "0px 1px 3px 0px rgba(18, 20, 32, 0.14)"
                        });
                        gsap.to(newView, { duration: 0.3, scale: 1, autoAlpha: 1 });
                    }
                });

                item.addEventListener("mouseleave", () => {
                    gsap.to(ball, {
                        duration: 0.3,
                        yPercent: -50,
                        width: ballWidth,
                        height: ballHeight,
                        opacity: ballOpacity,
                        borderWidth: ballBorderWidth,
                        backgroundColor: "#000"
                    });
                    const ballView = ball.querySelector(".ball-view");
                    if (ballView) {
                        gsap.to(ballView, { duration: 0.3, scale: 0, autoAlpha: 0, clearProps: "all" });
                        ballView.remove();
                    }
                });
                item.classList.add("not-hide-cursor");
            });


            // Show/hide magic cursor //

            // Hide on hover//
            const hideCursorItems = document.querySelectorAll("a, button");
            hideCursorItems.forEach(item => {
                if (!item.classList.contains('cursor-hide')) {
                    item.addEventListener("mouseenter", () => {
                        gsap.to(ball, { duration: 0.3, scale: 0, opacity: 0 });
                    });
                    item.addEventListener("mouseleave", () => {
                        gsap.to(ball, { duration: 0.3, scale: ballScale, opacity: ballOpacity });
                    });
                }
            });

            // Hide on click//
            const clickItems = document.querySelectorAll("a");
            clickItems.forEach(item => {
                if (item.getAttribute("target") !== "_blank" &&
                    !item.classList.contains("cursor-hide") &&
                    !item.getAttribute("href")?.startsWith("#") &&
                    !item.getAttribute("href")?.startsWith("mailto") &&
                    !item.getAttribute("href")?.startsWith("tel") &&
                    !item.classList.contains("lg-trigger") &&
                    !item.closest(".tp-btn-disabled")
                ) {
                    item.addEventListener("click", () => {
                        gsap.to(ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
                    });
                }
            });

            // Show/hide on document leave/enter//
            document.addEventListener("mouseleave", () => {
                gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
            });
            document.addEventListener("mouseenter", () => {
                gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
            });

            // Show as the mouse moves//
            document.addEventListener("mousemove", () => {
                gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
            });
        }
    }
}
