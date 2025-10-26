"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { ListingData } from '@/lib/listing-data';

interface ListingPageClientProps {
  listing: ListingData;
  googleMapsApiKey?: string;
}

export default function ListingPageClient({ listing, googleMapsApiKey }: ListingPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={listing.images[0]?.src || '/meta-header.png'}
              alt={listing.images[0]?.alt || listing.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {listing.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-6">
                  {listing.address}
                </p>
                <div className="flex flex-wrap gap-4 text-white">
                  <span className="text-3xl md:text-4xl font-bold">
                    {listing.priceFormatted}
                  </span>
                  <div className="flex items-center gap-6 text-lg">
                    <span>{listing.bedrooms} bed</span>
                    <span>{listing.bathrooms} bath</span>
                    <span>{listing.squareFootage.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Image Gallery */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Property Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => openModal(index)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">About This Property</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Property Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{feature.label}</div>
                          <div className="text-gray-600">{feature.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Contact Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold text-gray-900">{listing.agentName}</div>
                        <div className="text-gray-600">Real Estate Agent</div>
                      </div>
                      <div className="space-y-2">
                        <a 
                          href={`tel:${listing.agentPhone}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {listing.agentPhone}
                        </a>
                        <a 
                          href={`mailto:${listing.agentEmail}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {listing.agentEmail}
                        </a>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Schedule a Viewing
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Property Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">MLS Number:</span>
                        <span className="font-semibold">{listing.mlsNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold capitalize ${
                          listing.status === 'active' ? 'text-green-600' : 
                          listing.status === 'sold' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listed:</span>
                        <span className="font-semibold">
                          {new Date(listing.dateListed).toLocaleDateString()}
                        </span>
                      </div>
                      {listing.virtualTourUrl && (
                        <a 
                          href={listing.virtualTourUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors mt-4"
                        >
                          Virtual Tour
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-300"
            onClick={closeModal}
          />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-20 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 z-20 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              <Image
                src={listing.images[currentImageIndex].src}
                alt={listing.images[currentImageIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
              <h3 className="text-white text-lg font-bold mb-1">
                {listing.images[currentImageIndex].caption || listing.images[currentImageIndex].alt}
              </h3>
              <p className="text-white/80 text-sm">
                {currentImageIndex + 1} of {listing.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
