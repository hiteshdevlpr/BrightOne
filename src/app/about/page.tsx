import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Image from 'next/image';
import StoryImage from '@/assets/images/about.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 pt-24">
        <div className="container-custom">
          <div className='pt-36 pb-16'>
            <h1 className="text-5xl text-center pb-16 w-full md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Our Story
            </h1>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative w-full h-[320px] md:h-[480px] lg:h-[560px]">
              <Image
                src={StoryImage}
                alt="BrightOne real estate photography"
                fill
                priority
                className="object-cover rounded-md shadow-xl"
              />
            </div>
            <div>
            
            <div className="space-y-6 text-gray-700 text-xl">
              <p>At BrightOne, our mission is simple: to help real estate professionals and property owners showcase their listings in the best possible light. In today&apos;s competitive market, outstanding visuals are more than just marketing tools — they&apos;re essential to capturing attention, building trust, and driving results.</p>
              <p>What sets BrightOne apart is the combination of technical expertise, creative design, and a deep appreciation for storytelling. With a foundation built on over a decade of professional experience in technology and design, our approach blends precision, innovation, and artistry to deliver visuals that make an impact.</p>
              <p>We specialize in real estate photography, virtual tours, and digital media services that highlight each property&apos;s unique features and character. From crisp, polished images to immersive virtual experiences, every project is handled with the same commitment to quality, consistency, and client success.</p>
              <p>BrightOne is more than a photography service — it&apos;s a trusted partner for real estate professionals and property owners who want their listings to stand out, sell faster, and leave a lasting impression.</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Professional Quality</h4>
                      <p className="text-gray-600 text-lg">State-of-the-art equipment and experienced photographers ensure the highest quality results.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h4>
                      <p className="text-gray-600 text-lg">Quick delivery times to keep your listings fresh and competitive in the market.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Competitive Pricing</h4>
                      <p className="text-gray-600 text-lg">Affordable packages designed to fit any budget while maintaining professional quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xs p-8">
                <h4 className="text-2xl font-bold text-gray-200 mb-4">Our Commitment</h4>
                <p className="text-gray-200 mb-6 text-xl">
                  We&apos;re committed to providing exceptional service and results that help our clients succeed. Every project is approached with attention to detail and a focus on delivering value.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mr-3"></div>
                    <span className="text-gray-200 text-lg">High quality and on time delivery</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mr-3"></div>
                    <span className="text-gray-200 text-lg">Professional equipment and software</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mr-3"></div>
                    <span className="text-gray-200 text-lg">Satisfaction guarantee</span>
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

