'use client';

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../error-msg';
import { handleContactSubmission } from '../contact/contact-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
    trackFormFieldFocus,
    trackFormFieldBlur,
    trackFormFieldChange,
} from '@/lib/analytics';

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    [HONEYPOT_FIELD]?: string;
};

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    phone: yup.string().optional(),
    subject: yup.string().required("Please select a subject"),
    message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
    [HONEYPOT_FIELD]: yup.string().optional(),
}) as yup.ObjectSchema<FormData>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const recaptchaToken = await getRecaptchaToken('contact');

        const success = await handleContactSubmission(
            {
                ...data,
                recaptchaToken,
            },
            setIsSubmitting,
            setIsSubmitted,
            setServerErrors
        );

        if (success) {
            reset();
        }
    };

    if (isSubmitted) {
        return (
            <div className="success-message text-center p-5 bg-dark border border-secondary rounded">
                <h3 className="text-white mb-20">Message Sent!</h3>
                <p className="text-white-50 mb-30">
                    Thank you for contacting us. We have received your message and will get back to you within 24 hours.
                </p>
                <button
                    className="tp-btn-black-md"
                    onClick={() => setIsSubmitted(false)}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {serverErrors.length > 0 && (
                <div className="alert alert-danger mb-25">
                    {serverErrors.map((err, i) => <p key={i} className="mb-0">{err}</p>)}
                </div>
            )}

            {/* Honeypot */}
            <div className="visually-hidden" aria-hidden="true">
                <input
                    type="text"
                    {...register(HONEYPOT_FIELD as any)}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="cn-contactform-input mb-25">
                        <label className="text-white">Name *</label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="John Doe"
                            onFocus={() => trackFormFieldFocus('contact', 'name')}
                            onBlur={() => trackFormFieldBlur('contact', 'name')}
                            onChange={(e) => trackFormFieldChange('contact', 'name', e.target.value)}
                        />
                        <ErrorMsg msg={errors.name?.message!} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="cn-contactform-input mb-25">
                        <label className="text-white">Email *</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="your@email.com"
                            onFocus={() => trackFormFieldFocus('contact', 'email')}
                            onBlur={() => trackFormFieldBlur('contact', 'email')}
                            onChange={(e) => trackFormFieldChange('contact', 'email', e.target.value)}
                        />
                        <ErrorMsg msg={errors.email?.message!} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="cn-contactform-input mb-25">
                        <label className="text-white">Phone</label>
                        <input
                            {...register("phone")}
                            type="tel"
                            placeholder="(555) 123-4567"
                            onFocus={() => trackFormFieldFocus('contact', 'phone')}
                            onBlur={() => trackFormFieldBlur('contact', 'phone')}
                            onChange={(e) => trackFormFieldChange('contact', 'phone', e.target.value)}
                        />
                        <ErrorMsg msg={errors.phone?.message!} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="cn-contactform-input mb-25">
                        <label className="text-white">Subject *</label>
                        <select
                            {...register("subject")}
                            className="contact-select"
                            onFocus={() => trackFormFieldFocus('contact', 'subject')}
                            onBlur={() => trackFormFieldBlur('contact', 'subject')}
                            onChange={(e) => trackFormFieldChange('contact', 'subject', e.target.value)}
                        >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="booking">Booking Request</option>
                            <option value="quote">Get a Quote</option>
                            <option value="portfolio">Portfolio Question</option>
                            <option value="other">Other</option>
                        </select>
                        <ErrorMsg msg={errors.subject?.message!} />
                    </div>
                </div>
                <div className="col-12">
                    <div className="cn-contactform-input mb-25">
                        <label className="text-white">Message *</label>
                        <textarea
                            {...register("message")}
                            placeholder="Tell us about your project..."
                            onFocus={() => trackFormFieldFocus('contact', 'message')}
                            onBlur={() => trackFormFieldBlur('contact', 'message')}
                            onChange={(e) => trackFormFieldChange('contact', 'message', e.target.value)}
                        ></textarea>
                        <ErrorMsg msg={errors.message?.message!} />
                    </div>
                </div>
            </div>

            <div className="cn-contactform-btn">
                <button
                    className="tp-btn-black-md w-100"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </div>

            <style jsx>{`
        .contact-select {
          width: 100%;
          height: 60px;
          line-height: 60px;
          padding: 0 30px;
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
          border-radius: 0;
        }
        .contact-select option {
          background-color: #000;
          color: #fff;
        }
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
      `}</style>
        </form>
    );
}
