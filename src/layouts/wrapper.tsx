"use client";
import React from "react";
// import BackToTop from "@/components/back-to-top";
// import ThemeSetting from "@/components/theme-setting";

// Import Bootstrap JS on client side
if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
}

interface WrapperProps {
    children: React.ReactNode;
    showBackToTop?: boolean;
}

const Wrapper = ({ children, showBackToTop = true }: WrapperProps) => {
    return (
        <React.Fragment>
            {children}
            {/* {showBackToTop && <BackToTop />} */}
            {/* <ThemeSetting /> */}
        </React.Fragment>
    );
};

export default Wrapper;
