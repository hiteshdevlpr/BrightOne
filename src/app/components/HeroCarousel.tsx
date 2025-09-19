'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import heroSlide1 from '@/assets/images/hero-slide-1.jpg';
import heroSlide2a from '@/assets/images/hero-slide-2a.jpg';
import heroSlide2b from '@/assets/images/hero-slide-2b.jpg';

interface CarouselSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const carouselSections: CarouselSection[] = [
  {
    id: 1,
    title: "Real Estate Photography",
    subtitle: "Professional Property Showcase",
    description: "Transform your listings with stunning photography that captures every detail and creates an emotional connection with potential buyers.",
    image: "/hero-slide-1.jpg",
    ctaText: "Book Photography",
    ctaLink: "/booking"
  },
  {
    id: 2,
    title: "Virtual Staging",
    subtitle: "Bring Empty Spaces to Life",
    description: "Showcase the potential of vacant properties with our expert virtual staging services that help buyers envision their dream home.",
    image: "/staging-after.jpg",
    ctaText: "View Staging",
    ctaLink: "/services"
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSections.length);
    }, 50000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - go to next slide
      const nextIndex = (currentIndex + 1) % carouselSections.length;
      goToSlide(nextIndex);
    } else if (isRightSwipe) {
      // Swipe right - go to previous slide
      const prevIndex = currentIndex === 0 ? carouselSections.length - 1 : currentIndex - 1;
      goToSlide(prevIndex);
    }
  };

  const currentSection = carouselSections[currentIndex];

  const isFirstSection = currentIndex === 0;
  const isSecondSection = currentIndex === 1;

  return (
    <div 
      className={`relative w-full h-[85vh] md:h-screen overflow-hidden ${isFirstSection ? 'bg-white' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {/* Vertical Line Markers - Hidden on mobile */}
      <div className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 hidden sm:flex flex-col gap-4">
        {carouselSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1 h-8 sm:h-12 transition-all duration-300 ${
              index === currentIndex 
                ? (isFirstSection ? 'bg-black shadow-lg' : 'bg-white shadow-lg')
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {isFirstSection ? (
          // First section: Mobile overlay layout, desktop side-by-side
          <div className="w-full h-full">
            {/* Mobile: Full-height image with text overlay */}
            <div className="lg:hidden relative w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={heroSlide1.src}
                  alt={currentSection.title}
                  fill
                  className="object-contain"
                  priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Text overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 py-8 z-10">
                  {/* Gray overlay behind text content */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] h-[24%] bg-gray-900/50 rounded-lg"></div>
                  {/* Subtitle */}
                  <div className="mb-2 sm:mb-3 relative z-20">
                    <h2 className="text-xs sm:text-sm text-white font-light tracking-wide">
                      <span className="inline-block">
                        {currentSection.subtitle}
                      </span>
                    </h2>
                  </div>

                  {/* Main Title */}
                  <div className="mb-3 sm:mb-4 relative z-20">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                      <span className="shimmer-animation">
                        {currentSection.title}
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <div className="mb-4 sm:mb-6 relative z-20">
                    <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-sm">
                      <span className="inline-block">
                        {currentSection.description}
                      </span>
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-center relative z-20">
                    <Link 
                      href={currentSection.ctaLink}
                      className="btn-secondary font-light font-montserrat text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-y-2 border-x-0 bg-white/90 text-black hover:bg-white"
                    >
                      {currentSection.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Side-by-side layout */}
            <div className="hidden lg:block w-full max-w-7xl mx-auto px-6 lg:px-8 h-full">
              <div className="grid grid-cols-2 gap-12 items-center h-full">
                {/* Left side - Image */}
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-[70vh] rounded-lg overflow-hidden">
                    <Image
                      src={heroSlide1.src}
                      alt={currentSection.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Right side - Text content */}
                <div className="text-left flex flex-col justify-center px-4">
                  {/* Subtitle */}
                  <div className="mb-4">
                    <h2 className="text-lg xl:text-xl text-gray-600 font-light tracking-wide">
                      <span className="inline-block">
                        {currentSection.subtitle}
                      </span>
                    </h2>
                  </div>

                  {/* Main Title */}
                  <div className="mb-6">
                    <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-black leading-tight">
                      <span className="shimmer-animation">
                        {currentSection.title}
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-lg xl:text-xl text-gray-700 font-light leading-relaxed">
                      <span className="inline-block">
                        {currentSection.description}
                      </span>
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-start">
                    <Link 
                      href={currentSection.ctaLink}
                      className="btn-secondary font-light font-montserrat text-xs lg:text-lg px-3 md:px-6 py-1.5 md:py-3 border-y-2 border-x-0"
                    >
                      {currentSection.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isSecondSection ? (
          // Second section: Mobile-optimized layout
          <div className="w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Mobile: Text content first */}
              <div className="text-center flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gray-800 order-1 md:order-2 py-6 sm:py-8 md:py-0">
                {/* Subtitle */}
                <div className="mb-2 sm:mb-3 lg:mb-4">
                  <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-light tracking-wide">
                    <span className="inline-block">
                      {currentSection.subtitle}
                    </span>
                  </h2>
                </div>

                {/* Main Title */}
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                    <span className="shimmer-animation">
                      {currentSection.title}
                    </span>
                  </h1>
                </div>

                {/* Description */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 font-light leading-relaxed max-w-md mx-auto">
                    <span className="inline-block">
                      {currentSection.description}
                    </span>
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <Link 
                    href="/services#virtual-staging"
                    className="btn-primary font-light font-montserrat text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3"
                  >
                    {currentSection.ctaText}
                  </Link>
                </div>
              </div>

              {/* Mobile: Before image second */}
              <div className="relative h-[20vh] sm:h-[25vh] md:h-full order-2 md:order-1">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold bg-black/50 px-2 py-1 rounded">BEFORE</span>
                </div>
                <Image
                  src={heroSlide2a.src}
                  alt="Virtual Staging Before"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Mobile: After image third */}
              <div className="relative h-[20vh] sm:h-[25vh] md:h-full order-3">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold bg-black/50 px-2 py-1 rounded">AFTER</span>
                </div>
                <Image
                  src={heroSlide2b.src}
                  alt="Virtual Staging After"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        ) : (
          // Other sections: Mobile-optimized centered text overlay
          <div className="text-center px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8 sm:py-12 lg:py-0">
            {/* Subtitle */}
            <div className="mb-2 sm:mb-3 lg:mb-4">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-light tracking-wide">
                <span className="inline-block flip-animation">
                  {currentSection.subtitle}
                </span>
              </h2>
            </div>

            {/* Main Title */}
            <div className="mb-3 sm:mb-4 lg:mb-6">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight">
                <span className="inline-block flip-animation-delay shimmer-animation">
                  {currentSection.title}
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
                <span className="inline-block flip-animation-delay-2">
                  {currentSection.description}
                </span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link 
                href={currentSection.ctaLink}
                className="btn-primary font-light font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-3 sm:px-6 md:px-8 py-1.5 sm:py-3 md:py-4 w-full sm:w-auto flip-animation-delay-3"
              >
                {currentSection.ctaText}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Slide Indicators - enhanced bottom dots */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 sm:hidden">
        {carouselSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe hint */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 sm:hidden">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Swipe to explore</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
