import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import VirtualStagingSection from '../components/VirtualStagingSection';
import Image from 'next/image';
import rePhoto1 from '@/assets/images/re-photo-1.jpg';
import servicebg from '@/assets/images/service-bg-2.jpg';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[70vh] pt-60">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={servicebg.src}
            alt="Professional Real Estate Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Our</span>
              <span className="bright-text-shadow-dark"> Services</span>
            </h1>
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              Professional real estate marketing solutions to help you sell properties faster and for more money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary font-light border-x-0 border-y-2 border-white">
                Get In Touch
              </a>
              <a href="/booking" className="btn-secondary font-light">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Photography Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 w-full">
            {/* Left Side - Hero Image with Overlay */}
            <div className="relative order-1 lg:order-1">
              <Image src={rePhoto1.src} alt="Real Estate Photography" width={800} height={600} className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover rounded-lg lg:rounded-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg lg:rounded-none"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 xl:p-12">
                <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold uppercase leading-tight mb-4 md:mb-6">
                  PROFESSIONAL REAL ESTATE PHOTOGRAPHY THAT SELLS PROPERTIES FASTER
                </h2>
                <Link href={'/booking'} className="btn-primary font-light bg-transparent text-sm md:text-base lg:text-lg py-3 px-6 md:py-4 md:px-8">
                  Book Now
                </Link>
              </div>
            </div>
            
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-2">
              {/* Card 1 - Interior Photography */}
              <div className="bg-gray-800 p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg lg:rounded-none border-b border-gray-700 lg:border-b-0 lg:border-r-0">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 md:mb-6 mx-auto">
                    <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold uppercase mb-3 md:mb-4">INTERIOR PHOTOGRAPHY</h3>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed">
                    Professional interior shots that showcase every room&apos;s potential with perfect lighting and composition to create lasting impressions.
                  </p>
                </div>
              </div>

              {/* Card 2 - Exterior Photography */}
              <div className="bg-gray-800 p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg lg:rounded-none border-b border-gray-700 lg:border-b-0 lg:border-r-0">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 md:mb-6 mx-auto">
                    <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold uppercase mb-3 md:mb-4">DRONE & EXTERIOR PHOTOGRAPHY</h3>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed">
                    Professional drone photography that captures stunning aerial views and unique perspectives of your property.
                  </p>
                </div>
              </div>

              {/* Card 3 - HDR & Editing */}
              <div className="bg-gray-800 p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg lg:rounded-none">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 md:mb-6 mx-auto">
                    <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h6a1 1 0 001-1V4H7z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold uppercase mb-3 md:mb-4">HDR & PROFESSIONAL EDIT</h3>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed">
                    Advanced HDR photography and professional editing to ensure perfect lighting and color balance in every shot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Staging Section */}
      <VirtualStagingSection />

      <Footer />
    </div>
  );
}