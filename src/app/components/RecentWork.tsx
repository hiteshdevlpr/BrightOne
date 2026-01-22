"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import service1 from '@/assets/images/portfolio-1.jpg';
import service2 from '@/assets/images/portfolio-2.jpg';
import service3 from '@/assets/images/345_Park_Road_S_Oshawa-50.jpg';
import service4 from '@/assets/images/345_Park_Road_S_Oshawa-62.jpg';
import service5 from '@/assets/images/345_Park_Road_S_Oshawa-63.jpg';
import service6 from '@/assets/images/345_Park_Road_S_Oshawa-66.jpg';
import service9 from '@/assets/images/345_Park_Road_S_Oshawa-69.jpg';
import service7 from '@/assets/images/portfolio-10.jpg';
import service8 from '@/assets/images/portfolio-6.jpg';
import service10 from '@/assets/images/portfolio-11.jpg';
import service11 from '@/assets/images/portfolio-12.jpg';
import service12 from '@/assets/images/portfolio-13.jpg';
import service13 from '@/assets/images/portfolio-14.jpg';
import service14 from '@/assets/images/13151_LAKERIDGE-9.jpg';
import service15 from '@/assets/images/13151_LAKERIDGE-21.jpg';
import service16 from '@/assets/images/13151_LAKERIDGE-24.jpg';
import service17 from '@/assets/images/portfolio-18.jpg';
import service18 from '@/assets/images/portfolio-19.jpg';
import service19 from '@/assets/images/13151_LAKERIDGE-34.jpg';
import service20 from '@/assets/images/portfolio-21.jpg';
import service21 from '@/assets/images/portfolio-22.jpg';
import service22 from '@/assets/images/portfolio-23.jpg';
import service23 from '@/assets/images/portfolio-24.jpg';
import service24 from '@/assets/images/portfolio-25.jpg';
import greengroveCover from '@/assets/images/13151-cover.jpg';

interface RecentWorkItem {
  src: string;
  alt: string;
  title: string;
  type: 'image' | 'video' | 'youtube';
  videoSrc?: string;
  videoId?: string;
}

const recentWorkItems: RecentWorkItem[] = [
  { src: service1.src, alt: "Real Estate Photography", title: "Luxury Home Interior", type: "image" },
  { src: service20.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service21.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: greengroveCover.src, alt: "GreenGrove Whitby Property Video", title: "GreenGrove Whitby - Property Tour", type: "youtube", videoId: "YpQoC9xgUF4" },
  { src: service14.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service16.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service17.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service19.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service12.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service7.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service9.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service15.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service10.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service13.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service18.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service5.src, alt: "Virtual Staging After", title: "Staged Living Room", type: "image" },
  { src: service23.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service2.src, alt: "Professional Photography", title: "Modern Living Space", type: "image" },
  { src: service3.src, alt: "Professional Photography", title: "Modern Living Space", type: "image" },
  { src: service24.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service6.src, alt: "Virtual Staging Before", title: "Empty Space", type: "image" },
  { src: service4.src, alt: "Real Estate Staging", title: "Contemporary Kitchen", type: "image" },
  { src: service8.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
  { src: service11.src, alt: "Property Showcase", title: "Beautiful Home", type: "image" },
];

interface RecentWorkProps {
  isPortfolioPage?: boolean;
}

export default function RecentWork({ isPortfolioPage = false }: RecentWorkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsModalOpen(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setIsVideoPlaying(false);
          setCurrentImageIndex((prev) => 
            prev === 0 ? recentWorkItems.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          event.preventDefault();
          setIsVideoPlaying(false);
          setCurrentImageIndex((prev) => 
            prev === recentWorkItems.length - 1 ? 0 : prev + 1
          );
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsVideoPlaying(false);
  };

  const goToPrevious = () => {
    setIsVideoPlaying(false);
    setCurrentImageIndex((prev) => 
      prev === 0 ? recentWorkItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsVideoPlaying(false);
    setCurrentImageIndex((prev) => 
      prev === recentWorkItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
            <span className='bright-text-shadow-dark'>Recent </span>
            <span className="text-black">Work</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our latest projects and see how we bring properties to life through professional photography and marketing
          </p>
        </div>

        {/* 4x4 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-1">
          {recentWorkItems.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => openModal(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    {item.type === 'video' || item.type === 'youtube' ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    )}
                  </div>
                  {/* <p className="text-white text-xs sm:text-sm font-medium">Click to view</p> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-row gap-2 sm:gap-4 justify-center">
            {!isPortfolioPage && (
              <a href="/portfolio" className="btn-primary font-light  font-montserrat text-xs sm:text-sm md:text-base px-2 sm:px-4 md:px-6 py-1.5 sm:py-3 md:py-4">
                View Full Portfolio
              </a>
            )}
            <a href="/booking" className="btn-secondary border-y-2 border-x-0 bg-white font-light font-montserrat text-xs sm:text-sm md:text-base px-2 sm:px-4 md:px-6 py-1.5 sm:py-3 md:py-4">
              Book Your Shoot
            </a>
            {isPortfolioPage && (
              <a href="/contact" className="btn-primary font-light  font-montserrat text-xs sm:text-sm md:text-base px-2 sm:px-4 md:px-6 py-1.5 sm:py-3 md:py-4">
                Get In Touch
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-20 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 z-20 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content Container */}
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              {recentWorkItems[currentImageIndex].type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {!isVideoPlaying ? (
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Image
                        src={recentWorkItems[currentImageIndex].src}
                        alt={recentWorkItems[currentImageIndex].alt}
                        width={1200}
                        height={800}
                        className="max-w-full max-h-full object-contain"
                        priority
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                          <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={recentWorkItems[currentImageIndex].videoSrc}
                      controls
                      autoPlay
                      className="max-w-full max-h-full"
                      onEnded={() => setIsVideoPlaying(false)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : recentWorkItems[currentImageIndex].type === 'youtube' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {!isVideoPlaying ? (
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Image
                        src={recentWorkItems[currentImageIndex].src}
                        alt={recentWorkItems[currentImageIndex].alt}
                        width={1200}
                        height={800}
                        className="max-w-full max-h-full object-contain"
                        priority
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                          <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${recentWorkItems[currentImageIndex].videoId}?autoplay=1&rel=0`}
                      title={recentWorkItems[currentImageIndex].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="max-w-full max-h-full"
                    />
                  )}
                </div>
              ) : (
                <Image
                  src={recentWorkItems[currentImageIndex].src}
                  alt={recentWorkItems[currentImageIndex].alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              )}
            </div>

            {/* Content Info */}
            {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
              <h3 className="text-white text-lg font-bold mb-1">
                {recentWorkItems[currentImageIndex].title}
              </h3>
              <p className="text-white/80 text-sm">
                {currentImageIndex + 1} of {recentWorkItems.length}
              </p>
            </div> */}
          </div>
        </div>
      )}
    </section>
  );
}
