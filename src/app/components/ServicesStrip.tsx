"use client";

import React from 'react';

const services = [
  {
    name: "Real Estate Photography",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1z" />
        <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    name: "3D Virtual Tours",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9 4 9-4" />
      </svg>
    )
  },
  {
    name: "Drone Photography",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12h3l2-2 2 2h3M5 8h3M16 8h3M4 16h4M16 16h4M12 14v6" />
        <circle cx="12" cy="10" r="1.5" strokeWidth={1.5} />
      </svg>
    )
  },
  {
    name: "Virtual Staging",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
      </svg>
    )
  },
  {
    name: "Cinematic Videos",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="6" width="12" height="12" rx="2" strokeWidth={1.5} />
        <circle cx="16.5" cy="9.5" r="2.5" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M8 10l4 2-4 2v-4z" />
      </svg>
    )
  },
  {
    name: "HDR Photography",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    name: "Floor Plans",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    name: "Airbnb Photography",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  }
];

export default function ServicesStrip() {
  return (
    <section className="bg-gray-900 py-8 overflow-hidden">
      <div className="relative">
        {/* Animated strip */}
        <div className="flex animate-scroll-slow">
          {/* First set of services */}
          {services.map((service, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center space-x-3 px-8 py-4 mx-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 min-w-[280px] transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg"
            >
              <div className="text-white/90">
                {service.icon}
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">
                {service.name}
              </span>
            </div>
          ))}
          
          {/* Second set of services for seamless loop */}
          {services.map((service, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex flex-col items-center space-x-3 px-8 py-4 mx-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 min-w-[280px] transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg"
            >
              <div className="text-white/90 h-full">
                {service.icon}
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
