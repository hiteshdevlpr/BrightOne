import AnimatedHeroText from './components/AnimatedHeroText';
import Image from 'next/image';
import rePhoto1 from '@/assets/images/re-photo-1.jpg';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import VirtualStagingSection from './components/VirtualStagingSection';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br overflow-hidden from-blue-50 to-purple-50 min-h-screen">
        <div className="absolute inset-0">
          <video src="/videos/hero-bg.mp4" autoPlay muted loop className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <AnimatedHeroText />
      </section>
      

      <section className="py-16 md:py-32 bg-gray-200">
        {/* Real Estate Photography - Hero Style */}
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-0 w-full">
            {/* Left Side - Hero Image with Overlay */}
            <div className="relative lg:left-8">
              <Image src={rePhoto1.src} alt="Real Estate Photography" width={800} height={600} className="w-full h-[400px] md:h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                {/* <div className="text-gray-200 text-sm uppercase tracking-wider font-semibold mb-4">LAST PROJECT</div> */}
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-tight mb-4 md:mb-6">
                  PROFESSIONAL REAL ESTATE PHOTOGRAPHY THAT SELLS PROPERTIES FASTER
                </h2>
                <Link href={'/booking'} className="btn-secondary text-sm md:text-lg py-3 px-6 md:py-4 md:px-8">
                  Book Now
                </Link>
              </div>
            </div>
            
            {/* Right Side - Three Service Cards */}
            <div className="flex flex-col md:flex-row lg:relative lg:-left-8">
              {/* Card 1 - Interior Photography */}
              <div className="flex-1 bg-gray-800 p-6 md:p-8 lg:p-12 m-4 md:m-8 md:ml-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold uppercase mb-3 md:mb-4">INTERIOR PHOTOGRAPHY</h3>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                      Professional interior shots that showcase every room&apos;s potential with perfect lighting and composition to create lasting impressions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Exterior Photography */}
              <div className="flex-1 bg-gray-800 p-6 md:p-8 lg:p-12 m-4 md:m-8 md:ml-0 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold uppercase mb-3 md:mb-4">DRONE & Exterior PHOTOGRAPHY</h3>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                      Professional drone photography that captures stunning aerial views and unique perspectives of your property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - HDR & Editing */}
              <div className="flex-1 text-center bg-gray-800 m-4 md:m-8 md:ml-0 p-6 md:p-8 lg:p-12">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h6a1 1 0 001-1V4H7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold uppercase mb-3 md:mb-4">HDR & professional edit</h3>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                      Advanced HDR photography and professional editing to ensure perfect lighting and color balance in every shot.
                    </p>
                  </div>
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