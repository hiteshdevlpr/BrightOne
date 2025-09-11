'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import photo1 from '@/assets/images/service-1.jpg';
import photo2 from '@/assets/images/service-2.jpg';
import photo3 from '@/assets/images/service-3.jpg';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Sample portfolio data - in a real app, this would come from a CMS or API
  const portfolioItems = [
    { id: 1, category: 'real-estate', title: 'Luxury Downtown Condo', image: photo1 },
    { id: 2, category: 'real-estate', title: 'Modern Family Home', image: photo2 },
    { id: 3, category: 'airbnb', title: 'Cozy Airbnb Studio', image: photo3 },
    { id: 4, category: 'real-estate', title: 'Historic Victorian House', image: photo1 },
    { id: 5, category: 'airbnb', title: 'Luxury Airbnb Penthouse', image: photo2 },
    { id: 6, category: 'real-estate', title: 'Contemporary Townhouse', image: photo3 },
    { id: 7, category: 'airbnb', title: 'Charming Airbnb Cottage', image: photo1 },
    { id: 8, category: 'real-estate', title: 'Executive Mansion', image: photo2 },
    { id: 9, category: 'virtual-staging', title: 'Empty Living Room Transformation', image: photo3 },
    { id: 10, category: 'aerial', title: 'Aerial Estate View', image: photo1 },
    { id: 11, category: '3d-tours', title: 'Interactive 3D Tour', image: photo2 },
    { id: 12, category: 'cinematic', title: 'Cinematic Property Video', image: photo3 },
  ];

  const filteredItems = activeTab === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeTab);

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
              <span className='gradient-text-gray'>Our</span><br />
              <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore our recent work and see how we've helped real estate agents and property owners showcase their listings
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the quality and creativity we bring to every project
            </p>
          </div>

          {/* Portfolio Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('real-estate')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'real-estate'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Real Estate
              </button>
              <button
                onClick={() => setActiveTab('airbnb')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'airbnb'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Airbnb
              </button>
              <button
                onClick={() => setActiveTab('virtual-staging')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'virtual-staging'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Virtual Staging
              </button>
              <button
                onClick={() => setActiveTab('aerial')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'aerial'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Aerial
              </button>
              <button
                onClick={() => setActiveTab('3d-tours')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === '3d-tours'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                3D Tours
              </button>
              <button
                onClick={() => setActiveTab('cinematic')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'cinematic'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Cinematic
              </button>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {item.category === 'real-estate' ? 'Real Estate Photography' : 
                     item.category === 'airbnb' ? 'Airbnb Photography' :
                     item.category === 'virtual-staging' ? 'Virtual Staging' :
                     item.category === 'aerial' ? 'Aerial Photography' :
                     item.category === '3d-tours' ? '3D Virtual Tour' :
                     item.category === 'cinematic' ? 'Cinematic Video' : item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button className="btn-primary">
              View Full Portfolio
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

