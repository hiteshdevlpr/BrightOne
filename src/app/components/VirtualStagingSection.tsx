import VirtualStagingSlider from './VirtualStagingSlider';

// Using existing service images as placeholders - you can replace these with actual virtual staging before/after images
import service1 from '@/assets/images/staging-after.jpg';
import service2 from '@/assets/images/staging-before.jpg';

export default function VirtualStagingSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 uppercase leading-tight">
                Virtual Staging
                <span className="block text-gray-600">Services</span>
              </h2>
              <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            </div>

            <div className="space-y-4 md:space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>
                Transform empty or outdated spaces into stunning, market-ready properties with our professional virtual staging services. Our expert designers use cutting-edge technology to create realistic, appealing interiors that help properties sell faster and for higher prices.
              </p>
              
              <p>
                Perfect for vacant properties, outdated spaces, or when physical staging isn&apos;t feasible. We provide high-quality virtual staging that showcases your property&apos;s true potential to potential buyers.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">What We Offer:</h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-base md:text-lg lg:text-xl">Furniture placement and room design</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-base md:text-lg lg:text-xl">Color scheme optimization</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-base md:text-lg lg:text-xl">Lighting enhancement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-base md:text-lg lg:text-xl">High-resolution final images</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-base md:text-lg lg:text-xl">Quick turnaround (24-48 hours)</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 md:pt-4">
              <a 
                href="/services" 
                className="btn-primary inline-block text-sm md:text-lg py-3 px-6 md:py-4 md:px-8"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Side - Before/After Slider */}
          <div className="relative order-1 lg:order-2">
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center uppercase">
                See the Transformation
              </h3>
              <p className="text-gray-600 text-center mt-2 text-sm md:text-base">
                Drag the slider to see before and after
              </p>
            </div>
            
            <VirtualStagingSlider
              beforeImage={service1.src}
              afterImage={service2.src}
              beforeAlt="Empty room before virtual staging"
              afterAlt="Beautifully staged room after virtual staging"
            />

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-500">
                * Sample images - Contact us for custom virtual staging
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
