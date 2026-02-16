'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const useStickyHeader = (offset = 20) => {
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const isStickyRef = useRef(false);
    const tickRef = useRef<number | null>(null);
    const HYSTERESIS = 8; // Unstick when scrollY drops this many px below offset to avoid flicker at threshold

    useEffect(() => {
        const setHeaderHeight = headerRef.current?.offsetHeight;

        if (setHeaderHeight) {
            const headerElements = document.querySelectorAll<HTMLDivElement>('.tp-header-height');
            headerElements.forEach(element => {
                element.style.height = `${setHeaderHeight}px`;
            });
        }
    }, []);

    const adjustMenuBackground = useCallback(() => {
        if (typeof window === 'undefined') return;

        const headerArea = document.querySelector<HTMLElement>('.tp-header-3-area');
        if (headerArea) {
            const menuBox = document.querySelector<HTMLElement>('.tp-header-3-menu-box');
            const menuBg = document.querySelector<HTMLElement>('.menu-bg');

            if (menuBox && menuBg && headerArea) {
                const menuBoxRect = menuBox.getBoundingClientRect();
                const headerAreaRect = headerArea.getBoundingClientRect();
                const width = menuBox.offsetWidth;
                const height = menuBox.offsetHeight;
                const left = menuBoxRect.left - headerAreaRect.left;
                const top = menuBoxRect.top - headerAreaRect.top;
                menuBg.style.width = `${width + 46}px`;
                menuBg.style.height = `${height}px`;
                menuBg.style.left = `${left - 23}px`;
                menuBg.style.top = `${top}px`;
            }
        }
    }, []);

    function headerFullWidth() {
        if (typeof document === 'undefined') return;
        const menuElements = document.querySelectorAll(".tp-menu-fullwidth");
        menuElements.forEach((element: Element) => {
            const previousDiv = element.parentElement?.parentElement;
            if (previousDiv) {
                previousDiv.classList.add("has-homemenu");
            }
        });
    }

    useEffect(() => {
        const updateSticky = () => {
            const y = window.scrollY;
            const stickThreshold = offset;
            const unstickThreshold = Math.max(0, offset - HYSTERESIS);
            const next = isStickyRef.current
                ? y > unstickThreshold
                : y > stickThreshold;
            if (next !== isStickyRef.current) {
                isStickyRef.current = next;
                setIsSticky(next);
            }
        };

        const handleScroll = () => {
            if (tickRef.current !== null) return;
            tickRef.current = requestAnimationFrame(() => {
                updateSticky();
                tickRef.current = null;
            });
        };

        const handleResize = () => {
            adjustMenuBackground();
        };

        updateSticky();
        adjustMenuBackground();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        const timeoutId = setTimeout(() => adjustMenuBackground(), 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (tickRef.current !== null) cancelAnimationFrame(tickRef.current);
            clearTimeout(timeoutId);
        };
    }, [offset, adjustMenuBackground]);

    useEffect(() => {
        adjustMenuBackground();
    }, [isSticky, adjustMenuBackground]);

    return { isSticky, headerFullWidth, adjustMenuBackground, headerRef };
};

export default useStickyHeader;
