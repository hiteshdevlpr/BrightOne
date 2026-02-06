'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import serviceImg1 from '@/assets/images/service-1.jpg';
import serviceImg2 from '@/assets/images/service-2.jpg';

const SERVICE_CATEGORIES = [
  {
    title: 'Personal Branding Media',
    description:
      'Elevate your personal brand with professional headshots, lifestyle portraits, and social media content tailored for entrepreneurs, realtors, and professionals.',
    href: '/booking/personal-branding',
    image: serviceImg2,
    tags: ['Headshots', 'Lifestyle Portraits', 'Social Media Content'],
  },
  {
    title: 'Real Estate Listing Media',
    description:
      'Showcase properties at their finest with HDR photography, cinematic video tours, drone aerials, 3D virtual tours, and floor plans — everything you need to sell faster.',
    href: '/booking/real-estate',
    image: serviceImg1,
    tags: ['Photography', 'Video Tours', 'Drone', '3D Tours', 'Floor Plans'],
  },
];

export default function BookingLandingClient() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading mb-4 sm:mb-6">
            Book Your Session
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-montserrat leading-relaxed">
            Select the type of media service you need and explore our packages.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-2 sm:mb-3 group-hover:text-white transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 font-montserrat leading-relaxed mb-4 sm:mb-5">
                    {category.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                    {category.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-montserrat px-2.5 py-1 rounded-full bg-white/10 text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-2 text-white font-semibold font-montserrat text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
                    View Packages
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
