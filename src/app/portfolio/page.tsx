import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Image from 'next/image';
import servicebg from '@/assets/images/service-bg-2.jpg';

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
              <a href="/booking" className="btn-secondary font-light font-montserrat text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Featured</span> <span className="text-gray-600">Work</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-montserrat">
              Discover our portfolio of stunning real estate photography and virtual staging projects
            </p>
          </div>

          {/* Portfolio Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Portfolio Item 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 sm:h-56 bg-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Coming Soon</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Luxury Real Estate</h3>
                <p className="text-gray-600 text-sm sm:text-base">Professional photography showcasing luxury properties</p>
              </div>
            </div>

            {/* Portfolio Item 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 sm:h-56 bg-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Coming Soon</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Virtual Staging</h3>
                <p className="text-gray-600 text-sm sm:text-base">Transform empty spaces into beautiful homes</p>
              </div>
            </div>

            {/* Portfolio Item 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 sm:h-56 bg-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <p className="text-gray-500 text-sm">Coming Soon</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Aerial Photography</h3>
                <p className="text-gray-600 text-sm sm:text-base">Stunning drone shots from unique perspectives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Portfolio</span> <span className="bright-text-shadow-dark">Coming Soon</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed font-montserrat max-w-3xl mx-auto">
              We're curating our best work to showcase the quality and creativity of our real estate photography and virtual staging services.
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
              <a href="/booking" className="btn-secondary text-white bg-gray-800 font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
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