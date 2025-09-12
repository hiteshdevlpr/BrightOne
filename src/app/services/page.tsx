'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import rePhoto1 from '@/assets/images/re-photo-1.jpg';
import photo1 from '@/assets/images/service-1.jpg';
import photo2 from '@/assets/images/service-2.jpg';
import photo3 from '@/assets/images/service-3.jpg';

export default function ServicesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: photo1.src,
      title: "Modern Luxury Home",
      description: "Stunning interior photography showcasing contemporary design"
    },
    {
      image: photo2.src,
      title: "Executive Condo",
      description: "Professional exterior shots highlighting architectural features"
    },
    {
      image: photo3.src,
      title: "Family Residence",
      description: "Warm and inviting spaces perfect for family living"
    },
    {
      image: rePhoto1.src,
      title: "Urban Loft",
      description: "Industrial chic design with modern amenities"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      

      {/* Services Section */}
      <section className="pt-48">
        {/* Real Estate Photography - Hero Style */}
        <div className=" flex w-full items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Left Side - Hero Image with Overlay */}
            <div className="relative left-8">
              <Image src={rePhoto1.src} alt="Real Estate Photography" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">LAST PROJECT</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  PROFESSIONAL REAL ESTATE PHOTOGRAPHY THAT SELLS PROPERTIES FASTER
                </h2>
                <button className="btn-secondary">
                  Book Now
                </button>
              </div>
            </div>
            
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -left-8">
              {/* Card 1 - Interior Photography */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 ml-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">INTERIOR PHOTOGRAPHY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Professional interior shots that showcase every room's potential with perfect lighting and composition to create lasting impressions.
                    </p>
                  </div>
                  {/* <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center ml-4 flex-shrink-0 hover:bg-yellow-300 transition-colors">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button> */}
                </div>
              </div>

              {/* Card 2 - Exterior Photography */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 ml-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">DRONE PHOTOGRAPHY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Professional drone photography that captures stunning aerial views and unique perspectives of your property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - HDR & Editing */}
              <div className="flex-1 text-center bg-gray-800  m-8 ml-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h6a1 1 0 001-1V4H7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">HDR & EDITING</h3>
                    <p className="text-white/80 text-lg  leading-relaxed mb-6">
                      Advanced HDR photography and professional editing to ensure perfect lighting and color balance in every shot.
                    </p>
                  </div>
                  {/* <button className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center ml-4 flex-shrink-0 hover:bg-yellow-300 transition-colors">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Work Slideshow */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Recent Work</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Showcasing our latest real estate photography projects that help properties sell faster
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Slideshow Container */}
              <div className="relative overflow-hidden rounded-md shadow-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                      <Image 
                        src={slide.image} 
                        alt="Recent Real Estate Photography" 
                        width={800} 
                        height={500} 
                        className="w-full h-96 object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                        <p className="text-white/90 text-lg">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                  onClick={prevSlide}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                  onClick={nextSlide}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button 
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white'
                      }`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mt-12">
                <button className="btn-primary">
                  VIEW ALL PROJECTS
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}

