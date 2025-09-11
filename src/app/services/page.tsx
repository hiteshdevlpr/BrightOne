import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import photo1 from '@/assets/images/service-1.jpg';
import photo2 from '@/assets/images/service-2.jpg';
import photo3 from '@/assets/images/service-3.jpg';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br h-screen overflow-hidden from-blue-50 to-purple-50 pt-20">
        <div className="bg-video">
          <video src="/videos/hero-bg.mp4" autoPlay muted loop className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-65"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className='gradient-text-gray'>Our Professional</span><br />
              <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive real estate marketing solutions to help your properties stand out in the market
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-48">
        {/* Real Estate Photography */}
        <div className="min-h-96 flex w-full items-center bg-white">
          <div className="grid lg:grid-cols-2 gap-0 w-full min-h-96">
            <div className="relative">
              <Image src={photo1.src} alt="Real Estate Photography" width={800} height={600} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center p-12 lg:p-16">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Real Estate Photography</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Professional photography that showcases your property's best features and creates lasting impressions that drive sales.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Interior & exterior shots</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">HDR photography for perfect lighting</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">Professional editing & retouching</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">High-resolution deliverables</span>
                  </li>
                </ul>
                <button className="btn-primary">Learn More</button>
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

