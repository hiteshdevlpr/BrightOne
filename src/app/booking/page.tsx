'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import heroBg from '@/assets/images/booking-bg.jpg';
import { handleBookingSubmission } from './booking-form-handler';

// Google Maps TypeScript declarations
interface GoogleMapsPlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleMapsAutocompleteService {
  getPlacePredictions(
    request: {
      input: string;
      types?: string[];
      componentRestrictions?: { country: string };
    },
    callback: (predictions: GoogleMapsPlacePrediction[] | null, status: string) => void
  ): void;
}

interface GoogleMapsPlaces {
  AutocompleteService: new () => GoogleMapsAutocompleteService;
  PlacesServiceStatus: {
    OK: string;
  };
}

interface GoogleMaps {
  maps: {
    places: GoogleMapsPlaces;
  };
}

declare global {
  interface Window {
    google: GoogleMaps;
  }
}

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
    budget: '',
    timeline: '',
    serviceType: 'Real Estate Photography',
    serviceTier: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<GoogleMapsAutocompleteService | null>(null);

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
    };

    // Check if Google Maps is already loaded
    if (window.google) {
      initAutocomplete();
    } else {
      // Load Google Maps script if not already loaded
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (apiKey) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initAutocomplete;
        document.head.appendChild(script);
      } else {
        console.warn('Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
      }
    }
  }, []);

  // Handle address search
  const handleAddressSearch = (query: string) => {
    if (!autocompleteService.current || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const request = {
      input: query,
      types: ['address'],
      componentRestrictions: { country: 'ca' } // Restrict to Canada
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const suggestions = predictions.map((prediction) => prediction.description);
        setAddressSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  // Handle address selection
  const handleAddressSelect = (address: string) => {
    setFormData(prev => ({ ...prev, propertyAddress: address }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different input formats
    if (cleaned.length === 10) {
      // Format as (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // Format as +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // Format as 1 (XXX) XXX-XXXX
      return `1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Return original if doesn't match expected patterns
    return phoneNumber;
  };

  // Handle phone number blur
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const serviceOptions = [
    'Real Estate Photography',
    'Virtual Staging',
    'Airbnb Photography',
    'Aerial Photography',
    '3D Tours',
    'Property Video',
    'Floor Plans',
    'Listing Website'
  ];

  const propertyTypeOptions = [
    'House',
    'Condo',
    'Townhouse',
    'Commercial',
    'Land',
    'Other'
  ];

  const propertySizeOptions = [
    'Under 1000 sq ft',
    '1000-2000 sq ft',
    '2000-3000 sq ft',
    '3000-4000 sq ft',
    '4000+ sq ft'
  ];

  const budgetOptions = [
    'Under $500',
    '$500-1000',
    '$1000-2000',
    '$2000-3000',
    '$3000+'
  ];

  const timelineOptions = [
    'ASAP',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    'Flexible'
  ];

  const serviceTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$299',
      description: 'Perfect for quick listings and budget-conscious clients',
      features: [
        'Up to 20 high-quality photos',
        'Premium photo editing & retouching',
        '24-48 hour delivery',
        'Mobile-optimized images',
        'Email delivery',
        'Listing Website'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$499',
      description: 'Our most popular choice for serious real estate professionals',
      features: [
        'Up to 35 high-quality photos',
        'Virtual Staging (4 Photos)',
        'Aerial photography (if applicable)',
        '24-hour delivery of photos',
        'Cloud storage access',
        'Social media ready images',
        'Listing Website',
        'Property Social Media Reel'
      ],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury',
      price: '$799',
      description: 'Complete marketing solution for luxury properties',
      features: [
        'Up to 50 high-quality photos',
        'Virtual Staging (7 Photos)',
        'Aerial photography & drone video',
        '3D virtual tour',
        'Cinematic property video (1-2 min)',
        'Listing Website',
        'Property Social Media Reel',
        'Agent Promotion Video'
      ],
      popular: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceTierSelect = (tierId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTier: tierId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleBookingSubmission(
      formData,
      setIsSubmitting,
      setIsSubmitted,
      setErrors
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-16 bg-gray-900">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-700">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 font-heading">Booking Submitted!</h1>
                <p className="text-lg text-white/80 mb-8 font-montserrat">
                  Thank you for your booking request! We&apos;ve received your information and will get back to you within 24 hours with a personalized quote and next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 border-x-0 border-y-2 border-white"
                  >
                    Submit Another Booking
                  </button>
                  <Link 
                    href="/"
                    className="bg-transparent text-white py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-white/10 transition-colors duration-300 border border-white"
                  >
                    Back to Home
                  </Link>
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
      <section className="relative overflow-hidden h-[70vh] pt-60">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroBg.src}
            alt="Book Your Photography Session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Book Your</span>
              <span className="bright-text-shadow-dark"> Session</span>
            </h1>
            <p className="text-2xl text-white/90 mb-8 leading-relaxed font-montserrat">
              Get a personalized quote and book your professional real estate photography session
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#booking-form" className="btn-primary font-light border-x-0 border-y-2 border-white">
                Start Booking
              </a>
              <a href="/contact" className="btn-secondary font-light">
                Ask Questions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              <span className="bright-text-shadow-dark">Choose Your</span> <span className="bright-text-shadow text-black">Package</span>
            </h2>
            <p className="text-xl text-white/80 font-montserrat max-w-3xl mx-auto">
              Select the perfect package for your property. All packages include professional editing and fast delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceTiers.map((tier) => (
              <div key={tier.id} className="relative">
                {tier.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-black text-white px-6 py-2 rounded-md border-x-0 border-y-2 border-white text-sm font-light font-montserrat shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 border-y-2 border-x-0 border-white h-full ${
                  formData.serviceTier === tier.id
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white shadow-2xl'
                    : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-500 hover:shadow-xl'
                }`}>
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20"></div>
                  
                  <div className="relative p-8 lg:p-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                        {tier.name}
                      </h3>
                      <div className="text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
                        {tier.price}
                      </div>
                      <p className="text-gray-300 text-lg font-montserrat leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 flex-grow mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300  flex items-center justify-center mr-4 mt-0.5">
                            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-white/90 font-montserrat group-hover/item:text-white transition-colors duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Selection Button */}
                    <button
                      onClick={() => handleServiceTierSelect(tier.id)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold font-montserrat transition-all duration-300 ${
                        formData.serviceTier === tier.id
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      {formData.serviceTier === tier.id ? 'Selected' : 'Select Package'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-16 md:py-24 lg:py-32 bg-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl uppercase text-white mb-4 font-bold bright-text-shadow-dark">Get Your Free Quote</h2>
              <p className="text-xl text-white font-montserrat">
                Fill out the form below and we&apos;ll get back to you within 24 hours with a personalized quote
              </p>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handlePhoneBlur}
                    className="form-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Service Type *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Details */}
              <div className="relative">
                <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Address *</label>
                <input
                  ref={autocompleteRef}
                  type="text"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleAddressSearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow for click selection
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  required
                  className="form-input"
                  placeholder="Start typing your address..."
                  autoComplete="off"
                />
                
                {/* Address Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors duration-200"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select property type</option>
                    {propertyTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Size</label>
                  <select
                    name="propertySize"
                    value={formData.propertySize}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select property size</option>
                    {propertySizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select budget range</option>
                    {budgetOptions.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-montserrat">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map((timeline) => (
                      <option key={timeline} value={timeline}>
                        {timeline}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-montserrat">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Tell us more about your project, special requirements, or any questions you have..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-gray-900 py-4 px-12 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}