'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/Logo-final@0.5x.png';
import servicebg from '@/assets/images/service-bg-2.jpg';
import Footer from '../components/Footer';
import { handleContactSubmission } from '../contact/contact-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { HONEYPOT_FIELD } from '@/lib/validation';

type SocialIconName = 'facebook' | 'instagram' | 'pinterest' | 'linkedin' | 'youtube';

const SOCIAL_LINKS: Array<{ name: string; handle: string; href: string; icon: SocialIconName }> = [
  { name: 'Facebook', handle: 'BrightOneInc', href: 'https://www.facebook.com/BrightOneInc', icon: 'facebook' },
  { name: 'Instagram', handle: '@brightoneinc', href: 'https://www.instagram.com/brightoneinc', icon: 'instagram' },
  { name: 'Pinterest', handle: 'brightOneInc', href: 'https://in.pinterest.com/brightOneInc/', icon: 'pinterest' },
  { name: 'LinkedIn', handle: 'brightoneInc', href: 'https://www.linkedin.com/company/brightoneInc/', icon: 'linkedin' },
  { name: 'YouTube', handle: '@brightoneca', href: 'https://youtube.com/@brightoneca', icon: 'youtube' },
];

const SERVICES = [
  { title: 'Interior Photography', description: 'Professional interior shots that showcase every room\'s potential with perfect lighting and composition.' },
  { title: 'Drone & Exterior Photography', description: 'Stunning aerial views and unique perspectives of your property.' },
  { title: 'HDR & Professional Edit', description: 'Advanced HDR and professional editing for perfect lighting and color balance.' },
  { title: 'Virtual Staging', description: 'Transform empty spaces with virtual furniture and decor.' },
  { title: 'Custom Listing Website', description: 'Dedicated property websites with photo gallery, virtual tour, floor plans, and contact forms.' },
  { title: 'Floor Plans', description: 'Detailed, accurate floor plans to help buyers visualize the layout.' },
];

function SocialIcon({ icon }: { icon: SocialIconName }) {
  const className = 'w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0';
  switch (icon) {
    case 'facebook':
      return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'instagram':
      return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'pinterest':
      return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>;
    case 'linkedin':
      return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'youtube':
      return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    default:
      return null;
  }
}

export default function BookPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    [HONEYPOT_FIELD]: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
  };

  const validateField = (name: string, value: string) => {
    const newFieldErrors = { ...fieldErrors };
    switch (name) {
      case 'name':
        if (!value.trim()) newFieldErrors.name = 'Name is required';
        else if (value.trim().length < 2) newFieldErrors.name = 'Name must be at least 2 characters';
        else delete newFieldErrors.name;
        break;
      case 'email':
        if (!value.trim()) newFieldErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newFieldErrors.email = 'Please enter a valid email address';
        else delete newFieldErrors.email;
        break;
      case 'phone':
        if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) newFieldErrors.phone = 'Please enter a valid phone number';
        else delete newFieldErrors.phone;
        break;
      case 'subject':
        if (!value) newFieldErrors.subject = 'Please select a subject';
        else delete newFieldErrors.subject;
        break;
      case 'message':
        if (!value.trim()) newFieldErrors.message = 'Message is required';
        else if (value.trim().length < 10) newFieldErrors.message = 'Message must be at least 10 characters';
        else delete newFieldErrors.message;
        break;
    }
    setFieldErrors(newFieldErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const recaptchaToken = await getRecaptchaToken('contact');
    const payload = { ...formData, recaptchaToken, [HONEYPOT_FIELD]: formData[HONEYPOT_FIELD as keyof typeof formData] ?? '' };
    const success = await handleContactSubmission(payload, setIsSubmitting, setIsSubmitted, setErrors);
    if (success) setFormData({ name: '', email: '', phone: '', subject: '', message: '', [HONEYPOT_FIELD]: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Minimal header – mobile friendly touch targets */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[56px] sm:min-h-[64px]">
            <Link href="/" className="flex items-center min-h-[44px] min-w-[44px] -m-2 p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Home">
              <Image src={logo.src} alt="BrightOne" width={120} height={32} className="h-8 w-auto sm:h-9" />
            </Link>
            <Link
              href="/"
              className="font-montserrat text-sm sm:text-base text-white uppercase border border-white/40 hover:border-white hover:bg-white/5 rounded-lg px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[40vh] sm:min-h-[50vh] pt-[72px] sm:pt-[80px]">
        <div className="absolute inset-0">
          <Image src={servicebg.src} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight font-heading mb-3 sm:mb-4">
              <span className="bright-text-shadow text-black">Thanks for visiting</span>
              <span className="bright-text-shadow-dark"> from our socials</span>
            </h1>
            <p className="text-sm sm:text-lg text-white/90 font-montserrat">
              Your link to BrightOne – services and contact below.
            </p>
          </div>
        </div>
      </section>

      {/* Social handles – stacked on mobile, touch-friendly */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6 sm:mb-8 text-center">Connect with us</h2>
          <div className="flex flex-col gap-3 sm:gap-4 max-w-md mx-auto">
            {SOCIAL_LINKS.map(({ name, handle, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600 transition-colors min-h-[56px] sm:min-h-[60px]"
              >
                <span className="text-gray-300">
                  <SocialIcon icon={icon} />
                </span>
                <span className="font-montserrat text-base sm:text-lg font-medium">{name}</span>
                <span className="ml-auto text-white/70 text-sm sm:text-base font-montserrat truncate max-w-[140px] sm:max-w-none">{handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services list – single column on mobile */}
      <section className="section-padding bg-gray-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6 sm:mb-8 text-center">Our services</h2>
          <ul className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">
            {SERVICES.map(({ title, description }) => (
              <li key={title} className="p-4 sm:p-5 rounded-xl bg-gray-900/80 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white font-heading mb-1 sm:mb-2">{title}</h3>
                <p className="text-sm sm:text-base text-white/80 font-montserrat leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact form or success */}
      {isSubmitted ? (
        <section className="section-padding bg-gray-900">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-2">Message sent</h2>
              <p className="text-white/80 font-montserrat text-sm sm:text-base mb-6">
                We&apos;ve received your message and will get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="min-h-[44px] px-6 py-3 rounded-lg font-semibold font-montserrat bg-white text-gray-900 hover:bg-gray-100 transition-colors border-0"
              >
                Send another message
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-gray-900">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-4 sm:mb-6 text-center">Get in touch</h2>
              <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
                {errors.length > 0 && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
                    <ul className="list-disc list-inside">
                      {errors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="absolute -left-[9999px] top-0 opacity-0 w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="book-website_url">Leave this blank</label>
                    <input
                      type="text"
                      id="book-website_url"
                      name={HONEYPOT_FIELD}
                      value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                      onChange={handleInputChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField('name', e.target.value)}
                        required
                        className={`form-input min-h-[44px] ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField('email', e.target.value)}
                        required
                        className={`form-input min-h-[44px] ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={(e) => { handlePhoneBlur(e); validateField('phone', e.target.value); }}
                      className={`form-input min-h-[44px] ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                    {fieldErrors.phone && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={(e) => validateField('subject', e.target.value)}
                      required
                      className={`form-select min-h-[44px] ${fieldErrors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Request</option>
                      <option value="quote">Get a Quote</option>
                      <option value="portfolio">Portfolio Question</option>
                      <option value="other">Other</option>
                    </select>
                    {fieldErrors.subject && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-montserrat">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={(e) => validateField('message', e.target.value)}
                      required
                      rows={5}
                      className={`form-textarea min-h-[120px] ${fieldErrors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Tell us about your project..."
                    />
                    {fieldErrors.message && <p className="text-red-400 text-xs mt-1 font-montserrat">{fieldErrors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] sm:min-h-[52px] py-3 sm:py-4 px-4 rounded-lg font-semibold font-montserrat bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
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
