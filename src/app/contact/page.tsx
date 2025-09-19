'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Image from 'next/image';
import servicebg from '@/assets/images/service-bg-2.jpg';
import { handleContactSubmission } from './contact-form-handler';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
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
        } else if (value.trim().length < 2) {
          newFieldErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newFieldErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newFieldErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newFieldErrors.email = 'Please enter a valid email address';
        } else {
          delete newFieldErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
          newFieldErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newFieldErrors.phone;
        }
        break;
      case 'subject':
        if (!value) {
          newFieldErrors.subject = 'Please select a subject';
        } else {
          delete newFieldErrors.subject;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newFieldErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newFieldErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newFieldErrors.message;
        }
        break;
    }
    
    setFieldErrors(newFieldErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("APP_LOG:: Form Submitted formData", formData);
    
    // Store current form data for submission
    const currentFormData = { ...formData };
    
    const success = await handleContactSubmission(
      currentFormData,
      setIsSubmitting,
      setIsSubmitted,
      setErrors
    );
    
    // Clear form only if submission was successful
    if (success) {
      clearForm();
    }
  };


  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[50vh] sm:h-[70vh] pt-20 sm:pt-60">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={servicebg.src}
            alt="Contact BrightOne Real Estate Photography"
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
              <span className="bright-text-shadow text-black">Get In</span>
              <span className="bright-text-shadow-dark"> Touch</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-montserrat">
              Ready to showcase your properties with professional photography? Let&apos;s discuss your project.
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
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 font-heading">Message Sent!</h2>
                <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-8 font-montserrat">
                  Thank you for contacting us! We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white text-gray-900 py-1.5 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 border-x-0 border-y-2 border-white text-xs sm:text-base"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
      <section className="section-padding bg-gray-900">
        <div className="container-custom">
          {/* <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              <span className="bright-text-shadow-dark">Contact</span> <span className="bright-text-shadow text-black">Us</span>
            </h2>
            <p className="text-xl text-white/80 font-montserrat max-w-3xl mx-auto">
              Have questions about our services? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div> */}
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
              <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 font-heading">Send us a Message</h3>
              
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

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-medium text-white mb-2 font-montserrat">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={(e) => validateField('name', e.target.value)}
                      required
                      className={`form-input ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Your name"
                    />
                    {fieldErrors.name && (
                      <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white mb-2 font-montserrat">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={(e) => validateField('email', e.target.value)}
                      required
                      className={`form-input ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                      <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-white mb-2 font-montserrat">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={(e) => {
                      handlePhoneBlur(e);
                      validateField('phone', e.target.value);
                    }}
                    className={`form-input ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-white mb-2 font-montserrat">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('subject', e.target.value)}
                    required
                    className={`form-select ${fieldErrors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Request</option>
                    <option value="quote">Get a Quote</option>
                    <option value="portfolio">Portfolio Question</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.subject && (
                    <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-white mb-2 font-montserrat">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('message', e.target.value)}
                    required
                    rows={6}
                    className={`form-textarea ${fieldErrors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Tell us about your project..."
                  />
                  {fieldErrors.message && (
                    <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-gray-900 py-2 sm:py-4 px-4 sm:px-8 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-x-0 border-y-2 border-white text-xs sm:text-base"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 font-heading">Get in Touch</h3>
                <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-lg font-montserrat">
                  We&apos;re here to help you showcase your properties in the best possible light. Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-xl font-semibold text-white mb-1 sm:mb-2 font-heading">Phone</h4>
                    <p className="text-white/90 text-sm sm:text-lg font-montserrat">(416) 419-9689</p>
                    <p className="text-xs sm:text-sm text-white/60 font-montserrat">Mon-Sat 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-xl font-semibold text-white mb-1 sm:mb-2 font-heading">Email</h4>
                    <a href="mailto:contact@brightone.ca" className="text-white/90 text-sm sm:text-lg font-montserrat">contact@brightone.ca</a>
                    <p className="text-xs sm:text-sm text-white/60 font-montserrat">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md sm:text-xl font-semibold text-white mb-1 sm:mb-2 font-heading">Locations Served</h4>
                    <p className="text-white/90 text-xs sm:text-base lg:text-lg font-montserrat">Greater Toronto Area, ON</p>
                    <p className="text-white/90 text-xs sm:text-base lg:text-lg font-montserrat">Durham Region, ON</p>
                    <p className="text-white/90 text-xs sm:text-base lg:text-lg font-montserrat">Peel Region, ON</p>
                    <p className="text-white/90 text-xs sm:text-base lg:text-lg font-montserrat">York Region, ON</p>
                    <p className="text-white/90 text-xs sm:text-base lg:text-lg font-montserrat">Kawartha Lakes, ON</p>
                    <p className="text-xs sm:text-sm text-white/60 font-montserrat">Serving GTA and surrounding areas</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 sm:p-6 border border-gray-600">
                <h4 className="text-md sm:text-xl font-semibold text-white mb-2 sm:mb-3 font-heading">Quick Response Guarantee</h4>
                <p className="text-white/80 text-xs sm:text-sm font-montserrat">
                  We understand that real estate moves fast. That&apos;s why we guarantee a response to all inquiries within 24 hours, and often much sooner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>)}

      <Footer />
    </div>
  );
}