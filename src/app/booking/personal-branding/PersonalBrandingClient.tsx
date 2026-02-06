'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import heroBg from '@/assets/images/service-bg-2.jpg';
import { handleBookingSubmission, BookingFormData } from '../booking-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
  trackFormFieldFocus,
  trackFormFieldBlur,
  trackFormFieldChange,
  trackFormSubmission,
  trackBookingStart,
  trackBookingReset,
  trackBookingAbandonment,
} from '@/lib/analytics';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  deliverables: string[];
  popular?: boolean;
  duration: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PACKAGES: Package[] = [
  {
    id: 'headshot',
    name: 'Headshot Session',
    description: 'Clean, professional headshots perfect for LinkedIn, business cards, and your website.',
    price: 199,
    duration: '30 min',
    deliverables: [
      '5 retouched digital images',
      '1 outfit / 1 look',
      'Studio or on-location',
      'Professional lighting & posing direction',
      'Online gallery delivery',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Portrait',
    description: 'Extended session for entrepreneurs and professionals who need variety across platforms.',
    price: 349,
    duration: '1 hour',
    deliverables: [
      '15 retouched digital images',
      '2 outfits / 2 looks',
      'Studio + 1 on-location setup',
      'Headshots & half-body portraits',
      'Social media–optimized crops',
      'Online gallery delivery',
    ],
  },
  {
    id: 'brand_story',
    name: 'Brand Story Package',
    description: 'A comprehensive shoot that tells your brand story — ideal for coaches, realtors, and creatives.',
    price: 549,
    duration: '2 hours',
    popular: true,
    deliverables: [
      '30 retouched digital images',
      '3 outfits / looks',
      'Multiple locations or setups',
      'Headshots, lifestyle & action shots',
      'Behind-the-scenes content',
      'Social media–optimized crops',
      'Online gallery delivery',
    ],
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Designed for influencers, entrepreneurs, and brands that need a full library of social-ready content.',
    price: 749,
    duration: '3 hours',
    deliverables: [
      '50 retouched digital images',
      '4 outfits / looks',
      'Multiple locations',
      'Headshots, lifestyle, flat-lays & detail shots',
      '1 short-form video reel (15–30 s)',
      'Social media–optimized crops',
      'Online gallery delivery',
    ],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Premium personal and team branding for executives, corporate leaders, and high-profile professionals.',
    price: 999,
    duration: 'Half day',
    deliverables: [
      '75+ retouched digital images',
      'Unlimited outfits / looks',
      'Up to 3 locations',
      'Individual & team headshots',
      'Lifestyle & environmental portraits',
      '2 short-form video reels',
      'Behind-the-scenes video',
      'Social media–optimized crops',
      'Online gallery delivery',
    ],
  },
];

const ADD_ONS: AddOn[] = [
  { id: 'extra_images_10', name: 'Extra 10 Retouched Images', price: 99 },
  { id: 'rush_delivery', name: 'Rush Delivery (48 h)', price: 99 },
  { id: 'video_reel', name: 'Social Media Video Reel', price: 149 },
  { id: 'hair_makeup', name: 'Hair & Makeup Artist', price: 199 },
  { id: 'second_location', name: 'Additional Location', price: 99 },
  { id: 'print_ready', name: 'Print-Ready Files (300 dpi)', price: 49 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PersonalBrandingClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedPackage: '',
    selectedAddOns: [] as string[],
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    sessionPurpose: '',
    message: '',
    [HONEYPOT_FIELD]: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formStartTime] = useState<number>(Date.now());

  const initialFormState = {
    selectedPackage: '',
    selectedAddOns: [] as string[],
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    sessionPurpose: '',
    message: '',
    [HONEYPOT_FIELD]: '',
  };

  /* helpers */
  const selectedPkg = PACKAGES.find((p) => p.id === formData.selectedPackage);

  const calculateTotal = () => {
    let total = selectedPkg?.price ?? 0;
    formData.selectedAddOns.forEach((id) => {
      const addon = ADD_ONS.find((a) => a.id === id);
      if (addon) total += addon.price;
    });
    return total;
  };

  /* analytics */
  useEffect(() => { trackBookingStart(); }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSubmitted && !isSubmitting) trackBookingAbandonment(currentStep);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, isSubmitted, isSubmitting]);

  /* reset */
  const resetForm = () => {
    trackBookingReset(currentStep);
    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors([]);
    setFieldErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  /* validation */
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return null;
  };

  const validateField = (name: string, value: string) => {
    let error: string | null = null;
    if (name === 'email') error = validateEmail(value);
    setFieldErrors((prev) => ({ ...prev, [name]: error || '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') validateField(name, value);
    trackFormFieldChange('personal_branding_booking', name, value);
  };

  /* phone formatting */
  const formatPhoneNumber = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned.length === 10) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    if (cleaned.length === 11 && cleaned.startsWith('1'))
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return raw;
  };

  /* navigation */
  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  /* submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) { handleNext(); return; }

    const newErrors: string[] = [];
    if (!formData.selectedPackage) newErrors.push('Please select a package');
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (validateEmail(formData.email)) newErrors.push('Please enter a valid email');

    if (newErrors.length > 0) { setErrors(newErrors); return; }

    setErrors([]);

    try {
      const recaptchaToken = await getRecaptchaToken('booking');
      const bookingData: BookingFormData & { recaptchaToken?: string } = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: 'personal_branding',
        propertyAddress: 'N/A — Personal Branding Session',
        selectedPackage: formData.selectedPackage,
        selectedAddOns: formData.selectedAddOns,
        packageType: selectedPkg?.name || formData.selectedPackage,
        totalPrice: String(calculateTotal()),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.sessionPurpose
          ? `Purpose: ${formData.sessionPurpose}\n\n${formData.message}`
          : formData.message,
        recaptchaToken,
      };

      await handleBookingSubmission(
        bookingData as BookingFormData,
        setIsSubmitting,
        setIsSubmitted,
        setErrors,
        formStartTime,
      );
    } catch {
      setErrors(['Something went wrong. Please try again.']);
      trackFormSubmission('personal_branding_booking', false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-12 sm:pb-20">
        <div className="absolute inset-0">
          <Image src={heroBg} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-montserrat mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to services
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading mb-4 sm:mb-6">
            <span className="bright-text-shadow text-black">Personal Branding</span>{' '}
            <span className="bright-text-shadow-dark">Media</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/80 font-montserrat leading-relaxed mb-6 sm:mb-8">
            Professional headshots, lifestyle portraits, and social-ready content — everything you need to stand out and make an impression.
          </p>
          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            <a href="#booking-form" className="btn-primary font-light font-montserrat border-x-0 border-y-2 border-white text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
              Start Booking
            </a>
            <a href="/contact" className="btn-secondary font-light font-montserrat text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-3">
              Ask Questions
            </a>
          </div>
        </div>
      </section>

      {/* ---- Success ---- */}
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
                  Thank you for your booking request! We&apos;ve received your information and will get back to you within 24 hours to confirm your session.
                </p>
                <div className="flex flex-row gap-3 sm:gap-4 justify-center">
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
          {/* ---- Multi-Step Form ---- */}
          <section id="booking-form" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-800">
            <div className="container-custom px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">

                {/* Progress Indicator */}
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-300 ${
                            currentStep === step
                              ? 'bg-white text-gray-900 shadow-lg scale-110'
                              : currentStep > step
                              ? 'bg-white text-gray-900'
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                              currentStep > step ? 'bg-white' : 'bg-gray-600'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4 space-x-8 sm:space-x-16">
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${currentStep === 1 ? 'text-white font-bold' : currentStep > 1 ? 'text-white' : 'text-gray-400'}`}>
                      Choose Package
                    </span>
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${currentStep === 2 ? 'text-white font-bold' : currentStep > 2 ? 'text-white' : 'text-gray-400'}`}>
                      Add-Ons
                    </span>
                    <span className={`text-xs sm:text-sm font-montserrat transition-all duration-300 ${currentStep === 3 ? 'text-white font-bold' : 'text-gray-400'}`}>
                      Contact Info
                    </span>
                  </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 sm:mb-8">
                    <ul className="list-disc list-inside">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px] top-0 opacity-0 w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="pb-website_url">Leave this blank</label>
                    <input type="text" id="pb-website_url" name={HONEYPOT_FIELD} value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''} onChange={handleInputChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  {/* ==================== STEP 1 — Package Selection ==================== */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Choose Your</span>{' '}
                          <span className="bright-text-shadow text-black">Package</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat max-w-3xl mx-auto">
                          Select the session that fits your needs. All packages include professional retouching and colour grading.
                        </p>
                      </div>

                      {/* Package Grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {PACKAGES.map((pkg) => (
                          <div key={pkg.id} className="relative">
                            {pkg.popular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                                <span className="bg-black text-white px-3 sm:px-6 py-1 sm:py-2 rounded-md border-x-0 border-y-2 border-white text-xs sm:text-sm font-light font-montserrat shadow-lg">
                                  Most Popular
                                </span>
                              </div>
                            )}

                            <div
                              className={`relative overflow-hidden rounded-2xl border-2 sm:rounded-3xl transition-all duration-500 border-y-2 border-x-0 border-white h-full ${
                                formData.selectedPackage === pkg.id
                                  ? 'bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-white shadow-2xl'
                                  : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-500 hover:shadow-xl'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20" />

                              <div className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                                <div className="text-center mb-6">
                                  <h3 className="text-lg sm:text-2xl font-bold mb-2 text-black bright-text-shadow font-heading">
                                    {pkg.name}
                                  </h3>
                                  <div className="mb-2">
                                    <span className="text-3xl sm:text-4xl font-bold text-white font-heading">${pkg.price}</span>
                                  </div>
                                  <p className="text-gray-300 text-xs sm:text-sm font-montserrat mb-1">{pkg.duration} session</p>
                                  <p className="text-gray-300 text-xs sm:text-sm font-montserrat leading-relaxed">{pkg.description}</p>
                                </div>

                                <ul className="space-y-2 flex-grow mb-6">
                                  {pkg.deliverables.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                      <span className="text-white/90 font-montserrat text-xs sm:text-sm">{item}</span>
                                    </li>
                                  ))}
                                </ul>

                                <button
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, selectedPackage: pkg.id }))}
                                  className={`w-full py-3 px-4 rounded-xl font-semibold font-montserrat transition-all duration-300 text-sm ${
                                    formData.selectedPackage === pkg.id
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

                      {/* Next Button */}
                      <div className="flex justify-center mt-8">
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!formData.selectedPackage}
                          className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white"
                        >
                          Next: Add-Ons
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==================== STEP 2 — Add-Ons ==================== */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Enhance Your</span>{' '}
                          <span className="bright-text-shadow text-black">Session</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat max-w-3xl mx-auto">
                          Add extras to get even more from your shoot. You can skip this step if you&apos;re all set.
                        </p>
                      </div>

                      {/* Selected Package Summary */}
                      {selectedPkg && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-bold text-white font-heading">{selectedPkg.name}</h3>
                              <p className="text-gray-300 font-montserrat text-sm">{selectedPkg.duration} session</p>
                            </div>
                            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border-x-0 border-y-2 border-white">
                              <p className="text-xs font-montserrat font-medium">Order Total:</p>
                              <p className="text-xl font-bold font-heading">${calculateTotal()}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Add-on grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {ADD_ONS.map((addon) => {
                          const isSelected = formData.selectedAddOns.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedAddOns: isSelected
                                    ? prev.selectedAddOns.filter((id) => id !== addon.id)
                                    : [...prev.selectedAddOns, addon.id],
                                }));
                              }}
                              className={`p-4 sm:p-5 rounded-xl text-left transition-all duration-300 border ${
                                isSelected
                                  ? 'bg-white/10 border-white shadow-lg'
                                  : 'bg-gray-900/60 border-gray-700 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-semibold font-montserrat text-sm">{addon.name}</span>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-white border-white' : 'border-gray-500'}`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <p className="text-white font-bold font-heading text-lg">+${addon.price}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Nav Buttons */}
                      <div className="flex justify-center gap-4 mt-8">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="bg-transparent text-white py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-white/10 transition-colors duration-300 border border-white text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 border-x-0 border-y-2 border-white"
                        >
                          Next: Contact Info
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==================== STEP 3 — Contact Info ==================== */}
                  {currentStep === 3 && (
                    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                          <span className="bright-text-shadow-dark">Your</span>{' '}
                          <span className="bright-text-shadow text-black">Details</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-white/80 font-montserrat">
                          Tell us how to reach you and when you&apos;d like to shoot.
                        </p>
                      </div>

                      {/* Order summary */}
                      {selectedPkg && (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-8 max-w-2xl mx-auto">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium font-montserrat">{selectedPkg.name}</p>
                              {formData.selectedAddOns.length > 0 && (
                                <p className="text-gray-400 text-sm font-montserrat mt-1">
                                  + {formData.selectedAddOns.length} add-on{formData.selectedAddOns.length > 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-white font-heading">${calculateTotal()}</p>
                          </div>
                        </div>
                      )}

                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Name & Email */}
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2 font-montserrat">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => trackFormFieldFocus('personal_branding_booking', 'name')}
                              onBlur={() => trackFormFieldBlur('personal_branding_booking', 'name')}
                              required
                              className="form-input"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2 font-montserrat">Email *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => trackFormFieldFocus('personal_branding_booking', 'email')}
                              onBlur={(e) => { trackFormFieldBlur('personal_branding_booking', 'email'); validateField('email', e.target.value); }}
                              required
                              className={`form-input ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="your@email.com"
                            />
                            {fieldErrors.email && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.email}</p>}
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 font-montserrat">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={() => trackFormFieldFocus('personal_branding_booking', 'phone')}
                            onBlur={(e) => {
                              trackFormFieldBlur('personal_branding_booking', 'phone');
                              setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
                            }}
                            className="form-input"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        {/* Session Purpose */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 font-montserrat">What are the photos for? *</label>
                          <select
                            name="sessionPurpose"
                            value={formData.sessionPurpose}
                            onChange={handleInputChange}
                            required
                            className="form-select"
                          >
                            <option value="">Select a purpose</option>
                            <option value="linkedin_headshots">LinkedIn / Professional Headshots</option>
                            <option value="realtor_branding">Realtor Personal Branding</option>
                            <option value="entrepreneur_branding">Entrepreneur / Business Branding</option>
                            <option value="social_media_content">Social Media Content</option>
                            <option value="corporate_team">Corporate / Team Photos</option>
                            <option value="speaker_author">Speaker / Author Portraits</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Date & Time */}
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2 font-montserrat">Preferred Date</label>
                            <input
                              type="date"
                              name="preferredDate"
                              value={formData.preferredDate}
                              onChange={handleInputChange}
                              onFocus={() => trackFormFieldFocus('personal_branding_booking', 'preferredDate')}
                              onBlur={() => trackFormFieldBlur('personal_branding_booking', 'preferredDate')}
                              className="form-input"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2 font-montserrat">Preferred Time</label>
                            <select
                              name="preferredTime"
                              value={formData.preferredTime}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select a time</option>
                              <option value="morning">Morning (8 AM – 11 AM)</option>
                              <option value="midday">Midday (11 AM – 2 PM)</option>
                              <option value="afternoon">Afternoon (2 PM – 5 PM)</option>
                              <option value="golden_hour">Golden Hour (1 h before sunset)</option>
                            </select>
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 font-montserrat">Additional Notes</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => trackFormFieldFocus('personal_branding_booking', 'message')}
                            onBlur={() => trackFormFieldBlur('personal_branding_booking', 'message')}
                            rows={4}
                            className="form-textarea"
                            placeholder="Tell us about your brand, preferred style, locations, or any ideas you have..."
                          />
                        </div>

                        {/* Nav Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="bg-transparent text-white py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-white/10 transition-colors duration-300 border border-white text-sm"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white text-gray-900 py-3 px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
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
