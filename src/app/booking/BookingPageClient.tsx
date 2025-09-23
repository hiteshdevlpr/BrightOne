'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Image from 'next/image';
import heroBg from '@/assets/images/booking-bg.jpg';
import { handleBookingSubmission } from './booking-form-handler';
import { 
  trackFormFieldFocus, 
  trackFormFieldBlur, 
  trackFormFieldChange, 
  trackFormSubmission,
  trackFormValidationError,
  trackServiceTierSelection,
  trackAddressSuggestionClick,
  trackFormProgress
} from '@/lib/analytics';

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

interface GoogleMapsPlacesService {
  getDetails(
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (place: any, status: string) => void
  ): void;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => GoogleMapsAutocompleteService;
          PlacesService: new (element: HTMLElement) => GoogleMapsPlacesService;
        };
      };
    };
  }
}

export default function BookingPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertyType: '',
    serviceTier: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: 'Real Estate Photography',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [addressSuggestions, setAddressSuggestions] = useState<GoogleMapsPlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<GoogleMapsAutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<GoogleMapsPlacesService | null>(null);
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Service tiers configuration
  const serviceTiers = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: '$299',
      description: 'Perfect for standard listings',
      features: [
        'Up to 20 interior photos',
        'Up to 10 exterior photos',
        'Basic HDR editing',
        '24-48 hour delivery',
        'High-resolution images'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: '$499',
      description: 'Most popular choice',
      features: [
        'Up to 30 interior photos',
        'Up to 15 exterior photos',
        'Professional HDR editing',
        'Drone photography (5 shots)',
        'Virtual staging (3 rooms)',
        '24-48 hour delivery',
        'High-resolution images'
      ],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      price: '$799',
      description: 'For luxury properties',
      features: [
        'Unlimited interior photos',
        'Unlimited exterior photos',
        'Professional HDR editing',
        'Drone photography (10 shots)',
        'Virtual staging (5 rooms)',
        '3D virtual tour',
        'Floor plans',
        '24-48 hour delivery',
        'High-resolution images'
      ],
      popular: false
    }
  ];

  // Initialize Google Maps services
  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.AutocompleteService();
        const places = new window.google.maps.places.PlacesService(document.createElement('div'));
        setAutocompleteService(autocomplete);
        setPlacesService(places);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google) {
      initializeGoogleMaps();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeGoogleMaps();
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleMaps), 10000);
    }
  }, []);

  // Handle address input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      propertyAddress: value
    }));

    // Track form field changes
    trackFormFieldChange('booking', 'propertyAddress', value);
    
    // Track form progress
    const completedFields = Object.values({ ...formData, propertyAddress: value }).filter(val => val && val.toString().trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    trackFormProgress('booking', completedFields, totalFields);

    // Clear field-specific errors when user starts typing
    if (fieldErrors.propertyAddress) {
      setFieldErrors(prev => ({
        ...prev,
        propertyAddress: ''
      }));
    }

    // Get address suggestions
    if (value.length > 2 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ['address'],
          componentRestrictions: { country: 'ca' }
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            setAddressSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setAddressSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle address suggestion selection
  const handleAddressSuggestionClick = (suggestion: GoogleMapsPlacePrediction) => {
    setFormData(prev => ({
      ...prev,
      propertyAddress: suggestion.description
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    // Track address suggestion click
    trackAddressSuggestionClick(suggestion.description);
    
    // Get place details for additional information
    if (placesService) {
      placesService.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['formatted_address', 'geometry', 'address_components']
        },
        (place: unknown, status: string) => {
          if (status === 'OK' && place) {
            // You can store additional place details here if needed
            console.log('Place details:', place);
          }
        }
      );
    }
  };

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Track form field changes
    trackFormFieldChange('booking', name, value);
    
    // Track form progress
    const completedFields = Object.values({ ...formData, [name]: value }).filter(val => val && val.toString().trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    trackFormProgress('booking', completedFields, totalFields);
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const handleServiceTierSelection = (tierId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTier: tierId
    }));
    
    // Track service tier selection
    trackServiceTierSelection('booking', tierId);
    
    // Clear field-specific errors
    if (fieldErrors.serviceTier) {
      setFieldErrors(prev => ({
        ...prev,
        serviceTier: ''
      }));
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyAddress: '',
      propertyType: '',
      serviceTier: '',
      preferredDate: '',
      preferredTime: '',
      serviceType: 'Real Estate Photography',
      message: ''
    });
    setErrors([]);
    setFieldErrors({});
  };

  const validateField = (name: string, value: string) => {
    const newFieldErrors = { ...fieldErrors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newFieldErrors.name = 'Name is required';
          trackFormValidationError('booking', 'name', 'required');
        } else if (value.trim().length < 2) {
          newFieldErrors.name = 'Name must be at least 2 characters';
          trackFormValidationError('booking', 'name', 'min_length');
        } else {
          delete newFieldErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newFieldErrors.email = 'Email is required';
          trackFormValidationError('booking', 'email', 'required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newFieldErrors.email = 'Please enter a valid email address';
          trackFormValidationError('booking', 'email', 'invalid_format');
        } else {
          delete newFieldErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
          newFieldErrors.phone = 'Please enter a valid phone number';
          trackFormValidationError('booking', 'phone', 'invalid_format');
        } else {
          delete newFieldErrors.phone;
        }
        break;
      case 'propertyAddress':
        if (!value.trim()) {
          newFieldErrors.propertyAddress = 'Property address is required';
          trackFormValidationError('booking', 'propertyAddress', 'required');
        } else {
          delete newFieldErrors.propertyAddress;
        }
        break;
      case 'propertyType':
        if (!value) {
          newFieldErrors.propertyType = 'Please select a property type';
          trackFormValidationError('booking', 'propertyType', 'required');
        } else {
          delete newFieldErrors.propertyType;
        }
        break;
      case 'serviceTier':
        if (!value) {
          newFieldErrors.serviceTier = 'Please select a service package';
          trackFormValidationError('booking', 'serviceTier', 'required');
        } else {
          delete newFieldErrors.serviceTier;
        }
        break;
      case 'preferredDate':
        if (!value) {
          newFieldErrors.preferredDate = 'Preferred date is required';
          trackFormValidationError('booking', 'preferredDate', 'required');
        } else {
          delete newFieldErrors.preferredDate;
        }
        break;
      case 'preferredTime':
        if (!value) {
          newFieldErrors.preferredTime = 'Preferred time is required';
          trackFormValidationError('booking', 'preferredTime', 'required');
        } else {
          delete newFieldErrors.preferredTime;
        }
        break;
    }
    
    setFieldErrors(newFieldErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("APP_LOG:: Form Submitted formData", formData);
    
    // Track form submission attempt
    trackFormSubmission('booking', true);
    
    // Store current form data for submission
    const currentFormData = { ...formData };
    
    await handleBookingSubmission(
      currentFormData,
      setIsSubmitting,
      setIsSubmitted,
      setErrors
    );
    
    // Track form submission result
    trackFormSubmission('booking', true);
    clearForm();
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[50vh] sm:h-[70vh] pt-20 sm:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroBg.src}
            alt="Book Real Estate Photography Session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Book Your</span>
              <span className="bright-text-shadow-dark"> Session</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-montserrat">
              Professional real estate photography services to showcase your properties in the best possible light
            </p>
          </div>
        </div>
      </section>

      {/* Success Message Section */}
      {isSubmitted ? (
        <section className="py-12 sm:py-16 bg-gray-900">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-700">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-heading">Booking Confirmed!</h2>
                <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-8 font-montserrat">
                  Thank you for booking with us! We&apos;ve received your request and will contact you within 24 hours to confirm your session details.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white text-gray-900 py-1.5 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 border-x-0 border-y-2 border-white text-xs sm:text-base"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-gray-900">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-heading">
                  <span className="bright-text-shadow-dark">Choose Your</span> <span className="bright-text-shadow text-black">Package</span>
                </h2>
                <p className="text-sm sm:text-lg md:text-xl text-white/80 font-montserrat max-w-3xl mx-auto">
                  Select the perfect package for your property photography needs. All packages include professional editing and fast delivery.
                </p>
              </div>
              
              {/* Service Tiers */}
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                {serviceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative bg-gray-800 rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer ${
                      formData.serviceTier === tier.id
                        ? 'border-white shadow-2xl scale-105'
                        : 'border-gray-700 hover:border-gray-500'
                    } ${tier.popular ? 'ring-2 ring-white ring-opacity-50' : ''}`}
                    onClick={() => handleServiceTierSelection(tier.id)}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-semibold font-montserrat">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 font-heading">
                        {tier.name}
                      </h3>
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 font-heading">
                        {tier.price}
                      </div>
                      <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base font-montserrat">
                        {tier.description}
                      </p>
                      
                      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-white/90 text-xs sm:text-sm font-montserrat">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        type="button"
                        className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold font-montserrat transition-colors duration-300 text-xs sm:text-base ${
                          formData.serviceTier === tier.id
                            ? 'bg-white text-gray-900'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {formData.serviceTier === tier.id ? 'Selected' : 'Select Package'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Booking Form */}
              <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700">
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 font-heading">Book Your Session</h3>
                
                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Personal Information */}
                  <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => trackFormFieldFocus('booking', 'name')}
                        onBlur={(e) => {
                          validateField('name', e.target.value);
                          trackFormFieldBlur('booking', 'name');
                        }}
                        required
                        className={`form-input ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && (
                        <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => trackFormFieldFocus('booking', 'email')}
                        onBlur={(e) => {
                          validateField('email', e.target.value);
                          trackFormFieldBlur('booking', 'email');
                        }}
                        required
                        className={`form-input ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email && (
                        <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => trackFormFieldFocus('booking', 'phone')}
                      onBlur={(e) => {
                        handlePhoneBlur(e);
                        validateField('phone', e.target.value);
                        trackFormFieldBlur('booking', 'phone');
                      }}
                      className={`form-input ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.phone}</p>
                    )}
                  </div>
                  
                  {/* Property Information */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Address *</label>
                    <input
                      ref={addressInputRef}
                      type="text"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleAddressChange}
                      onFocus={() => trackFormFieldFocus('booking', 'propertyAddress')}
                      onBlur={(e) => {
                        validateField('propertyAddress', e.target.value);
                        trackFormFieldBlur('booking', 'propertyAddress');
                      }}
                      required
                      className={`form-input ${fieldErrors.propertyAddress ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter property address"
                    />
                    {fieldErrors.propertyAddress && (
                      <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.propertyAddress}</p>
                    )}
                    
                    {/* Address Suggestions */}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                      >
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                            onClick={() => handleAddressSuggestionClick(suggestion)}
                          >
                            <div className="font-medium text-gray-900 text-sm">
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Type *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      onFocus={() => trackFormFieldFocus('booking', 'propertyType')}
                      onBlur={(e) => {
                        validateField('propertyType', e.target.value);
                        trackFormFieldBlur('booking', 'propertyType');
                      }}
                      required
                      className={`form-select ${fieldErrors.propertyType ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select property type</option>
                      <option value="house">House</option>
                      <option value="condo">Condo/Apartment</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                      <option value="other">Other</option>
                    </select>
                    {fieldErrors.propertyType && (
                      <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.propertyType}</p>
                    )}
                  </div>
                  
                  {/* Date and Time */}
                  <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Preferred Date *</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        onFocus={() => trackFormFieldFocus('booking', 'preferredDate')}
                        onBlur={(e) => {
                          validateField('preferredDate', e.target.value);
                          trackFormFieldBlur('booking', 'preferredDate');
                        }}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className={`form-input ${fieldErrors.preferredDate ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {fieldErrors.preferredDate && (
                        <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.preferredDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Preferred Time *</label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        onFocus={() => trackFormFieldFocus('booking', 'preferredTime')}
                        onBlur={(e) => {
                          validateField('preferredTime', e.target.value);
                          trackFormFieldBlur('booking', 'preferredTime');
                        }}
                        required
                        className={`form-select ${fieldErrors.preferredTime ? 'border-red-500 focus:border-red-500' : ''}`}
                      >
                        <option value="">Select preferred time</option>
                        <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                        <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                      {fieldErrors.preferredTime && (
                        <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.preferredTime}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Additional Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => trackFormFieldFocus('booking', 'message')}
                      onBlur={() => trackFormFieldBlur('booking', 'message')}
                      rows={4}
                      className="form-textarea"
                      placeholder="Tell us about your property or any special requirements..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-gray-900 py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Book Session'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
