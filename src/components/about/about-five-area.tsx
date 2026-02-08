import React from "react";
import { BallRound } from "../svg";

export default function AboutFiveArea() {
  return (
    <div className="tp-about-5-area black-bg pt-150 pb-120">
      <div className="container container-1560">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-about-5-title-box pb-90">
              <h4 className="tp-about-5-title p-relative tp_fade_bottom">
                <span className="tp-about-5-subtitle tp_fade_left">
                  BrightOne Creative
                </span>
                <span className="text-space"></span>
                We are a Media Studio <br /> focused on
                <span>
                  <BallRound />
                </span>
                producing top-notch and impactful
                <span>
                  <BallRound />
                </span>
                visual experiences.
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="tp-about-5-category">
              <span className="tp_fade_bottom">Real Estate Photography</span>
              <span className="tp_fade_bottom">Cinematic Video Tours</span>
              <span className="tp_fade_bottom">Drone Photography & Video</span>
              <span className="tp_fade_bottom">Personal Branding Media</span>
              <span className="tp_fade_bottom">Virtual Staging & HDR</span>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="tp-about-5-text">
              <p className="mb-30 tp_fade_bottom">
                We deliver tailored visual content that showcases properties and
                elevates brands across the Greater Toronto Area and Durham Region.
                Our approach combines technical excellence with creative storytelling
                to drive engagement and results for realtors and professionals.
              </p>
              <p className="mb-30 tp_fade_bottom">
                We believe that understanding our clients&apos; goals is the key to
                success. It&apos;s your time to stand out with fresh perspectives,
                premium imagery, and content that converts.
              </p>
              <p className="tp_fade_bottom">
                Built on strong expertise and a commitment to quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
