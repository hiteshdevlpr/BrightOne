import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AboutPage() {
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
              <span className='gradient-text-gray'>About</span><br />
              <span className="gradient-text">BrightOne.ca</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Professional real estate photography and virtual services to help you sell properties faster and for more money
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                BrightOne.ca was founded with a simple mission: to help real estate professionals and property owners showcase their listings in the best possible light. We believe that exceptional photography and virtual services are essential tools in today's competitive real estate market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Quality</h4>
                      <p className="text-gray-600">State-of-the-art equipment and experienced photographers ensure the highest quality results.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast Turnaround</h4>
                      <p className="text-gray-600">Quick delivery times to keep your listings fresh and competitive in the market.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Competitive Pricing</h4>
                      <p className="text-gray-600">Affordable packages designed to fit any budget while maintaining professional quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h4>
                <p className="text-gray-600 mb-6">
                  We're committed to providing exceptional service and results that help our clients succeed. Every project is approached with attention to detail and a focus on delivering value.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Licensed and insured operations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Professional equipment and software</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
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
      </section>

      <Footer />
    </div>
  );
}

