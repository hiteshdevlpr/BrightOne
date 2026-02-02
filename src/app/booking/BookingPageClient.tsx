'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import heroBg from '@/assets/images/booking-bg.jpg';
import { handleBookingSubmission } from './booking-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
  trackFormFieldFocus,
  trackFormFieldBlur,
  trackFormFieldChange,
  trackFormSubmission,
  trackServiceTierSelection,
  trackAddressSuggestionClick,
  trackBookingStepChange,
  trackPackageSelection,
  trackAddOnToggle,
  trackVirtualStagingPhotosChange,
  trackPropertySizeSelection,
  trackAddressAutocomplete,
  trackAddressSelection,
  trackAddressAutosuggestSelection,
  trackBookingStart,
  trackBookingReset,
  trackBookingAbandonment
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

// Service and Package Types
// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   basePrice: number;
//   category: 'photography' | 'videography' | 'virtual_tour' | 'floor_plans' | 'listing_website' | 'airbnb';
// }

interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice: number;
  discountPercent: number;
  services: string[];
  photoCount: number;
  propertySize: string;
  popular?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    unitNumber: '',
    propertySize: '',
    selectedPackage: '',
    selectedAddOns: [] as string[],
    virtualStagingPhotos: 3,
    preferredDate: '',
    preferredTime: '',
    message: '',
    [HONEYPOT_FIELD]: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [formStartTime, setFormStartTime] = useState<number>(Date.now());

  // Initial form state for reset
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    unitNumber: '',
    propertySize: '',
    selectedPackage: '',
    selectedAddOns: [] as string[],
    virtualStagingPhotos: 3,
    preferredDate: '',
    preferredTime: '',
    message: '',
    [HONEYPOT_FIELD]: ''
  };

  // Reset form function
  const resetForm = () => {
    trackBookingReset(currentStep);
    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors([]);
    setFieldErrors({});
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setIsManualAddress(false);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setFormStartTime(Date.now());
  };
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<GoogleMapsAutocompleteService | null>(null);

  // Track booking start
  useEffect(() => {
    trackBookingStart();
  }, []);

  // Track form abandonment on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSubmitted && !isSubmitting) {
        trackBookingAbandonment(currentStep);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, isSubmitted, isSubmitting, formData]);

  // Property size slabs and photo counts
  const getPropertySizeSlab = (size: string) => {
    const numericSize = parseInt(size.replace(/[^\d]/g, ''));
    if (numericSize <= 999) return 'small';
    if (numericSize <= 2499) return 'medium';
    if (numericSize <= 4500) return 'large';
    return 'luxury';
  };

  const getPhotoCount = (size: string, packageType: string) => {
    const slab = getPropertySizeSlab(size);
    const photoCounts: Record<string, Record<string, number>> = {
      small: { essentials: 25, enhanced: 30, showcase: 35, premium: 40, ultimate: 50, airbnb: 20 },
      medium: { essentials: 25, enhanced: 30, showcase: 35, premium: 45, ultimate: 50, airbnb: 30 },
      large: { essentials: 30, enhanced: 40, showcase: 40, premium: 50, ultimate: 60, airbnb: 40 },
      luxury: { essentials: 45, enhanced: 45, showcase: 45, premium: 50, ultimate: 60, airbnb: 40 }
    };
    return photoCounts[slab]?.[packageType] || 25;
  };

  const getVideoCount = (packageType: string) => {
    const videoCounts: Record<string, number> = {
      essentials: 0,
      enhanced: 0,
      showcase: 1,
      premium: 2,
      ultimate: 3,
      airbnb: 0
    };
    return videoCounts[packageType] || 0;
  };


  const getSizeMultiplier = (size: string) => {
    const slab = getPropertySizeSlab(size);
    const multipliers = {
      small: 1.0,
      medium: 1.15,
      large: 1.3,
      luxury: 1.5
    };
    return multipliers[slab] || 1.0;
  };

  // Discount configuration
  const PACKAGE_DISCOUNTS = {
    essentials: 10,
    enhanced: 10,
    showcase: 10,
    premium: 15,
    ultimate: 15,
    airbnb: 15
  };

  // Package definitions with dynamic pricing based on property size
  const getPackages = (propertySize: string): Package[] => {
    const multiplier = getSizeMultiplier(propertySize);
    const slab = getPropertySizeSlab(propertySize);

    return [
      {
        id: 'essentials',
        name: 'Essentials Package',
        description: 'For small listings, rentals, or budget-conscious clients',
        originalPrice: Math.round(199 * multiplier),
        basePrice: Math.round(199 * multiplier * (1 - PACKAGE_DISCOUNTS.essentials / 100)),
        discountPercent: PACKAGE_DISCOUNTS.essentials,
        photoCount: getPhotoCount(propertySize, 'essentials'),
        propertySize: slab,
        services: [
          'Interior & Exterior Photography',
          'HDR Editing',
          'Twilight Photography'
        ]
      },
      {
        id: 'enhanced',
        name: 'Enhanced Package',
        description: 'Ideal for agents who want to show both visuals & layout',
        originalPrice: Math.round(319 * multiplier),
        basePrice: Math.round(319 * multiplier * (1 - PACKAGE_DISCOUNTS.enhanced / 100)),
        discountPercent: PACKAGE_DISCOUNTS.enhanced,
        photoCount: getPhotoCount(propertySize, 'enhanced'),
        propertySize: slab,
        services: [
          'Everything in Essentials',
          '2D Floor Plan (MLS compliant)',
          'Drone Photos'
        ]
      },
      {
        id: 'showcase',
        name: 'Showcase Package',
        description: 'Designed for premium listings that need extra visibility',
        originalPrice: Math.round(429 * multiplier),
        basePrice: Math.round(429 * multiplier * (1 - PACKAGE_DISCOUNTS.showcase / 100)),
        discountPercent: PACKAGE_DISCOUNTS.showcase,
        photoCount: getPhotoCount(propertySize, 'showcase'),
        propertySize: slab,
        popular: true,
        services: [
          'Everything in Essentials',
          'Cinematic Video Tour OR Agent Walkthrough Video',
          'Social Media Reel',
          'Listing Website'
        ]
      },
      {
        id: 'premium',
        name: 'Premium Marketing Package',
        description: 'A complete package for mid to high-end properties',
        originalPrice: Math.round(549 * multiplier),
        basePrice: Math.round(549 * multiplier * (1 - PACKAGE_DISCOUNTS.premium / 100)),
        discountPercent: PACKAGE_DISCOUNTS.premium,
        photoCount: getPhotoCount(propertySize, 'premium'),
        propertySize: slab,
        services: [
          'Everything in Showcase',
          'Cinematic Video Tour + Social Media Reel',
          '3D Virtual Tour (iGUIDE)'
        ]
      },
      {
        id: 'ultimate',
        name: 'Ultimate Property Experience',
        description: 'Best for luxury homes or when agents want the full marketing suite',
        originalPrice: Math.round(699 * multiplier),
        basePrice: Math.round(699 * multiplier * (1 - PACKAGE_DISCOUNTS.ultimate / 100)),
        discountPercent: PACKAGE_DISCOUNTS.ultimate,
        photoCount: getPhotoCount(propertySize, 'ultimate'),
        propertySize: slab,
        services: [
          'Interior, Exterior, Twilight, Drone Photography',
          'Cinematic Video Tour + Agent Walkthrough + Social Media Reel',
          '2D Floor Plans + 3D Virtual Tour (iGUIDE) + Listing Website']
      },
      {
        id: 'airbnb',
        name: 'Airbnb / Short-Term Rental Package',
        description: 'Tailored for Airbnb & vacation rental owners',
        originalPrice: Math.round(149 * multiplier),
        basePrice: Math.round(149 * multiplier * (1 - PACKAGE_DISCOUNTS.airbnb / 100)),
        discountPercent: PACKAGE_DISCOUNTS.airbnb,
        photoCount: getPhotoCount(propertySize, 'airbnb'),
        propertySize: slab,
        services: [
          'Interior + Exterior Photos (Airbnb optimized)',
          'HDR Processing',
          'Airbnb Optimization Edits'
        ]
      }
    ];
  };

  // Add-on services
  const addOns: AddOn[] = [
    { id: 'drone_photos', name: 'Drone Photos (Exterior Aerials)', description: 'Aerial property shots from unique perspectives', price: 149, category: 'photography' },
    { id: 'twilight_photos', name: 'Twilight Photos', description: 'Dramatic evening shots with ambient lighting', price: 49, category: 'photography' },
    { id: 'extra_photos', name: 'Extra Photos (per 10 images)', description: 'Additional photos beyond package limit', price: 49, category: 'photography' },
    { id: 'cinematic_video', name: 'Cinematic Video Tour', description: 'Professional property video tour (1-2 min)', price: 199, category: 'videography' },
    { id: 'agent_walkthrough', name: 'Agent Walkthrough Video', description: 'Personalized agent introduction video', price: 149, category: 'videography' },
    { id: 'social_reel', name: 'Social Media Reel', description: 'Short form vertical cut for social platforms', price: 99, category: 'videography' },
    { id: 'virtual_tour', name: '3D Virtual Tour (iGUIDE)', description: 'Interactive 3D property tour', price: 199, category: 'virtual_tour' },
    { id: 'floor_plan', name: '2D Floor Plan', description: 'Accurate layout for MLS compliance', price: 99, category: 'floor_plans' },
    { id: 'listing_website', name: 'Listing Website', description: 'Custom property showcase website', price: 99, category: 'listing_website' },
    { id: 'virtual_staging', name: 'Virtual Staging', description: 'Digitally furnished and decorated photos (3 photos base)', price: 99, category: 'virtual_staging' }
  ];

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
    };

    if (window.google) {
      initAutocomplete();
    } else {
      // Try multiple ways to get the API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                    (window as unknown as { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string }).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
                    'AIzaSyCXHJzRlwX-sppSoQT2L4qpiGptzULRs8M'; // Fallback to hardcoded key
      
      console.log('🔍 Debug - API Key check:', {
        envApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'undefined',
        windowApiKey: (window as unknown as { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string }).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `${(window as unknown as { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string }).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!.substring(0, 10)}...` : 'undefined',
        finalApiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined',
        hasApiKey: !!apiKey,
        nodeEnv: process.env.NODE_ENV,
        allEnvVars: Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('MAPS'))
      });
      
      if (apiKey) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initAutocomplete;
        script.onerror = (error) => {
          console.error('❌ Google Maps script failed to load:', error);
        };
        document.head.appendChild(script);
        console.log('✅ Google Maps script added to page');
      } else {
        console.warn('❌ Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
        console.log('🔍 Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
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
      componentRestrictions: { country: 'ca' }
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const suggestions = predictions.map((prediction) => prediction.description);
        setAddressSuggestions(suggestions);
        setShowSuggestions(true);
        
        // Track address autocomplete
        trackAddressAutocomplete(query, suggestions.length);
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
    setIsManualAddress(false);
    
    // Track address selection analytics
    trackAddressSuggestionClick(address);
    trackAddressSelection(address, 'autocomplete');
    trackAddressAutosuggestSelection(address);
  };

  // Handle manual address toggle
  const handleManualAddressToggle = () => {
    setIsManualAddress(!isManualAddress);
    if (!isManualAddress) {
      setFormData(prev => ({ ...prev, propertyAddress: '' }));
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
    // Track manual address selection
    if (isManualAddress) {
      trackAddressSelection(formData.propertyAddress, 'manual');
    }
  };

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phoneNumber;
  };

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) {
      return null; // Phone is optional
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Invalid phone number format';
    }
    return null;
  };

  const validateField = (name: string, value: string) => {
    let error: string | null = null;
    
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate fields that need validation
    if (name === 'email' || name === 'phone') {
      validateField(name, value);
    }

    // Track property size selection
    if (name === 'propertySize' && value) {
      const sizeCategory = getPropertySizeSlab(value);
      trackPropertySizeSelection(value, sizeCategory);
    }

    trackFormFieldChange('booking', name, value);
  };

  const handlePackageSelect = (packageId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPackage: packageId
    }));

    const currentPackages = getPackages(formData.propertySize);
    const selectedPackage = currentPackages.find(p => p.id === packageId);
    if (selectedPackage) {
      trackServiceTierSelection(packageId, selectedPackage.name);
      trackPackageSelection(packageId, selectedPackage.name, selectedPackage.basePrice);
    }
  };

  const handleAddOnToggle = (addOnId: string) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.selectedAddOns.includes(addOnId);
      
      if (addOnId === 'virtual_staging') {
        // For virtual staging, include the photo count in the add-on ID
        const virtualStagingId = `virtual_staging_${prev.virtualStagingPhotos}`;
        const isVirtualStagingSelected = prev.selectedAddOns.some(id => id.startsWith('virtual_staging_'));
        
        if (isCurrentlySelected || isVirtualStagingSelected) {
          // Remove any existing virtual staging entry
          const newState = {
            ...prev,
            selectedAddOns: prev.selectedAddOns.filter(id => !id.startsWith('virtual_staging_'))
          };
          
          // Track add-on toggle
          const addOn = addOns.find(a => a.id === 'virtual_staging');
          if (addOn) {
            trackAddOnToggle('virtual_staging', addOn.name, false, addOn.price);
          }
          
          return newState;
        } else {
          // Add virtual staging with current photo count
          const newState = {
            ...prev,
            selectedAddOns: [...prev.selectedAddOns, virtualStagingId]
          };
          
          // Track add-on toggle
          const addOn = addOns.find(a => a.id === 'virtual_staging');
          if (addOn) {
            trackAddOnToggle('virtual_staging', addOn.name, true, addOn.price);
          }
          
          return newState;
        }
      } else {
        // For other add-ons, use the simple toggle logic
        const newState = {
          ...prev,
          selectedAddOns: isCurrentlySelected
            ? prev.selectedAddOns.filter(id => id !== addOnId)
            : [...prev.selectedAddOns, addOnId]
        };
        
        // Track add-on toggle
        const addOn = addOns.find(a => a.id === addOnId);
        if (addOn) {
          trackAddOnToggle(addOnId, addOn.name, !isCurrentlySelected, addOn.price);
        }
        
        return newState;
      }
    });
  };

  const handleVirtualStagingPhotosChange = (increment: boolean) => {
    setFormData(prev => {
      const newPhotoCount = increment 
        ? prev.virtualStagingPhotos + 1 
        : Math.max(3, prev.virtualStagingPhotos - 1);
      
      // Track virtual staging photos change
      trackVirtualStagingPhotosChange(newPhotoCount, increment ? 'increase' : 'decrease');
      
      // Check if virtual staging is currently selected
      const isVirtualStagingSelected = prev.selectedAddOns.some(id => id.startsWith('virtual_staging_'));
      
      if (isVirtualStagingSelected) {
        // Update the virtual staging entry with new photo count
        const updatedAddOns = prev.selectedAddOns.map(id => 
          id.startsWith('virtual_staging_') ? `virtual_staging_${newPhotoCount}` : id
        );
        
        return {
          ...prev,
          virtualStagingPhotos: newPhotoCount,
          selectedAddOns: updatedAddOns
        };
      } else {
        // Just update the photo count
        return {
          ...prev,
          virtualStagingPhotos: newPhotoCount
        };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      trackBookingStepChange(currentStep + 1, 'next');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      trackBookingStepChange(currentStep - 1, 'previous');
    }
  };

  const calculateTotal = () => {
    const currentPackages = getPackages(formData.propertySize);
    const selectedPackage = currentPackages.find(p => p.id === formData.selectedPackage);
    const packagePrice = selectedPackage?.basePrice || 0;

    const multiplier = getSizeMultiplier(formData.propertySize);
    const addOnPrice = formData.selectedAddOns.reduce((total, addOnId) => {
      const isVirtualStaging = addOnId.startsWith('virtual_staging_');
      const baseAddOnId = isVirtualStaging ? 'virtual_staging' : addOnId;
      const addOn = addOns.find(a => a.id === baseAddOnId);
      
      if (isVirtualStaging) {
        // Virtual staging: $99 base for 3 photos, $20 per additional photo
        const basePrice = 99;
        const photoCount = parseInt(addOnId.split('_')[2]) || formData.virtualStagingPhotos;
        const additionalPhotos = Math.max(0, photoCount - 3);
        const additionalPrice = additionalPhotos * 20;
        return total + Math.round((basePrice + additionalPrice) * multiplier);
      }
      return total + Math.round((addOn?.price || 0) * multiplier);
    }, 0);

    return packagePrice + addOnPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFormSubmission('booking', true);

    try {
      const recaptchaToken = await getRecaptchaToken('booking');
      const bookingData = {
        ...formData,
        serviceType: 'Real Estate Photography Package',
        serviceTier: formData.selectedPackage,
        totalPrice: calculateTotal().toString(),
        selectedAddOns: formData.selectedAddOns,
        message: formData.message,
        recaptchaToken,
        [HONEYPOT_FIELD]: formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''
      };

      await handleBookingSubmission(
        bookingData,
        setIsSubmitting,
        setIsSubmitted,
        setErrors,
        formStartTime
      );

      trackFormSubmission('booking', true);
    } catch {
      trackFormSubmission('booking', false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[50vh] sm:h-[70vh] pt-20 sm:pt-20">
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

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-heading">
              <span className="bright-text-shadow text-black">Book Your</span>
              <span className="bright-text-shadow-dark"> Session</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-montserrat">
              Get a personalized quote and book your professional real estate photography session
            </p>
            <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="#booking-form" className="btn-primary font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Start Booking
              </a>
              <a href="/contact" className="btn-secondary font-light font-montserrat text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
                Ask Questions
              </a>
            </div>
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
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-heading">Booking Submitted!</h2>
                <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-8 font-montserrat">
                  Thank you for your booking request! We&apos;ve received your information and will get back to you within 24 hours with a personalized quote and next steps.
                </p>
                <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="bg-white text-gray-900 py-1.5 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 border-x-0 border-y-2 border-white text-xs sm:text-base"
                  >
                    Submit Another Booking
                  </button>
                  <Link
                    href="/"
                    className="bg-transparent text-white py-1.5 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-white/10 transition-colors duration-300 border border-white text-xs sm:text-base"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Multi-Step Booking Form */}
          <section id="booking-form" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-800">
            <div className="container-custom px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">

                {/* Progress Indicator */}
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-300 ${
                          currentStep === step
                            ? 'bg-white text-gray-900 shadow-lg scale-110'
                            : currentStep > step
                            ? 'bg-white text-gray-900'
                            : 'bg-gray-600 text-gray-300'
                          }`}>
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                            currentStep > step ? 'bg-white' : 'bg-gray-600'
                            }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4 space-x-8 sm:space-x-16">
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${
                      currentStep === 1 ? 'text-white font-bold' : currentStep > 1 ? 'text-white' : 'text-gray-400'
                    }`}>
                      Property Details
                    </span>
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${
                      currentStep === 2 ? 'text-white font-bold' : currentStep > 2 ? 'text-white' : 'text-gray-400'
                    }`}>
                      Select Package
                    </span>
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${
                      currentStep === 3 ? 'text-white font-bold' : 'text-gray-400'
                    }`}>
                      Contact Info
                    </span>
                  </div>
                </div>

                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 sm:mb-8">
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Honeypot – hidden from users, leave empty */}
                  <div className="absolute -left-[9999px] top-0 opacity-0 w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="booking-website_url">Leave this blank</label>
                    <input
                      type="text"
                      id="booking-website_url"
                      name={HONEYPOT_FIELD}
                      value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                      onChange={handleInputChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Step 1: Property Address */}
                  {currentStep === 1 && (
                    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Property</span> <span className="bright-text-shadow text-black">Details</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat">
                          Enter your property address and details to get started
                        </p>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Address Input */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Address *</label>
                          <input
                            ref={autocompleteRef}
                            type="text"
                            name="propertyAddress"
                            value={formData.propertyAddress}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (!isManualAddress) {
                                handleAddressSearch(e.target.value);
                              }
                            }}
                            onFocus={() => {
                              trackFormFieldFocus('booking', 'propertyAddress');
                              if (addressSuggestions.length > 0 && !isManualAddress) {
                                setShowSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              trackFormFieldBlur('booking', 'propertyAddress');
                              setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            required
                            className="form-input text-lg"
                            placeholder={isManualAddress ? "Enter your full address manually..." : "Start typing your address..."}
                            autoComplete="off"
                            disabled={isManualAddress ? false : false}
                          />

                          {/* Address Suggestions Dropdown */}
                          {showSuggestions && addressSuggestions.length > 0 && !isManualAddress && (
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

                        {/* Manual Address Toggle */}
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={handleManualAddressToggle}
                            className="text-white/70 hover:text-white text-sm font-montserrat underline transition-colors duration-200"
                          >
                            {isManualAddress ? "Use address suggestions" : "Enter address manually"}
                          </button>
                        </div>

                        {/* Selected Address Display */}
                        {formData.propertyAddress && (
                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <div>
                                <p className="text-white font-montserrat font-medium">Selected Address:</p>
                                <p className="text-gray-300 font-montserrat text-sm mt-1">{formData.propertyAddress}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Unit Number and Property Size - Only show after address is selected */}
                        {formData.propertyAddress && (
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 font-montserrat">Unit Number (Optional)</label>
                              <input
                                type="text"
                                name="unitNumber"
                                value={formData.unitNumber}
                                onChange={handleInputChange}
                                onFocus={() => trackFormFieldFocus('booking', 'unitNumber')}
                                onBlur={() => trackFormFieldBlur('booking', 'unitNumber')}
                                className="form-input"
                                placeholder="e.g., Unit 101, Apt 2B, Suite 300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 font-montserrat">Property Size (sq ft) *</label>
                              <input
                                type="text"
                                name="propertySize"
                                value={formData.propertySize}
                                onChange={handleInputChange}
                                onFocus={() => trackFormFieldFocus('booking', 'propertySize')}
                                onBlur={() => trackFormFieldBlur('booking', 'propertySize')}
                                required
                                className="form-input"
                                placeholder="e.g., 1200, 2500, 3500"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-center mt-8">
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={!formData.propertyAddress || !formData.propertySize}
                            className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white"
                          >
                            Next: Select Package
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Package Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Choose Your</span> <span className="bright-text-shadow text-black">Package</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat max-w-3xl mx-auto">
                          Select the perfect package for your property. All packages include professional editing and fast delivery.
                        </p>
                      </div>

                      {/* Property Size Info */}
                      {formData.propertySize && (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-8">
                          <div className="flex justify-between items-center">
                            <div className="text-center flex-grow">
                              <h3 className="text-lg font-bold text-white mb-2 font-heading">Property Size: {formData.propertySize} sq ft</h3>
                              <p className="text-gray-300 font-montserrat text-sm">
                                {getPropertySizeSlab(formData.propertySize) === 'small' && 'Small Homes/Condos (0-999 sq ft) - 20-25 photos'}
                                {getPropertySizeSlab(formData.propertySize) === 'medium' && 'Medium Homes (1000-2499 sq ft) - 25-35 photos'}
                                {getPropertySizeSlab(formData.propertySize) === 'large' && 'Large Homes (2500-4500 sq ft) - 50-60 photos'}
                                {getPropertySizeSlab(formData.propertySize) === 'luxury' && 'Luxury Estates (>4500 sq ft) - 70-100 photos'}
                              </p>
                            </div>
                            {/* Total Cart Value - Top Right */}
                            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border-x-0 border-y-2 border-white">
                              <div className="text-center">
                                <p className="text-xs font-montserrat font-medium">Order Total:</p>
                                <p className="text-xl font-bold font-heading">${calculateTotal()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Discount Header */}
                      <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-gray-500 to-gray-300 text-white px-6 py-3 rounded-lg inline-block shadow-lg">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading mb-1 bright-text-shadow-dark">
                            Special Launch Discounts!
                          </h2>
                          {/* <p className="text-sm sm:text-base font-montserrat">
                            Save up to 15% on all packages - Limited time offer!
                          </p> */}
                        </div>
                      </div>

                      {/* Package Grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {getPackages(formData.propertySize).map((pkg) => (
                          <div key={pkg.id} className="relative">
                            {pkg.popular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                                <span className="bg-black text-white px-3 sm:px-6 py-1 sm:py-2 rounded-md border-x-0 border-y-2 border-white text-xs sm:text-sm font-light font-montserrat shadow-lg">
                                  Most Popular
                                </span>
                              </div>
                            )}

                            <div className={`relative overflow-hidden rounded-2xl border-2 sm:rounded-3xl transition-all duration-500 border-y-2 border-x-0 border-white h-full ${formData.selectedPackage === pkg.id
                                ? 'bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-white shadow-2xl'
                                : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-500 hover:shadow-xl'
                              }`}>
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20"></div>

                              <div className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                                <div className="text-center mb-6">
                                  <h3 className="text-lg sm:text-2xl font-bold mb-2 text-black bright-text-shadow font-heading">
                                    {pkg.name}
                                  </h3>
                                  <div className="mb-3">
                                    <div className="text-lg sm:text-xl text-gray-400 line-through font-montserrat">
                                      ${pkg.originalPrice}
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-bold text-white font-heading">
                                      ${pkg.basePrice}
                                    </div>
                                    <div className="text-sm text-green-400 font-montserrat font-semibold">
                                      Save {pkg.discountPercent}% (${pkg.originalPrice - pkg.basePrice})
                                    </div>
                                  </div>
                                  <div className="flex justify-center gap-2 mb-2">
                                    <p className="text-gray-300 text-xs sm:text-sm font-montserrat">
                                      {pkg.photoCount} Photos
                                    </p>
                                    {getVideoCount(pkg.id) > 0 && (
                                      <>
                                        <p className="text-gray-300 text-xs sm:text-sm font-montserrat">
                                          +
                                        </p>
                                        <p className="text-gray-300 text-xs sm:text-sm font-montserrat">
                                          {getVideoCount(pkg.id)} Video{getVideoCount(pkg.id) > 1 ? 's' : ''}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  <p className="text-gray-300 text-xs sm:text-sm font-montserrat leading-relaxed">
                                    {pkg.description}
                                  </p>
                                </div>

                                <ul className="space-y-2 flex-grow mb-6">
                                  {pkg.services.map((service, index) => (
                                    <li key={index} className="flex items-start">
                                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                      <span className="text-white/90 font-montserrat text-xs sm:text-sm">
                                        {service}
                                      </span>
                                    </li>
                                  ))}
                                </ul>

                                <button
                                  type="button"
                                  onClick={() => handlePackageSelect(pkg.id)}
                                  className={`w-full py-3 px-4 rounded-xl font-semibold font-montserrat transition-all duration-300 text-sm ${formData.selectedPackage === pkg.id
                                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                                      : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                                    }`}
                                >
                                  {formData.selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>


                      {/* Add-ons Section - Only show services not included in selected package */}
                      {formData.selectedPackage && (() => {
                        // const selectedPackage = getPackages(formData.propertySize).find(p => p.id === formData.selectedPackage);
                        // const packageServices = selectedPackage?.services || [];

                        // Map package services to add-on IDs to determine what's already included
                        const packageServiceMap: Record<string, string[]> = {
                          'essentials': ['interior_photos', 'exterior_photos', 'hdr_photos', 'twilight_photos'],
                          'enhanced': ['interior_photos', 'exterior_photos', 'hdr_photos', 'twilight_photos', 'drone_photos', 'floor_plan'],
                          'showcase': ['interior_photos', 'exterior_photos', 'hdr_photos', 'twilight_photos', 'cinematic_video', 'agent_walkthrough', 'social_reel', 'listing_website'],
                          'premium': ['interior_photos', 'exterior_photos', 'hdr_photos', 'twilight_photos', 'cinematic_video', 'agent_walkthrough', 'social_reel', 'listing_website', 'virtual_tour', 'drone_photos'],
                          'ultimate': ['interior_photos', 'exterior_photos', 'hdr_photos', 'twilight_photos', 'drone_photos', 'cinematic_video', 'agent_walkthrough', 'social_reel'],
                          'airbnb': ['interior_photos', 'exterior_photos', 'hdr_photos', 'airbnb_optimization']
                        };

                        const includedServices = packageServiceMap[formData.selectedPackage] || [];

                        // Don't show add-ons for Airbnb package
                        if (formData.selectedPackage === 'airbnb') return null;

                        // Filter add-ons to only show those not included in the package
                        let availableAddOns = addOns.filter(addOn => !includedServices.includes(addOn.id));
                        
                        // Only show "Extra Photos" add-on for Ultimate package
                        if (formData.selectedPackage !== 'ultimate') {
                          availableAddOns = availableAddOns.filter(addOn => addOn.id !== 'extra_photos');
                        }

                        if (availableAddOns.length === 0) return null;

                        return (
                          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 font-heading text-center">
                              Additional Services
                            </h3>
                            <p className="text-gray-300 font-montserrat text-sm text-center mb-6">
                              Add extra services to enhance your package
                            </p>
                            

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {availableAddOns.map((addOn) => {
                                const multiplier = getSizeMultiplier(formData.propertySize);
                                const isVirtualStaging = addOn.id === 'virtual_staging';
                                const isSelected = isVirtualStaging 
                                  ? formData.selectedAddOns.some(id => id.startsWith('virtual_staging_'))
                                  : formData.selectedAddOns.includes(addOn.id);
                                
                                // Calculate virtual staging price
                                let adjustedPrice = Math.round(addOn.price * multiplier);
                                if (isVirtualStaging) {
                                  const basePrice = 99;
                                  const additionalPhotos = Math.max(0, formData.virtualStagingPhotos - 3);
                                  const additionalPrice = additionalPhotos * 20;
                                  adjustedPrice = Math.round((basePrice + additionalPrice) * multiplier);
                                }
                                
                                return (
                                  <div key={addOn.id} className={`p-4  rounded-lg border border-gray-700 hover:border-gray-500 transition-colors ${formData.selectedAddOns.includes(addOn.id) ? 'bg-gray-600' : 'bg-gray-800'}`}>
                                    <div className="flex items-center mb-3">
                                      <input
                                        type="checkbox"
                                        id={addOn.id}
                                        checked={isSelected}
                                        onChange={() => handleAddOnToggle(addOn.id)}
                                        className="w-4 h-4 text-white bg-gray-700 border-gray-600 rounded focus:ring-white focus:ring-2"
                                      />
                                      <div className="ml-3 flex-grow">
                                        <label htmlFor={addOn.id} className="text-white font-montserrat text-sm font-medium cursor-pointer">
                                          {addOn.name}
                                        </label>
                                        <p className="text-gray-400 text-xs font-montserrat">{addOn.description}</p>
                                        <p className="text-white font-montserrat text-sm font-bold">${adjustedPrice}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Virtual Staging Controls - Only show when selected */}
                                    {isVirtualStaging && isSelected && (
                                      <div className="mt-4 pt-4 border-t border-gray-700">
                                        <div className="flex items-center justify-center space-x-4">
                                          <button
                                            type="button"
                                            onClick={() => handleVirtualStagingPhotosChange(false)}
                                            disabled={formData.virtualStagingPhotos <= 3}
                                            className="w-8 h-8 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                          </button>
                                          
                                          <div className="text-center">
                                            <div className="text-lg font-bold text-white font-heading">
                                              {formData.virtualStagingPhotos}
                                            </div>
                                            <div className="text-xs text-gray-400 font-montserrat">
                                              Photos
                                            </div>
                                          </div>
                                          
                                          <button
                                            type="button"
                                            onClick={() => handleVirtualStagingPhotosChange(true)}
                                            className="w-8 h-8 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                          </button>
                                        </div>
                                        
                                        {formData.virtualStagingPhotos > 3 && (
                                          <div className="mt-3 text-center">
                                            <p className="text-gray-300 font-montserrat text-xs">
                                              {formData.virtualStagingPhotos - 3} additional photos × ${Math.round(20 * multiplier)} = 
                                              <span className="font-bold ml-1">
                                                +${Math.round((formData.virtualStagingPhotos - 3) * 20 * multiplier)}
                                              </span>
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Total Cart Value - Bottom Center */}
                      {formData.selectedPackage && (
                        <div className="flex justify-center mb-6">
                          <div className="bg-white text-gray-900 px-6 py-3 rounded-lg border-x-0 border-y-2 border-white shadow-lg">
                            <div className="text-center flex flex-row items-center gap-2">
                              <p className="text-xl font-montserrat font-medium">Order Total:</p>
                              <p className="text-2xl font-bold font-heading">${calculateTotal()}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold font-montserrat hover:bg-gray-600 transition-colors duration-300 border border-gray-600"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!formData.selectedPackage}
                          className="bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white"
                        >
                          Next: Contact Info
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Contact Information */}
                  {currentStep === 3 && (
                    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Contact</span> <span className="bright-text-shadow text-black">Information</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat">
                          Provide your contact details to complete your booking
                        </p>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Personal Information */}
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2 font-montserrat">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => trackFormFieldFocus('booking', 'name')}
                              onBlur={() => trackFormFieldBlur('booking', 'name')}
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
                              onFocus={() => trackFormFieldFocus('booking', 'email')}
                              onBlur={() => {
                                validateField('email', formData.email);
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
                          <label className="block text-sm font-medium text-white mb-2 font-montserrat">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={() => trackFormFieldFocus('booking', 'phone')}
                            onBlur={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              setFormData(prev => ({ ...prev, phone: formatted }));
                              validateField('phone', formatted);
                              trackFormFieldBlur('booking', 'phone');
                            }}
                            className={`form-input ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="(555) 123-4567"
                          />
                          {fieldErrors.phone && (
                            <p className="text-red-400 text-sm mt-1 font-montserrat">{fieldErrors.phone}</p>
                          )}
                        </div>

                        {/* Preferred Date and Time Selection */}
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <h3 className="text-lg font-semibold text-white mb-4 font-heading">Schedule Your Session</h3>
                          
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Date Selection */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Preferred Date
                                </span>
                              </label>
                              <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                onFocus={() => trackFormFieldFocus('booking', 'preferredDate')}
                                onBlur={() => trackFormFieldBlur('booking', 'preferredDate')}
                                min={new Date().toISOString().split('T')[0]}
                                max={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                className="form-input text-center font-montserrat"
                              />
                              <p className="text-gray-400 text-xs mt-1 font-montserrat">
                                Next 3 weeks available
                              </p>
                            </div>

                            {/* Time Selection */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Preferred Time
                                </span>
                              </label>
                              <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleInputChange}
                                onFocus={() => trackFormFieldFocus('booking', 'preferredTime')}
                                onBlur={() => trackFormFieldBlur('booking', 'preferredTime')}
                                disabled={!formData.preferredDate}
                                className={`form-input font-montserrat ${!formData.preferredDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <option value="">
                                  {formData.preferredDate ? 'Select time slot' : 'Select date first'}
                                </option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="9:30 AM">9:30 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="10:30 AM">10:30 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="12:30 PM">12:30 PM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="1:30 PM">1:30 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="2:30 PM">2:30 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="3:30 PM">3:30 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="4:30 PM">4:30 PM</option>
                                <option value="5:00 PM">5:00 PM</option>
                                <option value="5:30 PM">5:30 PM</option>
                                <option value="6:00 PM">6:00 PM</option>
                              </select>
                              <p className="text-gray-400 text-xs mt-1 font-montserrat">
                                9:00 AM - 6:00 PM (30-min slots)
                              </p>
                            </div>
                          </div>

                          {/* Selected Date/Time Display */}
                          {(formData.preferredDate || formData.preferredTime) && (
                            <div className="mt-4 pt-4 border-t border-gray-600">
                              <div className="flex items-center justify-center">
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                  <div className="text-center">
                                    <p className="text-white font-montserrat text-sm">
                                      <span className="font-semibold">Selected:</span>
                                    </p>
                                    <p className="text-white font-heading text-lg">
                                      {formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      }) : 'No date selected'}
                                      {formData.preferredTime && ` at ${formData.preferredTime}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
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
                            placeholder="Tell us more about your project, special requirements, or any questions you have..."
                          />
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                          <h3 className="text-lg font-bold text-white mb-4 font-heading">Order Summary</h3>
                          {formData.selectedPackage && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-white">
                                <span className="font-montserrat">
                                  {getPackages(formData.propertySize).find(p => p.id === formData.selectedPackage)?.name}
                                </span>
                                <div className="text-right">
                                  <div className="text-sm text-gray-400 line-through font-montserrat">
                                    ${getPackages(formData.propertySize).find(p => p.id === formData.selectedPackage)?.originalPrice}
                                  </div>
                                  <span className="font-montserrat font-bold text-white">
                                    ${getPackages(formData.propertySize).find(p => p.id === formData.selectedPackage)?.basePrice}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Preferred Date and Time */}
                              {(formData.preferredDate || formData.preferredTime) && (
                                <div className="pt-2 border-t border-gray-600">
                                  <div className="text-gray-300 text-sm font-montserrat">
                                    <div className="flex justify-between">
                                      <span>Preferred Date:</span>
                                      <span>{formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      }) : 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Preferred Time:</span>
                                      <span>{formData.preferredTime || 'Not specified'}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {formData.selectedAddOns.map(addOnId => {
                                const isVirtualStaging = addOnId.startsWith('virtual_staging_');
                                const baseAddOnId = isVirtualStaging ? 'virtual_staging' : addOnId;
                                const addOn = addOns.find(a => a.id === baseAddOnId);
                                const multiplier = getSizeMultiplier(formData.propertySize);
                                let adjustedPrice = Math.round((addOn?.price || 0) * multiplier);
                                
                                // Special handling for virtual staging
                                if (isVirtualStaging) {
                                  const basePrice = 99;
                                  const photoCount = parseInt(addOnId.split('_')[2]) || formData.virtualStagingPhotos;
                                  const additionalPhotos = Math.max(0, photoCount - 3);
                                  const additionalPrice = additionalPhotos * 20;
                                  adjustedPrice = Math.round((basePrice + additionalPrice) * multiplier);
                                }
                                
                                return addOn ? (
                                  <div key={addOnId} className="flex justify-between text-gray-300">
                                    <span className="font-montserrat text-sm">
                                      + {addOn.name}
                                      {isVirtualStaging && ` (${addOnId.split('_')[2] || formData.virtualStagingPhotos} photos)`}
                                    </span>
                                    <span className="font-montserrat text-sm">+${adjustedPrice}</span>
                                  </div>
                                ) : null;
                              })}
                              <div className="border-t border-gray-600 pt-2 mt-4">
                                <div className="flex justify-between text-white">
                                  <span className="font-montserrat font-bold">Total</span>
                                  <span className="font-montserrat font-bold text-lg">${calculateTotal()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold font-montserrat hover:bg-gray-600 transition-colors duration-300 border border-gray-600"
                          >
                            Previous
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.name || !formData.email || !!fieldErrors.email || !!fieldErrors.phone}
                            className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white"
                          >
                            {isSubmitting ? 'Submitting...' : 'Complete Booking'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
