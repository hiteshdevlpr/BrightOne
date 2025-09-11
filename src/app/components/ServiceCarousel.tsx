'use client';

const services = [
  {
    name: "Real Estate Photography",
    icon: "📸"
  },
  {
    name: "Virtual Staging", 
    icon: "🏠"
  },
  {
    name: "Airbnb Photography",
    icon: "🏡"
  },
  {
    name: "Aerial Photography",
    icon: "🚁"
  },
  {
    name: "3D Tours",
    icon: "🥽"
  },
  {
    name: "Cinematic Videos",
    icon: "🎬"
  }
];

export default function ServiceCarousel() {
  return (
    <div className="w-full bg-black overflow-hidden py-8">
      <div className="flex animate-scroll">
        {/* Duplicate the services array to create seamless loop */}
        {[...services, ...services].map((service, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center justify-center px-6 py-8 mx-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 min-w-[360px] transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-lg"
          >
            <div className="text-5xl mb-4">
              {service.icon}
            </div>
            <h3 className="text-white text-base font-semibold text-center leading-tight px-2">
              {service.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
