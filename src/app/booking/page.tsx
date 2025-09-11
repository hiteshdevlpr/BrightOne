'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    propertySize: '',
    propertyAddress: '',
    preferredDate: '',
    preferredTime: '',
    services: [] as string[],
    specialRequests: '',
    budget: '',
    timeline: '',
    serviceTier: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = [
    'Real Estate Photography',
    'Virtual Staging',
    'Airbnb Photography',
    'Aerial Photography',
    '3D Tours',
    'Cinematic Videos'
  ];

  const propertyTypes = [
    'Single Family Home',
    'Condo/Apartment',
    'Townhouse',
    'Commercial Property',
    'Vacation Rental',
    'Other'
  ];

  const propertySizes = [
    'Under 1,000 sq ft',
    '1,000 - 2,000 sq ft',
    '2,000 - 3,000 sq ft',
    '3,000 - 4,000 sq ft',
    '4,000+ sq ft'
  ];

  const budgetRanges = [
    'Under $500',
    '$500 - $1,000',
    '$1,000 - $2,000',
    '$2,000 - $3,000',
    '$3,000+'
  ];

  const timelineOptions = [
    'ASAP (Within 48 hours)',
    'Within 1 week',
    'Within 2 weeks',
    'Within 1 month',
    'Flexible'
  ];

  const serviceTiers = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 'Starting at $299',
      description: 'Perfect for quick listings and budget-conscious clients',
      features: [
        'Up to 20 high-quality photos',
        'Basic photo editing',
        '24-48 hour delivery',
        'Mobile-optimized images',
        'Email delivery'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 'Starting at $499',
      description: 'Our most popular choice for serious real estate professionals',
      features: [
        'Up to 35 high-quality photos',
        'Professional photo editing',
        'Virtual staging (3 rooms)',
        'Aerial photography (if applicable)',
        '24-hour delivery',
        'Cloud storage access',
        'Social media ready images'
      ],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      price: 'Starting at $799',
      description: 'Complete marketing solution for luxury properties',
      features: [
        'Up to 50 high-quality photos',
        'Premium photo editing & retouching',
        'Virtual staging (5 rooms)',
        'Aerial photography & drone video',
        '3D virtual tour',
        'Cinematic property video (2-3 min)',
        'Same-day delivery',
        'Priority support',
        'Marketing consultation'
      ],
      popular: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleTierChange = (tierId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTier: tierId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceTier) {
      alert('Please select a service package before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Submitted!</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for choosing BrightOne.ca! We've received your booking request and will contact you within 24 hours to confirm your session details.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary mr-4"
                  >
                    Book Another Session
                  </button>
                  <a href="/portfolio" className="btn-secondary">
                    View Our Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <span className='gradient-text-gray'>Book Your</span><br />
              <span className="gradient-text">Photography Session</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Get a personalized quote and schedule your professional real estate photography session
            </p>
          </div>
        </div>
      </section>

      {/* Service Tiers Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-500 mb-4 uppercase">Choose Your Service Package</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect package for your property. All packages include professional photography and editing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                  formData.serviceTier === tier.id
                    ? 'border-gray-800 shadow-xl bg-gray-200'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                } ${tier.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => handleTierChange(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{tier.price}</p>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                      formData.serviceTier === tier.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.serviceTier === tier.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.serviceTier && (
            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                Selected: <span className="font-semibold text-blue-600">
                  {serviceTiers.find(tier => tier.id === formData.serviceTier)?.name}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding bg-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl uppercase text-white mb-4">Get Your Free Quote</h2>
              <p className="text-xl text-white">
                Fill out the form below and we'll get back to you within 24 hours with a personalized quote
              </p>
              {formData.serviceTier && (
                <div className="mt-6 inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                  <p className="text-blue-800 font-medium">
                    Selected Package: {serviceTiers.find(tier => tier.id === formData.serviceTier)?.name}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-700 rounded-s shadow-xl p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium uppercase text-white mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Property Type *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Property Address *</label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street, City, Province"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Property Size</label>
                    <select
                      name="propertySize"
                      value={formData.propertySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select size range</option>
                      {propertySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-white mb-4">Services Needed *</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceOptions.map(service => (
                      <label key={service} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-white">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scheduling */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select time preference</option>
                      <option value="morning">Morning (8 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">When do you need the photos?</option>
                    {timelineOptions.map(timeline => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Additional Information</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific requirements, property features to highlight, or other details..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary bg-black uppercase rounded-none text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Free Quote'}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24-Hour Response</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours with a personalized quote</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Consultation</h3>
                <p className="text-gray-600">No obligation consultation to discuss your specific needs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
                <p className="text-gray-600">Quick delivery to keep your listings competitive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

