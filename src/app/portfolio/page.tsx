import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RecentWork from '../components/RecentWork';
import Image from 'next/image';
import servicebg from '@/assets/images/service-bg-2.jpg';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Real Estate Photography Portfolio | Stunning Property Photos | BrightOne",
  description: "View our portfolio of stunning real estate photography, virtual staging, and property marketing work. See examples of luxury properties, virtual staging transformations, and professional property photos across the GTA.",
  keywords: "real estate photography portfolio, property photos, virtual staging examples, luxury property photography, GTA real estate photos, professional property marketing, before after staging",
  openGraph: {
    title: "Real Estate Photography Portfolio | Stunning Property Photos | BrightOne",
    description: "View our portfolio of stunning real estate photography, virtual staging, and property marketing work. See examples of luxury properties, virtual staging transformations, and professional property photos across the GTA.",
    type: "website",
    url: "https://brightone.ca/portfolio",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "Real Estate Photography Portfolio - BrightOne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Photography Portfolio | Stunning Property Photos | BrightOne",
    description: "View our portfolio of stunning real estate photography, virtual staging, and property marketing work. See examples of luxury properties, virtual staging transformations, and professional property photos across the GTA.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[60vh] sm:h-[70vh] pt-20 sm:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={servicebg.src}
            alt="Professional Portfolio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Our</span>
              <span className="bright-text-shadow-dark"> Portfolio</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Stunning real estate photography and virtual staging that showcases properties in their best light
            </p>
          
            <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="/contact" className="btn-primary font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Get In Touch
              </a>
              <a href="/booking/real-estate" className="btn-secondary font-light font-montserrat text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <RecentWork isPortfolioPage={true} />

      {/* Coming Soon Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Portfolio</span> <span className="bright-text-shadow-dark">Coming Soon</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed font-montserrat max-w-3xl mx-auto">
              We&apos;re curating our best work to showcase the quality and creativity of our real estate photography and virtual staging services.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">Luxury Properties</span>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">Virtual Staging</span>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">3D Tours</span>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">Aerial Views</span>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">Airbnb Properties</span>
              </div>
              <div className="flex items-center justify-center bg-gray-700 rounded p-3 sm:p-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-white text-xs sm:text-sm font-montserrat">Cinematic Videos</span>
              </div>
            </div>
            
            <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="/contact" className="btn-primary font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Get In Touch
              </a>
              <a href="/booking/real-estate" className="btn-secondary text-white bg-gray-800 font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Book A Session
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}