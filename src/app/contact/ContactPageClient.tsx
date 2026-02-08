'use client';

import React, { useState } from 'react';
import HeaderFour from '@/layouts/headers/header-four';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother, ScrollTrigger, SplitText } from '@/plugins';
import { charAnimation } from '@/utils/title-animation';
import { handleContactSubmission } from '@/components/contact/contact-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
    trackFormFieldFocus,
    trackFormFieldBlur,
    trackFormFieldChange,
    trackFormSubmission,
    trackFormValidationError,
    trackFormProgress
} from '@/lib/analytics';
import ErrorMsg from '@/components/error-msg';
import Image from 'next/image';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Contact location data
const location_data = [
    {
        id: 1,
        title: "Phone",
        icon: (
            <svg className="w-30 h-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        info: "(416) 419-9689",
        link: "tel:+14164199689",
        description: "Mon-Sat 9AM-6PM EST"
    },
    {
        id: 2,
        title: "Email",
        icon: (
            <svg className="w-30 h-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        info: "contact@brightone.ca",
        link: "mailto:contact@brightone.ca",
        description: "We respond within 24 hours"
    },
    {
        id: 3,
        title: "Service Areas",
        icon: (
            <svg className="w-30 h-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        info: "Greater Toronto Area",
        description: "Durham, Peel, York, Kawartha Lakes"
    }
];

export default function ContactPageClient() {
    useScrollSmooth();

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
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useGSAP(() => {
        const timer = setTimeout(() => {
            charAnimation();
        }, 100);
        return () => clearTimeout(timer);
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Track form field changes
        trackFormFieldChange('contact', name, value);

        // Track form progress
        const completedFields = Object.values({ ...formData, [name]: value }).filter(val => val && val.toString().trim() !== '').length;
        const totalFields = Object.keys(formData).length;
        trackFormProgress('contact', completedFields, totalFields);

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
            message: '',
            [HONEYPOT_FIELD]: ''
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
                    trackFormValidationError('contact', 'name', 'required');
                } else if (value.trim().length < 2) {
                    newFieldErrors.name = 'Name must be at least 2 characters';
                    trackFormValidationError('contact', 'name', 'min_length');
                } else {
                    delete newFieldErrors.name;
                }
                break;
            case 'email':
                if (!value.trim()) {
                    newFieldErrors.email = 'Email is required';
                    trackFormValidationError('contact', 'email', 'required');
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newFieldErrors.email = 'Please enter a valid email address';
                    trackFormValidationError('contact', 'email', 'invalid_format');
                } else {
                    delete newFieldErrors.email;
                }
                break;
            case 'phone':
                if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
                    newFieldErrors.phone = 'Please enter a valid phone number';
                    trackFormValidationError('contact', 'phone', 'invalid_format');
                } else {
                    delete newFieldErrors.phone;
                }
                break;
            case 'subject':
                if (!value) {
                    newFieldErrors.subject = 'Please select a subject';
                    trackFormValidationError('contact', 'subject', 'required');
                } else {
                    delete newFieldErrors.subject;
                }
                break;
            case 'message':
                if (!value.trim()) {
                    newFieldErrors.message = 'Message is required';
                    trackFormValidationError('contact', 'message', 'required');
                } else if (value.trim().length < 10) {
                    newFieldErrors.message = 'Message must be at least 10 characters';
                    trackFormValidationError('contact', 'message', 'min_length');
                } else {
                    delete newFieldErrors.message;
                }
                break;
        }

        setFieldErrors(newFieldErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        trackFormSubmission('contact', true);

        const recaptchaToken = await getRecaptchaToken('contact');
        const payload = {
            ...formData,
            recaptchaToken,
            [HONEYPOT_FIELD]: formData[HONEYPOT_FIELD as keyof typeof formData] ?? '',
        };

        const success = await handleContactSubmission(
            payload,
            setIsSubmitting,
            setIsSubmitted,
            setErrors
        );

        if (success) {
            trackFormSubmission('contact', true);
            clearForm();
        } else {
            trackFormSubmission('contact', false);
        }
    };

    return (
        <Wrapper>
            <HeaderFour />

            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div className="inner-bg" style={{ backgroundImage: "url(/assets/img/home-01/team/team-details-bg.png)" }}>
                        <main>
                            {/* Hero Section */}
                            <div className="tm-hero-area tm-hero-ptb p-relative">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="tm-hero-content">
                                                <span className="tm-hero-subtitle">BrightOne Creative</span>
                                                <h4 className="tm-hero-title-big tp-char-animation" style={{ fontSize: '150px' }}>
                                                    Get <br /> in touch
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form Area */}
                            <div className="cn-contactform-area cn-contactform-style p-relative pb-100">
                                <div className="container container-1840">
                                    <div className="cn-contactform-2-bg black-bg">
                                        <div className="row">
                                            {/* Map Section - BrightOne Creative location */}
                                            <div className="col-xl-6">
                                                <div className="cn-contactform-2-map">
                                                    <iframe
                                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5740.2!2d-79.1534268!3d44.135785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x443f92dffb53b1a1%3A0xaf8fefcc617f4fbe!2sBrightOne+Creative!5e0!3m2!1sen!2sca"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="BrightOne Creative location"
                                                    ></iframe>
                                                </div>
                                            </div>

                                            {/* Form Section */}
                                            <div className="col-xl-6">
                                                <div className="cn-contactform-wrap">
                                                    {isSubmitted ? (
                                                        <div className="success-message text-center">
                                                            <div className="success-icon mb-30">
                                                                <svg className="w-60 h-60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <h2 className="cn-contactform-2-title mb-20">Message Sent!</h2>
                                                            <p className="text-white-50 mb-30">
                                                                Thank you for contacting us! We&apos;ve received your message and will get back to you within 24 hours.
                                                            </p>
                                                            <button
                                                                onClick={() => setIsSubmitted(false)}
                                                                className="tp-btn-black-md white-bg"
                                                            >
                                                                Send Another Message
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="cn-contactform-2-title">Send a Message</h4>

                                                            {/* Error Display */}
                                                            {errors.length > 0 && (
                                                                <div className="alert alert-danger mb-25">
                                                                    {errors.map((err, i) => <p key={i} className="mb-0">{err}</p>)}
                                                                </div>
                                                            )}

                                                            <form onSubmit={handleSubmit}>
                                                                {/* Honeypot – hidden from users */}
                                                                <div className="visually-hidden" aria-hidden="true">
                                                                    <input
                                                                        type="text"
                                                                        name={HONEYPOT_FIELD}
                                                                        value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                                                                        onChange={handleInputChange}
                                                                        tabIndex={-1}
                                                                        autoComplete="off"
                                                                    />
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="cn-contactform-input mb-25">
                                                                            <label>Name *</label>
                                                                            <input
                                                                                type="text"
                                                                                name="name"
                                                                                value={formData.name}
                                                                                onChange={handleInputChange}
                                                                                onFocus={() => trackFormFieldFocus('contact', 'name')}
                                                                                onBlur={(e) => {
                                                                                    validateField('name', e.target.value);
                                                                                    trackFormFieldBlur('contact', 'name');
                                                                                }}
                                                                                placeholder="Your name"
                                                                                required
                                                                            />
                                                                            <ErrorMsg msg={fieldErrors.name!} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="cn-contactform-input mb-25">
                                                                            <label>Email *</label>
                                                                            <input
                                                                                type="email"
                                                                                name="email"
                                                                                value={formData.email}
                                                                                onChange={handleInputChange}
                                                                                onFocus={() => trackFormFieldFocus('contact', 'email')}
                                                                                onBlur={(e) => {
                                                                                    validateField('email', e.target.value);
                                                                                    trackFormFieldBlur('contact', 'email');
                                                                                }}
                                                                                placeholder="your@email.com"
                                                                                required
                                                                            />
                                                                            <ErrorMsg msg={fieldErrors.email!} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="cn-contactform-input mb-25">
                                                                            <label>Phone</label>
                                                                            <input
                                                                                type="tel"
                                                                                name="phone"
                                                                                value={formData.phone}
                                                                                onChange={handleInputChange}
                                                                                onFocus={() => trackFormFieldFocus('contact', 'phone')}
                                                                                onBlur={(e) => {
                                                                                    handlePhoneBlur(e);
                                                                                    validateField('phone', e.target.value);
                                                                                    trackFormFieldBlur('contact', 'phone');
                                                                                }}
                                                                                placeholder="(555) 123-4567"
                                                                            />
                                                                            <ErrorMsg msg={fieldErrors.phone!} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="cn-contactform-input mb-25">
                                                                            <label>Subject *</label>
                                                                            <select
                                                                                name="subject"
                                                                                value={formData.subject}
                                                                                onChange={handleInputChange}
                                                                                onFocus={() => trackFormFieldFocus('contact', 'subject')}
                                                                                onBlur={(e) => {
                                                                                    validateField('subject', e.target.value);
                                                                                    trackFormFieldBlur('contact', 'subject');
                                                                                }}
                                                                                required
                                                                            >
                                                                                <option value="">Select a subject</option>
                                                                                <option value="general">General Inquiry</option>
                                                                                <option value="booking">Booking Request</option>
                                                                                <option value="quote">Get a Quote</option>
                                                                                <option value="portfolio">Portfolio Question</option>
                                                                                <option value="other">Other</option>
                                                                            </select>
                                                                            <ErrorMsg msg={fieldErrors.subject!} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="cn-contactform-input mb-25">
                                                                    <label>Message *</label>
                                                                    <textarea
                                                                        name="message"
                                                                        value={formData.message}
                                                                        onChange={handleInputChange}
                                                                        onFocus={() => trackFormFieldFocus('contact', 'message')}
                                                                        onBlur={(e) => {
                                                                            validateField('message', e.target.value);
                                                                            trackFormFieldBlur('contact', 'message');
                                                                        }}
                                                                        placeholder="Tell us about your project..."
                                                                        required
                                                                    />
                                                                    <ErrorMsg msg={fieldErrors.message!} />
                                                                </div>

                                                                <div className="cn-contactform-btn">
                                                                    <button
                                                                        className="tp-btn-black-md white-bg w-100"
                                                                        type="submit"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Support Message Area */}
                            <div className="cn-contactform-support-area mb-120">
                                <div className="container">
                                    <div className="row justify-content-center">
                                        <div className="col-xl-10">
                                            <div className="cn-contactform-support-bg d-flex align-items-center justify-content-center" style={{ backgroundImage: "url(/assets/img/inner-contact/contact/contact-bg.png)" }}>
                                                <div className="cn-contactform-support-text text-center">
                                                    <span>
                                                        Or, you can contact us directly below. We aim to respond within 24 hours.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Area */}
                            <div className="cn-contact-2-info-area pb-90">
                                <div className="container container-1530">
                                    <div className="row">
                                        {location_data.map((item, index) => (
                                            <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                                                <div className={`cn-contact-2-content ${index === 1 ? "mt-60" : ""} text-center`}>
                                                    <h4 className="cn-contact-2-title">{item.title}</h4>
                                                    <div className="cn-contact-2-icon mb-20">
                                                        {item.icon}
                                                    </div>
                                                    <div className="cn-contact-2-info-details">
                                                        {item.link ? (
                                                            <Link className="pb-15" href={item.link}>
                                                                {item.info}
                                                            </Link>
                                                        ) : (
                                                            <span className="pb-15">{item.info}</span>
                                                        )}
                                                        {item.description && <span>{item.description}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </main>

                        <FooterFour />
                    </div>
                </div>
            </div>

            <style jsx>{`
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
        .success-icon svg {
          width: 60px;
          height: 60px;
          color: #fff;
        }
        .cn-contact-2-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .cn-contact-2-icon svg {
          width: 30px;
          height: 30px;
          color: #fff;
        }
        /* Select dropdown styling */
        .cn-contactform-input select {
          width: 100%;
          height: 60px;
          line-height: 60px;
          padding: 0 30px;
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
          border-radius: 0;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 20px;
          cursor: pointer;
        }
        .cn-contactform-input select:focus {
          border-color: rgba(255, 255, 255, 0.3);
        }
        .cn-contactform-input select option {
          background-color: #000;
          color: #fff;
          padding: 10px;
        }
      `}</style>
        </Wrapper>
    );
}
