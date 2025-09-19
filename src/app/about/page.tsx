import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Image from 'next/image';
import StoryImage from '@/assets/images/about.jpg';
import servicebg from '@/assets/images/service-bg-2.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[50vh] sm:h-[70vh] pt-20 sm:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={servicebg.src}
            alt="About BrightOne Real Estate Photography"
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
              <span className="bright-text-shadow-dark"> Story</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-montserrat">
              Professional real estate photography and marketing solutions with a passion for excellence
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src={StoryImage}
                alt="BrightOne real estate photography"
                fill
                priority
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 text-white/90 text-sm sm:text-lg leading-relaxed font-montserrat">
              <p>At BrightOne, our mission is simple: to help real estate professionals and property owners showcase their listings in the best possible light. In today&apos;s competitive market, outstanding visuals are more than just marketing tools — they&apos;re essential to capturing attention, building trust, and driving results.</p>
              <p>What sets BrightOne apart is the combination of technical expertise, creative design, and a deep appreciation for storytelling. With a foundation built on over a decade of professional experience in technology and design, our approach blends precision, innovation, and artistry to deliver visuals that make an impact.</p>
              <p>We specialize in real estate photography, virtual tours, and digital media services that highlight each property&apos;s unique features and character. From crisp, polished images to immersive virtual experiences, every project is handled with the same commitment to quality, consistency, and client success.</p>
              <p>BrightOne is more than a photography service — it&apos;s a trusted partner for real estate professionals and property owners who want their listings to stand out, sell faster, and leave a lasting impression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-800">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-heading">
                <span className="bright-text-shadow-dark">Why Choose</span> <span className="bright-text-shadow text-black">Us?</span>
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-white/80 font-montserrat max-w-3xl mx-auto">
                We combine technical expertise with creative vision to deliver exceptional results that help your properties stand out in the market.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-semibold text-white mb-2 sm:mb-3 font-heading">Professional Quality</h4>
                    <p className="text-white/80 text-xs sm:text-lg font-montserrat">State-of-the-art equipment and experienced photographers ensure the highest quality results that make your properties shine.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-semibold text-white mb-2 sm:mb-3 font-heading">Fast Turnaround</h4>
                    <p className="text-white/80 text-xs sm:text-lg font-montserrat">Quick delivery times to keep your listings fresh and competitive in the fast-paced real estate market.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-semibold text-white mb-2 sm:mb-3 font-heading">Competitive Pricing</h4>
                    <p className="text-white/80 text-xs sm:text-lg font-montserrat">Affordable packages designed to fit any budget while maintaining professional quality and exceptional service.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-600">
                <h4 className="text-md sm:text-lg font-bold text-white mb-4 sm:mb-6 font-heading">Our Commitment</h4>
                <p className="text-white/90 mb-6 sm:mb-8 text-xs sm:text-lg lg:text-xl font-montserrat leading-relaxed">
                  We&apos;re committed to providing exceptional service and results that help our clients succeed. Every project is approached with attention to detail and a focus on delivering value.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full mr-3 sm:mr-4"></div>
                    <span className="text-white text-xs sm:text-base lg:text-lg font-montserrat">High quality and on time delivery</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full mr-3 sm:mr-4"></div>
                    <span className="text-white text-xs sm:text-base lg:text-lg font-montserrat">Professional equipment and software</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full mr-3 sm:mr-4"></div>
                    <span className="text-white text-xs sm:text-base lg:text-lg font-montserrat">Satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Properties Photographed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24hr</div>
              <div className="text-gray-600">Average Turnaround</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}

