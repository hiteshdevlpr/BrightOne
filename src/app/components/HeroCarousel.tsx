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

  const currentSection = carouselSections[currentIndex];

  const isFirstSection = currentIndex === 0;
  const isSecondSection = currentIndex === 1;

  return (
    <div className={`relative w-full h-screen overflow-hidden ${isFirstSection ? 'bg-white' : ''}`}>

      {/* Vertical Line Markers */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
        {carouselSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1 h-12 transition-all duration-300 ${
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
          // First section: Left image, right text layout
          <div className="w-full max-w-7xl mx-auto px-4 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch h-full">
              {/* Left side - Image */}
              <div className="order-2 lg:order-1 flex items-center">
                <div className="relative top-10 w-full h-[60vh] lg:h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={heroSlide1.src}
                    alt={currentSection.title}
                    fill
                    className="object-fit"
                    priority
                  />
                </div>
              </div>

              {/* Right side - Text content */}
              <div className="order-1 lg:order-2 text-left flex flex-col justify-center">
                {/* Subtitle with flip animation */}
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light tracking-wide">
                    <span className="inline-block ">
                      {currentSection.subtitle}
                    </span>
                  </h2>
                </div>

                {/* Main Title with flip animation */}
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                    <span className=" shimmer-animation">
                      {currentSection.title}
                    </span>
                  </h1>
                </div>

                {/* Description with flip animation */}
                <div className="mb-8">
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
                    <span className="inline-block">
                      {currentSection.description}
                    </span>
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex justify-start">
                  <Link 
                    href={currentSection.ctaLink}
                    className="btn-secondary font-light font-montserrat text-base sm:text-lg lg:text-xl px-4 sm:px-4 py-2 border-y-2 border-x-0"
                  >
                    {currentSection.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : isSecondSection ? (
          // Second section: 3 equal sections - images on sides, text in middle - FULL WIDTH
          <div className="w-full h-full">
            <div className="grid grid-cols-3 h-full">
              {/* Left side - Image */}
              <div className="relative h-full">
                <Image
                  src={heroSlide2a.src}
                  alt="Virtual Staging Before"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Middle - Text content */}
              <div className="text-center flex flex-col justify-center px-4 bg-gray-800">
                {/* Subtitle */}
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                    <span className="inline-block">
                      {currentSection.subtitle}
                    </span>
                  </h2>
                </div>

                {/* Main Title */}
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    <span className="shimmer-animation">
                      {currentSection.title}
                    </span>
                  </h1>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                    <span className="inline-block">
                      {currentSection.description}
                    </span>
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <Link 
                    href={currentSection.ctaLink}
                    className="btn-primary font-light font-montserrat text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3"
                  >
                    {currentSection.ctaText}
                  </Link>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="relative h-full">
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
          // Other sections: Centered text overlay
          <div className="text-center px-4 max-w-4xl">
            {/* Subtitle with flip animation */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                <span className="inline-block flip-animation">
                  {currentSection.subtitle}
                </span>
              </h2>
            </div>

            {/* Main Title with flip animation */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="inline-block flip-animation-delay shimmer-animation">
                  {currentSection.title}
                </span>
              </h1>
            </div>

            {/* Description with flip animation */}
            <div className="mb-8">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
                <span className="inline-block flip-animation-delay-2">
                  {currentSection.description}
                </span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link 
                href={currentSection.ctaLink}
                className="btn-primary font-light font-montserrat text-base sm:text-lg lg:text-xl px-6 sm:px-8 py-3 sm:py-4 flip-animation-delay-3"
              >
                {currentSection.ctaText}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Slide Indicators (Optional - bottom dots) */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {carouselSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? (isFirstSection ? 'bg-black' : 'bg-white')
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
