import { gsap } from "gsap";
import { ScrollTrigger } from '@/plugins';

function projectThreeAnimation() {
    if (document.querySelectorAll(".tp-project-3-area").length > 0) {
        let pw = gsap.matchMedia();
        pw.add("(min-width: 1200px)", () => {
            gsap.set(".tp-project-3-wrap .pro-img-1 img", {
                x: "500",
            });
            gsap.set(".tp-project-3-wrap .pro-img-2 img", {
                x: "-500",
            });

            let projects: any = gsap.utils.toArray(".tp-project-3-wrap");

            projects.forEach((item: any) => {
                // item is generic DOM element from utils.toArray
                const img1 = item.querySelector(".pro-img-1 img");
                const img2 = item.querySelector(".pro-img-2 img");

                if (img1) {
                    gsap.to(img1, {
                        x: "0",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 18%",
                            end: "bottom 10%",
                            scrub: 1,
                            pin: true,
                            transformOrigin: "50% 50%" as any,
                        } as any,
                    });
                }

                if (img2) {
                    gsap.to(img2, {
                        x: "0",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 18%",
                            end: "bottom 10%",
                            scrub: 1,
                            pin: false,
                            transformOrigin: "50% 50%" as any,
                        } as any,
                    });
                }
            });
        });
    }
};

function projectDetailsPin() {
    let pd = gsap.matchMedia();
    pd.add("(min-width: 1400px)", () => {

        if (document.querySelectorAll('.project-details-1-area').length > 0) {
            ScrollTrigger.create({
                trigger: ".project-details-1-area",
                start: "top top",
                end: "bottom 100%",
                pin: ".project-details-1-right-wrap",
                pinSpacing: false,
            });
        }

    });
};

function projectDetailsVideoPin() {
    const vd = gsap.matchMedia();
    vd.add("(min-width: 1200px)", () => {
        const projectDetails2Area = document.querySelector('.project-details-2-area');
        const projectDetailsVideo = document.querySelector('.project-details-video');

        if (projectDetails2Area && projectDetailsVideo) {
            ScrollTrigger.create({
                trigger: projectDetails2Area,
                start: "top top",
                end: "bottom -100%",
                pin: projectDetailsVideo,
                pinSpacing: false,
            });
        }
    });

    // Get references to elements and ensure they are not null
    const progress = document.getElementById("progress") as HTMLProgressElement | null;
    const timer = document.getElementById("timer") as HTMLElement | null;
    const videoProgressBtn = document.getElementById("play") as HTMLElement | null;
    const video = document.querySelector("video") as HTMLVideoElement | null;

    function progressLoop() {
        if (video && progress && timer) {
            setInterval(function () {
                progress.value = Math.round((video.currentTime / video.duration) * 100);
                timer.innerHTML = `${Math.round(video.currentTime)} seconds`;
            }, 1000);
        }
    }

    function playPause() {
        if (video && videoProgressBtn) {
            if (video.paused) {
                video.play();
                videoProgressBtn.innerHTML = "&#10073;&#10073;"; // Pause symbol
            } else {
                video.pause();
                videoProgressBtn.innerHTML = "►"; // Play symbol
            }
        }
    }

    if (videoProgressBtn) {
        videoProgressBtn.addEventListener("click", playPause);
    }

    if (video) {
        video.addEventListener("play", progressLoop);
    }

}

export { projectThreeAnimation, projectDetailsPin, projectDetailsVideoPin };
