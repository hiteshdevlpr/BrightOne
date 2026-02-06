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

        const headerArea = document.querySelector<HTMLElement>('.tp-header-3-area');
        if (headerArea) {
            const menuBox = document.querySelector<HTMLElement>('.tp-header-3-menu-box');
            const menuBg = document.querySelector<HTMLElement>('.menu-bg');

            if (menuBox && menuBg && headerArea) {
                const menuBoxRect = menuBox.getBoundingClientRect();
                const headerAreaRect = headerArea.getBoundingClientRect();
                
                // Calculate width and height
                const width = menuBox.offsetWidth;
                const height = menuBox.offsetHeight;

                // Calculate positions relative to header area
                const left = menuBoxRect.left - headerAreaRect.left;
                const top = menuBoxRect.top - headerAreaRect.top;

                menuBg.style.width = `${width + 46}px`;
                menuBg.style.height = `${height}px`;
                menuBg.style.left = `${left - 23}px`; // Center the extra 46px padding (23px on each side)
                menuBg.style.top = `${top}px`;
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
            adjustMenuBackground();
        };

        const handleResize = () => {
            adjustMenuBackground();
        };

        // Initial check
        handleScroll();
        adjustMenuBackground();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Recalculate after a short delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            adjustMenuBackground();
        }, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [offset]);

    return { isSticky, headerFullWidth, adjustMenuBackground, headerRef };
};

export default useStickyHeader;
