import React from 'react';

const services = [
  {
    id: 1,
    name: "Real Estate Photography",
    description: "Professional interior and exterior photography that showcases your property's best features with perfect lighting and composition.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1z" />
        <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    id: 2,
    name: "3D Virtual Tours & Floor Plans",
    description: "Immersive 3D virtual tours and detailed floor plans that allow potential buyers to explore every corner of your property.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9 4 9-4" />
      </svg>
    )
  },
  {
    id: 3,
    name: "Drone Photography",
    description: "Stunning aerial photography that captures unique perspectives and showcases your property's location and surroundings.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12h3l2-2 2 2h3M5 8h3M16 8h3M4 16h4M16 16h4M12 14v6" />
        <circle cx="12" cy="10" r="1.5" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    id: 4,
    name: "Virtual Staging",
    description: "Transform empty spaces into beautifully furnished rooms that help buyers visualize the potential of your property.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M5 12v6h14v-6M7 12V8a3 3 0 013-3h4a3 3 0 013 3v4" />
      </svg>
    )
  },
  {
    id: 5,
    name: "Airbnb Photography",
    description: "Specialized photography for vacation rentals that highlights amenities and creates an inviting atmosphere for guests.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C9 7 6 12 6 14a6 6 0 0012 0c0-2-3-7-6-11z" />
        <circle cx="12" cy="14" r="2" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    id: 6,
    name: "Listing Website",
    description: "Custom property websites that showcase your listings with professional galleries, virtual tours, and detailed information.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M3 9h18" />
        <circle cx="7" cy="7" r="1" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    id: 7,
    name: "Property Social Media Reels",
    description: "Engaging social media content and reels that showcase your properties in dynamic, shareable formats for maximum reach.",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M7 4l3 4M13 4l3 4" />
        <path strokeWidth={1.5} d="M10 12l6 3-6 3v-6z" />
      </svg>
    )
  },
  {
    id: 8,
    name: "Cinematic Videos",
    description: "Professional cinematic property videos that tell a story and create emotional connections with potential buyers.",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="6" width="12" height="12" rx="2" strokeWidth={1.5} />
        <circle cx="16.5" cy="9.5" r="2.5" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M8 10l4 2-4 2v-4z" />
      </svg>
    )
  }
];

export default function ServicesOverview() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl space-x-2 font-bold text-black mb-6">
            <span className="bright-text-shadow pr-3">Our</span> 
            <span className="text-white">Services</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-montserrat">
            Comprehensive photography and marketing solutions designed to showcase your properties in the best possible light
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-transparrent rounded-md shadow-2xl hover:bg-gray-950 hover:shadow-3xl transition-all duration-500 p-6 border"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 text-gray-300 group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>

              {/* Service Name */}
              <h3 className="text-xl uppercase text-gray-300 mb-4 text-center group-hover:text-white transition-colors duration-300">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-center leading-relaxed group-hover:text-white transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/services" className="btn-primary font-light border-white border-y font-montserrat">
              View All Services
            </a>
            <a href="/booking" className="btn-secondary font-light font-montserrat">
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
