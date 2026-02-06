'use client';
import { useState, useEffect, useRef } from 'react';

const useStickyHeader = (offset = 20) => {
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const setHeaderHeight = headerRef.current?.offsetHeight;

        if (setHeaderHeight) {
            const headerElements = document.querySelectorAll<HTMLDivElement>('.tp-header-height');
            headerElements.forEach(element => {
                element.style.height = `${setHeaderHeight}px`;
            });
        }
    }, []);

    function adjustMenuBackground() {
        if (typeof window === 'undefined') return;

        const headerArea = document.querySelector('.tp-header-3-area');
        if (headerArea) {
            const menuBox = document.querySelector<HTMLElement>('.tp-header-3-menu-box');
            const menuBg = document.querySelector<HTMLElement>('.menu-bg');

            if (menuBox && menuBg) {
                const rect = menuBox.getBoundingClientRect();
                // jQuery .width() is content width, but offsetWidth is border-box. 
                // Example logic assumed: menuBoxWidth + 46. 
                // We will match the logic: .width() + 46.
                const width = menuBox.offsetWidth; // approximate replacement
                const height = menuBox.offsetHeight;

                // jQuery .offset() is relative to document.
                // getBoundingClientRect is relative to viewport.
                const left = rect.left + window.scrollX;

                menuBg.style.width = `${width + 46}px`;
                menuBg.style.height = `${height}px`;
                menuBg.style.left = `${left}px`;
            }
        }
    }

    function headerFullWidth() {
        if (typeof document === 'undefined') return;
        const menuElements = document.querySelectorAll(".tp-menu-fullwidth");
        menuElements.forEach((element: Element) => {
            const previousDiv = element.parentElement?.parentElement;
            if (previousDiv) {
                previousDiv.classList.add("has-homemenu");
            }
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > offset);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    return { isSticky, headerFullWidth, adjustMenuBackground, headerRef };
};

export default useStickyHeader;
