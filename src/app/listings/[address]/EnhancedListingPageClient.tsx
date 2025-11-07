"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import { ListingData } from '@/lib/listing-data';

interface EnhancedListingPageClientProps {
  listing: ListingData;
  googleMapsApiKey?: string;
}

export default function EnhancedListingPageClient({ listing, googleMapsApiKey }: EnhancedListingPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');


  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Check if listing has floor plans
  const hasFloorPlans = (listing.floorPlans && listing.floorPlans.length > 0) || !!listing.floorPlanUrl;

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = hasFloorPlans 
        ? ['hero', 'gallery', 'videos', 'floor-plans', 'location']
        : ['hero', 'gallery', 'videos', 'location'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasFloorPlans]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'videos', label: 'Videos' },
    ...(hasFloorPlans ? [{ id: 'floor-plans', label: 'Floor Plans' }] : []),
    { id: 'location', label: 'Location' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Contact Strip */}
      <div className="fixed w-full top-0 z-50">
        <div className="bg-gray-900 text-white py-1 px-2 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-row justify-between items-center text-xs sm:text-sm">
            {/* Contact Details */}
            <div className="flex flex-row items-center space-x-4 sm:space-x-4">
              <div className="flex  space-x-2 font-montserrat">
                <span className="hidden sm:inline">📞</span>
                <a href="tel: (416) 419-9689" className="hover:text-blue-300 transition-colors">
                  (416) 419-9689
                </a>
              </div>
              <div className="flex space-x-2 font-montserrat">
                <span className="hidden sm:inline">✉️</span>
                <a href="mailto:contact@brightone.ca" className="hover:text-blue-300 transition-colors">
                  contact@brightone.ca
                </a>
              </div>
            </div>
            {/* Social Media Links */}
            <div className="flex items-center space-x-2">
              <a href="https://www.facebook.com/BrightOneInc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/brightoneinc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="https://in.pinterest.com/brightOneInc/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/brightoneInc/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>
              <a href="https://youtube.com/@brightoneca" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* One-Page Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={listing.images[0]?.src || '/meta-header.png'}
              alt={listing.images[0]?.alt || listing.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {listing.title}
                </h1>
                <p className="text-2xl md:text-3xl mb-8 text-white/90">
                  {listing.address}
                </p>
                {listing.id !== '13151-lakeridge-road' && (
                  <div className="flex flex-wrap gap-6 text-white">
                    <div className="flex items-center gap-8 text-xl">
                      <span>{listing.bedrooms} bed</span>
                      <span>{listing.bathrooms} bath</span>
                      <span>{listing.squareFootage.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <button
                    onClick={() => scrollToSection('gallery')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Property Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore every corner of this beautiful property through our professional photography
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listing.images && listing.images.length > 0 ? (
                listing.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group relative"
                    onClick={() => openModal(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      onError={(e) => {
                        console.error('Image failed to load:', image.src, e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', image.src);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No images available</p>
                  <p className="text-gray-400 text-sm mt-2">Images: {listing.images?.length || 0}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section id="videos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Property Videos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take a virtual tour and see the property in motion
              </p>
            </div>

            {/* Walkthrough Video - Full Width */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 text-center">Property Walkthrough</h3>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  {listing.walkthroughVideoUrl ? (
                    <iframe
                      src={listing.walkthroughVideoUrl}
                      title="Property Walkthrough"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Video coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floor Plans Section - Only show if floor plans exist */}
        {(listing.floorPlans && listing.floorPlans.length > 0) || listing.floorPlanUrl ? (
          <section id="floor-plans" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Floor Plans
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore the layout and flow of this beautiful home
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                {listing.floorPlans && listing.floorPlans.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {listing.floorPlans.map((floorPlan, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                        <Image
                          src={floorPlan.src}
                          alt={floorPlan.alt}
                          width={600}
                          height={450}
                          className="w-full h-auto rounded-lg mb-4"
                        />
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {floorPlan.alt}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {floorPlan.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : listing.floorPlanUrl ? (
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <Image
                      src={listing.floorPlanUrl}
                      alt="Floor Plan"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* Location Section */}
        <section id="location" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the neighborhood and surrounding amenities
              </p>
            </div>

            {/* Google Maps - Full Width */}
            <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
              {googleMapsApiKey ? (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(listing.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg font-semibold mb-2">Google Maps API key not configured</p>
                    <p className="text-gray-500 text-sm mb-4">Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables</p>
                    <div className="text-left bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-xs text-gray-600 font-mono mb-2">To fix this:</p>
                      <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file</li>
                        <li>Rebuild the Docker container</li>
                        <li>Restart the application</li>
                      </ol>
                    </div>
                    <div className="mt-4">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-300"
            onClick={closeModal}
          />
          
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

            {/* Image */}
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              <Image
                src={listing.images[currentImageIndex].src}
                alt={listing.images[currentImageIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
              <h3 className="text-white text-lg font-bold mb-1">
                {listing.images[currentImageIndex].caption || listing.images[currentImageIndex].alt}
              </h3>
              <p className="text-white/80 text-sm">
                {currentImageIndex + 1} of {listing.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

