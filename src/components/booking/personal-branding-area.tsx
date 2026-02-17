'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookingLogic } from '@/hooks/use-booking-logic';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
    trackBookingStart,
    trackBookingStepChange,
    trackPackageSelection,
    trackAddOnToggle,
} from '@/lib/analytics';
import ErrorMsg from '../error-msg';
import { RightArrowTwo, ArrowBg, UpArrow } from '../svg';

// Simple hand SVG
const HandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-10">
        <path d="M20 10V14M4 10V14M12 2V22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function PersonalBrandingArea() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [sessionPurpose, setSessionPurpose] = useState('');
    const [sessionLocation, setSessionLocation] = useState('');

    const bookingLogic = useBookingLogic({ defaultCategory: 'personal' });
    const {
        packages,
        addons,
        selectedPackageId,
        selectedAddOns,
        setSelectedPackageId,
        preferredPartnerCodeInput,
        appliedPartnerCode,
        partnerCodeError,
        formData: hookFormData,
        setFormData: setHookFormData,
        isSubmitting,
        isSubmitted,
        formErrors,
        setFormErrors,
        fieldErrors,
        setIsSubmitting,
        setIsSubmitted,
        setFieldErrors,
        setAppliedPartnerCode,
        setPreferredPartnerCodeInput,
        getPackagePrice,
        getAddonPrice,
        calculateTotal,
        handlePackageClick,
        handleAddOnToggle,
        handleApplyPartnerCode,
        handleFormChange,
        handleEmailBlur,
        handlePhoneBlur,
        handleFormSubmit,
    } = bookingLogic;

    const formData = {
        name: hookFormData.name,
        email: hookFormData.email,
        phone: hookFormData.phone,
        sessionPurpose,
        sessionLocation,
        selectedPackage: selectedPackageId || '',
        selectedAddOns,
        preferredPartnerCode: preferredPartnerCodeInput,
        preferredDate: hookFormData.preferredDate,
        preferredTime: hookFormData.preferredTime,
        message: hookFormData.message,
        [HONEYPOT_FIELD]: hookFormData[HONEYPOT_FIELD],
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'sessionPurpose') {
            setSessionPurpose(value);
        } else if (name === 'sessionLocation') {
            setSessionLocation(value);
        } else if (name === 'preferredPartnerCode') {
            setPreferredPartnerCodeInput(value);
            setAppliedPartnerCode('');
            setFieldErrors((prev: Record<string, string>) => ({ ...prev, preferredPartnerCode: '' }));
        } else {
            handleFormChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
        }
    };

    useEffect(() => { trackBookingStart(); }, []);

    useEffect(() => {
        const partnerCode = searchParams.get('partnerCode');
        if (partnerCode) {
            setPreferredPartnerCodeInput(partnerCode.trim());
            handleApplyPartnerCode();
        }
    }, [searchParams]);

    const getDisplayPackagePrice = (basePrice: number, packageId: string) =>
        getPackagePrice(basePrice, packageId) ?? basePrice;

    const handlePackageSelect = (packageId: string) => {
        handlePackageClick(packageId);
        const pkg = packages.find(p => p.id === packageId);
        if (pkg && selectedPackageId !== packageId) {
            trackPackageSelection(packageId, pkg.name, pkg.basePrice);
        }
    };

    const handlePackageRemove = () => {
        setSelectedPackageId(null);
    };

    const handleAddOnToggleWithTracking = (addOnId: string) => {
        const isSelected = selectedAddOns.includes(addOnId);
        handleAddOnToggle(addOnId);
        const addOn = addons.find(a => a.id === addOnId);
        if (addOn) {
            trackAddOnToggle(addOnId, addOn.name, !isSelected, addOn.price);
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !formData.selectedPackage) {
            setFormErrors(['Please select a package to continue']);
            return;
        }
        setFormErrors([]);
        setFieldErrors({});
        setCurrentStep(prev => prev + 1);
        trackBookingStepChange(currentStep + 1, 'next');
        window.scrollTo(0, 300);
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        trackBookingStepChange(currentStep - 1, 'previous');
        window.scrollTo(0, 300);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const combinedMessage = [sessionPurpose, sessionLocation, hookFormData.message].filter(Boolean).join('\n\n');
        setHookFormData((prev) => ({ ...prev, message: combinedMessage }));
        await handleFormSubmit(e, { message: combinedMessage });
    };

    if (isSubmitted) {
        return (
            <div className="cn-contactform-area pt-100 pb-100 text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="success-box p-5 bg-dark border border-secondary rounded">
                                <h2 className="text-white mb-4">Booking Submitted Successfully!</h2>
                                <p className="text-white-50 mb-5">
                                    Thank you for your interest. Our team will review your session details and get back to you with a confirmation within 24 hours.
                                </p>
                                <button className="tp-btn-black-2" onClick={() => window.location.href = '/'}>
                                    Back to Home
                                    <span className="p-relative ml-10"><RightArrowTwo /><ArrowBg /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cn-contactform-area pt-100 pb-100" style={{ fontFamily: 'var(--font-inter)' }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="ab-about-category-title-box mb-60 text-center p-relative">
                            <span className="tp-section-subtitle mb-15 justify-content-center d-flex align-items-center">
                                <HandIcon /> Book Your Session
                            </span>
                            <h4 className="ab-about-category-title text-white">
                                {currentStep === 1 && "Choose Your Package"}
                                {currentStep === 2 && "Finalize Your Booking"}
                            </h4>

                            <div className="booking-stepper d-flex justify-content-center mt-30">
                                <div className="booking-stepper-inner d-flex align-items-center">
                                    {[1, 2].map((step, idx) => (
                                        <React.Fragment key={step}>
                                            <div className={`booking-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                                                <div className="step-num">{step}</div>
                                                <span className="step-txt">
                                                    {step === 1 && "Package"}
                                                    {step === 2 && "Contact"}
                                                </span>
                                            </div>
                                            {idx < 1 && (
                                                <div className={`step-connector ${currentStep > step ? 'completed' : ''}`} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="cn-contactform-wrap p-relative">
                            <form onSubmit={onSubmit}>
                                {/* Step 1 - Packages & Add-ons */}
                                {currentStep === 1 && (
                                    <div className="step-content fadeIn">
                                        <div className="step2-layout step2-layout-full">
                                            <div className="step2-left">
                                                <div className="personal-partner-code mb-30">
                                                    <label className="sidebar-label d-block mb-10">Preferred partner code (optional)</label>
                                                    {appliedPartnerCode ? (
                                                        <div className="sidebar-partner-chip">
                                                            <span className="sidebar-partner-chip-text">{appliedPartnerCode}</span>
                                                            <button
                                                                type="button"
                                                                className="sidebar-partner-chip-remove"
                                                                onClick={() => {
                                                                    setPreferredPartnerCodeInput('');
                                                                    setAppliedPartnerCode('');
                                                                }}
                                                                aria-label="Remove partner code"
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="sidebar-partner-row d-flex gap-2 align-items-flex-start">
                                                                <input
                                                                    type="text"
                                                                    name="preferredPartnerCode"
                                                                    className="sidebar-partner-input"
                                                                    placeholder="Enter code"
                                                                    value={formData.preferredPartnerCode}
                                                                    onChange={handleInputChange}
                                                                    autoComplete="off"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="sidebar-partner-apply-btn"
                                                                    onClick={handleApplyPartnerCode}
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                            {partnerCodeError && (
                                                                <div className="sidebar-partner-error mt-2">
                                                                    <ErrorMsg msg={partnerCodeError} />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="personal-pkg-row tp-price-area">
                                                    {packages.map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className={`pkg-card cursor-pointer ${formData.selectedPackage === item.id ? "pkg-card-active" : ""}`}
                                                            onClick={() => handlePackageSelect(item.id)}
                                                        >
                                                            {item.images?.[0] && (
                                                                <div className="pkg-card-image">
                                                                    <img src={item.images[0]} alt={item.name} loading="lazy" />
                                                                </div>
                                                            )}
                                                            <div className="pkg-card-inner">
                                                                <div className="pkg-card-header">
                                                                    <div className="pkg-card-title">
                                                                        <span className="pkg-card-num">0{index + 1}</span>
                                                                        <h5>{item.name}</h5>
                                                                        {item.popular && <span className="pkg-popular-tag">Popular</span>}
                                                                    </div>
                                                                    <div className="pkg-card-price">
                                                                        <span className="pkg-price-amount">
                                                                            {item.id === 'tailored' ? 'Book a Call' : `$${getDisplayPackagePrice(item.basePrice, item.id)}`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="pkg-card-features">
                                                                    <ul>
                                                                        {item.services.map((l, i) => (
                                                                            <li key={i}>
                                                                                <i className="fa-sharp fa-light fa-check"></i>
                                                                                {l}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="pkg-card-action">
                                                                    <button
                                                                        type="button"
                                                                        className={`tp-btn-black-md ${formData.selectedPackage === item.id ? "pkg-btn-selected" : "pkg-btn-default"}`}
                                                                        onClick={(e) => { e.stopPropagation(); handlePackageSelect(item.id); }}
                                                                    >
                                                                        {formData.selectedPackage === item.id ? "Selected" : "Choose Package"}
                                                                        <span><UpArrow /></span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {formErrors.length > 0 && (
                                            <div className="mt-20 text-center">
                                                {formErrors.map((err, i) => <ErrorMsg key={i} msg={err} />)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2 - Contact & Summary */}
                                {currentStep === 2 && (
                                    <div className="step-content fadeIn">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-10">
                                                <div className="visually-hidden" aria-hidden="true">
                                                    <label htmlFor="personal-booking-website_url">Leave this blank</label>
                                                    <input
                                                        id="personal-booking-website_url"
                                                        name={HONEYPOT_FIELD}
                                                        type="text"
                                                        tabIndex={-1}
                                                        autoComplete="off"
                                                        value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Full Name *</label>
                                                            <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                                                            {fieldErrors.name && <ErrorMsg msg={fieldErrors.name} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Email Address *</label>
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                placeholder="john@example.com"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                onBlur={handleEmailBlur}
                                                                required
                                                            />
                                                            {fieldErrors.email && <ErrorMsg msg={fieldErrors.email} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Phone Number</label>
                                                            <input
                                                                name="phone"
                                                                type="tel"
                                                                placeholder="(123) 456-7890"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                onBlur={handlePhoneBlur}
                                                            />
                                                            {fieldErrors.phone && <ErrorMsg msg={fieldErrors.phone} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Preferred Date</label>
                                                            <input name="preferredDate" type="date" value={formData.preferredDate} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Preferred Start Time</label>
                                                            <input name="preferredTime" type="time" value={formData.preferredTime} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Notes or Special Requirements</label>
                                                            <textarea
                                                                name="message"
                                                                placeholder="Tell us about your vision, wardrobe ideas, specific shots you need..."
                                                                value={formData.message}
                                                                onChange={handleInputChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-summary mt-50 p-5 border border-secondary rounded bg-black">
                                                    <h3 className="text-white mb-30 text-center">Booking Summary</h3>
                                                    <div className="summary-details">
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="text-white-50">Package:</span>
                                                            <span className="text-white font-weight-bold">{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="text-white-50">Package Price:</span>
                                                            <span className="text-white">${packages.find(p => p.id === formData.selectedPackage) ? getDisplayPackagePrice(packages.find(p => p.id === formData.selectedPackage)!.basePrice, formData.selectedPackage) : 0}</span>
                                                        </div>

                                                        {formData.selectedAddOns.length > 0 && (
                                                            <div className="addon-summary mb-15">
                                                                <span className="text-white-50 d-block mb-10">Add-ons:</span>
                                                                {formData.selectedAddOns.map(id => {
                                                                    const addon = addons.find(a => a.id === id);
                                                                    return (
                                                                        <div key={id} className="d-flex justify-content-between mb-5 pl-20">
                                                                            <span className="text-white-50 small">- {addon?.name}</span>
                                                                            <span className="text-white-50 small">${addon ? getAddonPrice(id) : 0}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        <div className="border-top border-secondary my-20"></div>

                                                        <div className="d-flex justify-content-between mb-10">
                                                            <span className="text-white-50">Subtotal:</span>
                                                            <span className="text-white">${calculateTotal().toFixed(2)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="text-white-50">HST (13%):</span>
                                                            <span className="text-white">${(calculateTotal() * 0.13).toFixed(2)}</span>
                                                        </div>

                                                        <div className="border-top border-secondary my-20"></div>

                                                        <div className="d-flex justify-content-between">
                                                            <h4 className="text-white mb-0">Total</h4>
                                                            <h4 className="text-white mb-0">${(calculateTotal() * 1.13).toFixed(2)}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {formErrors.length > 0 && (
                                            <div className="mt-20 text-center">
                                                {formErrors.map((err, i) => <ErrorMsg key={i} msg={err} />)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {formErrors.length > 0 && (
                                    <div className="booking-submission-errors mt-30 mb-20 text-center" role="alert" aria-live="polite">
                                        <p className="text-white fw-bold mb-2">Submission failed</p>
                                        {formErrors.map((err, i) => (
                                            <ErrorMsg key={i} msg={err} />
                                        ))}
                                    </div>
                                )}

                                <div className="form-navigation mt-60 d-flex justify-content-center gap-4">
                                    {currentStep > 1 && (
                                        <button type="button" className="tp-btn-black-2 booking-btn-outline" onClick={handlePrevious} disabled={isSubmitting}>
                                            Previous Step
                                        </button>
                                    )}

                                    {currentStep < 2 ? (
                                        <button type="button" className="tp-btn-black-2 booking-btn-primary" onClick={handleNext}>
                                            Continue
                                            <span className="p-relative"><RightArrowTwo /><ArrowBg /></span>
                                        </button>
                                    ) : (
                                        <button type="submit" className="tp-btn-black-2 booking-btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : 'Complete Booking'}
                                            <span className="p-relative"><RightArrowTwo /><ArrowBg /></span>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .fadeIn { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .booking-stepper { margin-bottom: 40px; width: 100%; }
                .booking-stepper-inner { width: 50%; margin: 0 auto; justify-content: space-between; }
                .booking-step { display: flex; flex-direction: column; align-items: center; opacity: 0.3; transition: all 0.3s; position: relative; z-index: 1; flex-shrink: 0; }
                .booking-step.active { opacity: 1; }
                .booking-step.completed { opacity: 0.7; }
                .step-num { width: 44px; height: 44px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 16px; margin-bottom: 10px; transition: all 0.3s; }
                .booking-step.active .step-num { border-color: #fff; background: #fff; color: #000; }
                .booking-step.completed .step-num { background: #fff; color: #000; border-color: #fff; }
                .step-txt { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 500; }
                .step-connector { flex: 1; height: 1px; background: rgba(255,255,255,0.2); margin: 0 20px; margin-bottom: 30px; transition: background 0.3s; }
                .step-connector.completed { background: rgba(255,255,255,0.6); }
                @media (max-width: 768px) { .booking-stepper-inner { width: 90%; } .step-connector { margin: 0 10px; margin-bottom: 30px; } }
                
                /* Step 2 - Full width (no sidebar) */
                .step2-layout { display: flex; gap: 40px; }
                .step2-layout-full .step2-left { flex: 1 1 100%; max-width: 100%; }
                .step2-left { flex: 0 0 68%; max-width: 68%; }
                .step2-right { flex: 0 0 28%; max-width: 28%; }
                @media (max-width: 991px) {
                    .step2-layout { flex-direction: column; }
                    .step2-left { flex: 0 0 100%; max-width: 100%; }
                    .step2-right { flex: 0 0 100%; max-width: 100%; }
                }

                /* Personal: 3 packages in one row */
                .personal-pkg-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                @media (max-width: 991px) {
                    .personal-pkg-row { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 576px) {
                    .personal-pkg-row { grid-template-columns: 1fr; }
                }

                /* Sidebar */
                .sidebar-sticky { position: sticky; top: 120px; }
                .sidebar-address { border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 20px; }
                .sidebar-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 14px; font-weight: 600; }
                .sidebar-address-text { color: #fff; font-size: 16px; font-weight: 500; margin-bottom: 4px; line-height: 1.5; }
                .sidebar-address-unit { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 4px; }
                .sidebar-sqft { color: rgba(255,255,255,0.4); font-size: 13px; }
                .sidebar-pricing { border: 1px solid rgba(255,255,255,0.12); padding: 24px; }
                .sidebar-line-item { display: flex; justify-content: space-between; align-items: baseline; color: #fff; font-size: 15px; margin-bottom: 10px; }
                .sidebar-addon-line { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 6px; }
                .sidebar-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 16px 0; }
                .sidebar-total { display: flex; justify-content: space-between; align-items: baseline; color: #fff; font-size: 20px; font-weight: 600; }
                .sidebar-empty { color: rgba(255,255,255,0.3); font-size: 14px; font-style: italic; margin: 0; }
                .sidebar-edit-btn { background: transparent; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
                .sidebar-edit-btn:hover { color: rgba(255,255,255,0.9); }
                .sidebar-package-item { position: relative; }
                .sidebar-remove-btn { background: transparent; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; opacity: 0.6; }
                .sidebar-remove-btn:hover { color: rgba(255,255,255,0.9); opacity: 1; }
                .gap-2 { gap: 8px; }

                /* Preferred partner code (sidebar) */
                .sidebar-partner-row { flex-wrap: wrap; }
                .sidebar-partner-code .sidebar-partner-input { flex: 1; min-width: 0; padding: 10px 14px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; border-radius: 6px; font-size: 14px; }
                .sidebar-partner-code .sidebar-partner-input::placeholder { color: rgba(255,255,255,0.4); }
                .sidebar-partner-apply-btn { padding: 10px 18px; border: 1px solid rgba(255,255,255,0.3); background: transparent; color: #fff; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s, border-color 0.2s; }
                .sidebar-partner-apply-btn:hover { background: rgba(255,255,255,0.25); }
                .sidebar-partner-error { margin-top: 8px; }
                .sidebar-partner-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; }
                .sidebar-partner-chip-text { color: #fff; font-size: 14px; font-weight: 500; }
                .sidebar-partner-chip-remove { padding: 4px; border: none; background: transparent; color: rgba(255,255,255,0.6); cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s, color 0.2s; }
                .sidebar-partner-chip-remove:hover { background: rgba(255,255,255,0.35); color: #fff; }

                /* Package cards - flex so button aligns at bottom */
                .personal-pkg-row .pkg-card { margin-bottom: 0; display: flex; flex-direction: column; }
                .pkg-card { border: 1px solid rgba(255,255,255,0.1); background: #111; margin-bottom: 16px; cursor: pointer; transition: all 0.3s; }
                .pkg-card:hover { border-color: rgba(255,255,255,0.3); }
                .pkg-card-active { border-color: #fff; background: #1a1a1a; }
                .pkg-card-image { width: 100%; aspect-ratio: 16 / 7; overflow: hidden; background: #0a0a0a; }
                .pkg-card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .pkg-card-inner { padding: 28px 30px; display: flex; flex-direction: column; flex: 1; min-height: 0; }
                .pkg-card-action { margin-top: auto; padding-top: 18px; display: flex; justify-content: center; }
                .pkg-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .pkg-card-title { display: flex; align-items: center; gap: 14px; }
                .pkg-card-title h5 { color: #fff; margin: 0; font-size: 20px; font-weight: 600; }
                .pkg-card-num { color: rgba(255,255,255,0.3); font-size: 14px; font-weight: 500; }
                .pkg-popular-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #000; background: #fff; padding: 3px 10px; font-weight: 600; }
                .pkg-card-price { flex-shrink: 0; }
                .pkg-price-amount { color: #fff; font-size: 28px; font-weight: 700; }
                .pkg-card-features { margin-bottom: 0; flex: 1; min-height: 0; }
                .pkg-card-features ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 6px 24px; }
                .pkg-card-features li { color: rgba(255,255,255,0.65); font-size: 14px; display: flex; align-items: center; gap: 8px; }
                .pkg-card-features li i { color: rgba(255,255,255,0.35); font-size: 12px; }
                .pkg-card-active .pkg-card-features li { color: rgba(255,255,255,0.85); }
                .pkg-card-active .pkg-card-features li i { color: #fff; }

                /* Legacy carousel (unused after removing carousel) */
                .pkg-carousel-track { display: flex; height: 100%; transition: transform 0.4s ease; }
                .pkg-carousel-slide { position: relative; flex: 0 0 100%; height: 100%; }
                .pkg-carousel-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .pkg-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; backdrop-filter: blur(4px); }
                .pkg-carousel-btn:hover { background: rgba(0,0,0,0.8); }
                .pkg-carousel-prev { left: 12px; }
                .pkg-carousel-next { right: 12px; }
                .pkg-carousel-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
                .pkg-carousel-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: background 0.2s; }
                .pkg-carousel-dot.active { background: #fff; }

                /* Add-on thumbnails */
                .addons-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
                @media (max-width: 991px) { .addons-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 768px) { .addons-grid { grid-template-columns: repeat(2, 1fr); } }
                .addon-thumb { cursor: pointer; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; transition: all 0.25s; }
                .addon-thumb:hover { border-color: rgba(255,255,255,0.4); }
                .addon-thumb-active { border-color: #fff; }
                .addon-thumb-img { position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: #0a0a0a; }
                .addon-thumb-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
                .addon-thumb:hover .addon-thumb-img img { transform: scale(1.05); }
                .addon-thumb-check { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
                .addon-thumb-info { padding: 10px 12px; }
                .addon-thumb-name { display: block; color: #fff; font-size: 13px; font-weight: 500; line-height: 1.35; margin-bottom: 2px; }
                .addon-thumb-active .addon-thumb-name { color: #fff; }
                .addon-thumb-price { font-size: 12px; color: rgba(255,255,255,0.45); }
                
                .gap-4 { gap: 20px; }

                .booking-btn-primary { background-color: #fff; color: #000; border: 2px solid #fff; }
                .booking-btn-primary:hover { background-color: transparent; color: #fff; border-color: #fff; }
                .booking-btn-primary:hover span .svg-icon { color: #fff; }
                .booking-btn-primary span .svg-icon { color: #fff; }
                .booking-btn-outline { background-color: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); }
                .booking-btn-outline:hover { background-color: #fff; color: #000; border-color: #fff; }

                .pkg-btn-selected { background-color: #fff; color: #000; border-color: #fff; }
                .pkg-btn-selected:hover { background-color: rgba(255,255,255,0.85); color: #000; }
                .pkg-btn-default { background-color: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); }
                .pkg-btn-default:hover { background-color: #fff; color: #000; border-color: #fff; }

            `}</style>
        </div>
    );
}
