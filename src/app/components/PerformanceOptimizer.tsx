'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/meta-header.png',
        '/portfolio-1.jpg',
        '/portfolio-2.jpg',
        '/portfolio-3.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images loading
    const optimizeImageLoading = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Add performance monitoring
    const monitorPerformance = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (perfData) {
              // Log Core Web Vitals
              const metrics = {
                FCP: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                LCP: perfData.loadEventEnd - perfData.loadEventStart,
                CLS: 0, // Would need to be measured separately
                FID: 0, // Would need to be measured separately
              };
              
              // Send to analytics if needed
              if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                  event_category: 'Performance',
                  event_label: 'Core Web Vitals',
                  value: Math.round(metrics.FCP),
                  custom_map: {
                    'metric_1': 'FCP',
                    'metric_2': 'LCP'
                  }
                });
              }
            }
          }, 0);
        });
      }
    };

    preloadCriticalResources();
    optimizeImageLoading();
    monitorPerformance();
  }, []);

  return null;
}
