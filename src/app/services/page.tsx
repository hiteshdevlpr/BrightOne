import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import rePhoto1 from '@/assets/images/re-photo-1.jpg';
import photo1 from '@/assets/images/service-1.jpg';
import photo2 from '@/assets/images/service-2.jpg';
import photo3 from '@/assets/images/service-3.jpg';

export default function ServicesPage() {
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
              <div className="flex-1 bg-gray-800  m-8 ml-0 p-8 lg:p-12 border-b border-gray-700">
                <div className="flex items-center text-center justify-between h-full">
                  <div className="flex-1">
                    <div className="w-12 h-12 mb-6 inline-block">
                      <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold uppercase mb-4">EXTERIOR PHOTOGRAPHY</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Stunning exterior shots that highlight your property's curb appeal and architectural features from multiple angles.
                    </p>
                  </div>
                  {/* <button className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center ml-4 flex-shrink-0 hover:bg-yellow-300 transition-colors">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button> */}
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

        {/* Airbnb Photography */}
        <div className="min-h-screen flex items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
            <div className="flex items-center justify-center p-12 lg:p-16 order-2 lg:order-1">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Airbnb Photography</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Stunning photography that makes your Airbnb listing irresistible to potential guests and maximizes bookings.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Lifestyle & amenity shots</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Neighborhood & location highlights</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Platform-optimized formats</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Quick turnaround for listings</span>
                  </li>
                </ul>
                <button className="btn-primary">Get Started</button>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <Image src={photo2.src} alt="Airbnb Photography" width={800} height={600} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Virtual Staging */}
        <div className="min-h-screen flex items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
            <div className="relative">
              <Image src={photo3.src} alt="Virtual Staging" width={800} height={600} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center p-12 lg:p-16">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Virtual Staging</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform empty spaces into beautifully furnished rooms that help buyers visualize the potential of your property.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Professional furniture placement</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Multiple design styles</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">High-resolution output</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Fast 24-48 hour delivery</span>
                  </li>
                </ul>
                <button className="btn-primary">View Examples</button>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Tours and Floor Plans */}
        <div className="min-h-screen flex items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
            <div className="flex items-center justify-center p-12 lg:p-16 order-2 lg:order-1">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">3D Tours & Floor Plans</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Interactive 3D tours and detailed floor plans that allow potential buyers to explore every corner of your property.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">360° virtual tours</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Interactive floor plans</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Mobile optimized viewing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Easy sharing & embedding</span>
                  </li>
                </ul>
                <button className="btn-primary">See Demo</button>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <Image src={photo1.src} alt="3D Tours and Floor Plans" width={800} height={600} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Aerial Photoshoots */}
        <div className="min-h-screen flex items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
            <div className="relative">
              <Image src={photo2.src} alt="Aerial Photoshoots" width={800} height={600} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center p-12 lg:p-16">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Aerial Photoshoots</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Breathtaking aerial photography that showcases your property from unique perspectives and highlights its surroundings.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Drone photography & videography</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Property & neighborhood views</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Licensed & insured operations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Weather-optimized scheduling</span>
                  </li>
                </ul>
                <button className="btn-primary">Book Session</button>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Videos */}
        <div className="min-h-screen flex items-center bg-gray-50">
          <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
            <div className="flex items-center justify-center p-12 lg:p-16 order-2 lg:order-1">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Cinematic Videos</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Cinematic video tours that bring your property to life and engage potential buyers on an emotional level.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Cinematic property tours</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Professional editing & music</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Social media ready formats</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Multiple length options</span>
                  </li>
                </ul>
                <button className="btn-primary">Watch Samples</button>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <Image src={photo3.src} alt="Cinematic Videos" width={800} height={600} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

