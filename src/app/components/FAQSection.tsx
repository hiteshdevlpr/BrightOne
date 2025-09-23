import { useState } from 'react';
import Script from 'next/script';

const faqs = [
  {
    question: "What areas do you serve for real estate photography?",
    answer: "We serve the Greater Toronto Area (GTA) and surrounding regions including Durham Region, Peel Region, York Region, and Kawartha Lakes. Our service area covers approximately 50km radius from downtown Toronto."
  },
  {
    question: "How long does it take to receive the final photos?",
    answer: "We typically deliver edited photos within 24-48 hours after the photo shoot. For virtual staging projects, delivery time is 3-5 business days depending on the complexity of the staging required."
  },
  {
    question: "What's included in your real estate photography packages?",
    answer: "Our packages include professional interior and exterior photography, HDR editing, color correction, and high-resolution images optimized for MLS listings. Additional services like drone photography, virtual staging, and 3D tours are available as add-ons."
  },
  {
    question: "Do you offer virtual staging services?",
    answer: "Yes, we provide professional virtual staging services to help empty or poorly furnished rooms look their best. Our virtual staging includes furniture placement, decor, and lighting adjustments to create an appealing and marketable space."
  },
  {
    question: "What equipment do you use for real estate photography?",
    answer: "We use professional-grade DSLR cameras, wide-angle lenses, professional lighting equipment, and drones for aerial photography. All equipment is regularly maintained and updated to ensure the highest quality results."
  },
  {
    question: "Can you provide floor plans for properties?",
    answer: "Yes, we offer professional floor plan services with accurate measurements, room dimensions, and clean, modern layouts. Floor plans are available in multiple formats including PDF, JPG, and interactive digital formats."
  },
  {
    question: "Do you offer 3D virtual tours?",
    answer: "Yes, we provide 3D virtual tours that allow potential buyers to explore properties remotely. Our 3D tours include interactive navigation, high-quality imagery, and can be easily shared via links or embedded in websites."
  },
  {
    question: "What are your pricing options?",
    answer: "Our pricing varies based on the services required, property size, and location. We offer competitive packages for different needs, from basic photography to comprehensive marketing solutions. Contact us for a personalized quote."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData, null, 2),
        }}
      />
      
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading">
                Frequently Asked <span className="text-gray-600">Questions</span>
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 font-montserrat max-w-3xl mx-auto">
                Get answers to common questions about our real estate photography and virtual staging services.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-6 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 hover:bg-gray-50"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 font-heading pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        <svg
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200 ${
                            openIndex === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <p className="text-sm sm:text-base text-gray-600 font-montserrat leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
