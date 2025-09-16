'use client';

import { useState, useRef, useEffect } from 'react';

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
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import heroBg from '@/assets/images/booking-bg.jpg';

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
      name: 'Basic',
      price: '$299',
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
      name: 'Premium',
      price: '$499',
      description: 'Our most popular choice for serious real estate professionals',
      features: [
        'Up to 35 high-quality photos',
        'Professional photo editing',
        'Virtual Staging (4 Photos)',
        'Aerial photography (if applicable)',
        '24-hour delivery',
        'Cloud storage access',
        'Social media ready images'
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
        'Premium photo editing & retouching',
        'Virtual Staging (7 Photos)',
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
                  Thank you for choosing BrightOne! We&apos;ve received your booking request and will contact you within 24 hours to confirm your session details.
                </p>
                <div className="space-y-4">
                  <Link 
                  href={"/booking"}
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary mr-4"
                  >
                    Book Another Session
                  </Link>
                  <Link href="/" className="btn-secondary">
                    Homepage
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
            alt="Professional Real Estate Photography Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black bright-text-shadow">Book Your</span>
              <span className=""> Session</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-montserrat">
              Ready to showcase your property with professional photography? Let&apos;s create stunning visuals that sell.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#booking-form" className="btn-primary font-light border-y-2 border-x-0 border-white">
                Start Booking
              </a>
              <a href="/contact" className="btn-secondary border-white border-y-2 font-light">
                Ask Questions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Tiers Section */}
      <section className="section-padding pt-16 bg-gray-900" id="booking-form">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              <span className="bright-text-shadow-dark">Choose Your Package</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
              Select the perfect package for your property. All packages include professional photography and editing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {serviceTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative group transition-all duration-500 cursor-pointer`}
                onClick={() => handleTierChange(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-black text-white px-6 py-2 rounded-md border-x-0 border-y-2 border-white text-sm font-semibold font-montserrat shadow-lg">
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
                      <h3 className="text-2xl lg:text-5xl font-bold text-gray-900 bright-text-shadow mt-4 mb-8 border-b-2 border-gray-500 rounded-md pb-6 font-montserrat">
                        {tier.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl lg:text-2xl font-bold text-white font-heading">Starting at</span>
                        <span className="text-4xl block lg:text-4xl mt-4 font-bold text-white font-heading">
                          {tier.price}
                        </span>
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
                          <span className="text-gray-200 text-lg font-montserrat leading-relaxed group-hover/item:text-white transition-colors duration-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Selection indicator */}
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full border-2 mx-auto transition-all duration-300 ${
                        formData.serviceTier === tier.id
                          ? 'border-white bg-white'
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {formData.serviceTier === tier.id && (
                          <div className="w-3 h-3 bg-gray-900 rounded-full mx-auto mt-1.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.serviceTier && (
            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-8 py-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xl text-white font-montserrat">
                  Selected: <span className="font-bold text-blue-400">
                    {serviceTiers.find(tier => tier.id === formData.serviceTier)?.name}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding bg-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl uppercase text-white mb-4 font-bold bright-text-shadow-dark">Get Your Free Quote</h2>
              <p className="text-xl text-white">
                Fill out the form below and we&apos;ll get back to you within 24 hours with a personalized quote
              </p>
              {formData.serviceTier && (
                <div className="mt-6 inline-block text-xl px-6 py-3">
                  <p className="text-gray-200 font-medium">
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
                      className="form-input"
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
                      className="form-input"
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
                      onBlur={handlePhoneBlur}
                      required
                      className="form-input"
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
                      className="form-select"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Details */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white mb-2">Property Address *</label>
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
                    <label className="block text-sm font-medium text-white mb-2">Property Size</label>
                    <select
                      name="propertySize"
                      value={formData.propertySize}
                      onChange={handleInputChange}
                      className="form-select"
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
                      className="form-select"
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
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="form-select"
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
                  <label className="block text-sm font-medium text-white mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">When do you need the photos?</option>
                    {timelineOptions.map(timeline => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Special Requests or Additional Information</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Any specific requirements, property features to highlight, or other details..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary btn-primary-animation bg-black uppercase rounded-none text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Free Quote'}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Information */}
            {/* <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24-Hour Response</h3>
                <p className="text-gray-600">We&apos;ll get back to you within 24 hours with a personalized quote</p>
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
            </div> */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

