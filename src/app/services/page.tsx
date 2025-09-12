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

        {/* Airbnb Photography - Hero Style */}
        <div className="flex w-full items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -right-8">
              {/* Card 1 - Lifestyle Shots */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 mr-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">LIFESTYLE SHOTS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Capturing the lifestyle and atmosphere that makes guests want to book your property for their perfect getaway.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Amenity Highlights */}
              <div className="flex-1 bg-gray-800 m-8 mr-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">AMENITY HIGHLIGHTS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Showcasing unique features and amenities that set your property apart and attract the right guests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Quick Delivery */}
              <div className="flex-1 text-center bg-gray-800 m-8 mr-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">QUICK DELIVERY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Fast turnaround times to get your listing live quickly and start receiving bookings immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Hero Image with Overlay */}
            <div className="relative right-8">
              <Image src={photo2.src} alt="Airbnb Photography" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">FEATURED SERVICE</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  AIRBNB PHOTOGRAPHY THAT MAXIMIZES BOOKINGS AND GUEST SATISFACTION
                </h2>
                <button className="btn-secondary">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Staging - Hero Style */}
        <div className="flex w-full items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Left Side - Hero Image with Overlay */}
            <div className="relative left-8">
              <Image src={photo3.src} alt="Virtual Staging" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">TRANSFORM SPACES</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  VIRTUAL STAGING THAT HELPS BUYERS VISUALIZE THEIR DREAM HOME
                </h2>
                <button className="btn-secondary">
                  View Examples
                </button>
              </div>
            </div>
            
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -left-8">
              {/* Card 1 - Furniture Placement */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 ml-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">FURNITURE PLACEMENT</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Professional furniture placement that maximizes space and creates inviting, functional room layouts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Design Styles */}
              <div className="flex-1 bg-gray-800 m-8 ml-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">DESIGN STYLES</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Multiple design styles from modern to traditional to match your target buyer's preferences and lifestyle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Fast Delivery */}
              <div className="flex-1 text-center bg-gray-800 m-8 ml-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">FAST DELIVERY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Quick 24-48 hour turnaround to get your staged photos ready for listing and marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Tours and Floor Plans - Hero Style */}
        <div className="flex w-full items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -right-8">
              {/* Card 1 - 360° Tours */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 mr-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">360° TOURS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Immersive 360-degree virtual tours that let buyers explore every room and angle of your property remotely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Interactive Floor Plans */}
              <div className="flex-1 bg-gray-800 m-8 mr-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">FLOOR PLANS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Detailed interactive floor plans that help buyers understand the layout and flow of your property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Mobile Optimized */}
              <div className="flex-1 text-center bg-gray-800 m-8 mr-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">MOBILE OPTIMIZED</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Seamless viewing experience across all devices with easy sharing and embedding capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Hero Image with Overlay */}
            <div className="relative right-8">
              <Image src={photo1.src} alt="3D Tours and Floor Plans" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">INTERACTIVE EXPERIENCE</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  3D TOURS & FLOOR PLANS THAT ENGAGE BUYERS FROM ANYWHERE
                </h2>
                <button className="btn-secondary">
                  See Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aerial Photoshoots - Hero Style */}
        <div className="flex w-full items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Left Side - Hero Image with Overlay */}
            <div className="relative left-8">
              <Image src={photo2.src} alt="Aerial Photoshoots" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">FROM ABOVE</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  AERIAL PHOTOGRAPHY THAT SHOWCASES YOUR PROPERTY'S FULL POTENTIAL
                </h2>
                <button className="btn-secondary">
                  Book Session
                </button>
              </div>
            </div>
            
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -left-8">
              {/* Card 1 - Drone Photography */}
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

              {/* Card 2 - Neighborhood Views */}
              <div className="flex-1 bg-gray-800 m-8 ml-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">NEIGHBORHOOD VIEWS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Showcasing the surrounding area and neighborhood context to help buyers understand the location's appeal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Licensed Operations */}
              <div className="flex-1 text-center bg-gray-800 m-8 ml-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">LICENSED OPERATIONS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Fully licensed and insured drone operations with weather-optimized scheduling for the best results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Videos - Hero Style */}
        <div className="flex w-full items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-row relative -right-8">
              {/* Card 1 - Property Tours */}
              <div className="flex-1 bg-gray-800 p-8 lg:p-12 m-8 mr-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">PROPERTY TOURS</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Cinematic property tours that showcase every room with smooth camera movements and professional storytelling.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Professional Editing */}
              <div className="flex-1 bg-gray-800 m-8 mr-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">PROFESSIONAL EDITING</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      High-quality editing with professional music and color grading to create emotionally engaging video content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Social Media Ready */}
              <div className="flex-1 text-center bg-gray-800 m-8 mr-0 p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h6a1 1 0 001-1V4H7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">SOCIAL MEDIA READY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Multiple format options optimized for social media platforms to maximize reach and engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Hero Image with Overlay */}
            <div className="relative right-8">
              <Image src={photo3.src} alt="Cinematic Videos" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">CINEMATIC EXPERIENCE</div>
                <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-6">
                  CINEMATIC VIDEOS THAT BRING YOUR PROPERTY TO LIFE
                </h2>
                <button className="btn-secondary">
                  Watch Samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

