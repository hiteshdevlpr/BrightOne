'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookingLogic } from '@/hooks/use-booking-logic';
import { handleBookingSubmission, type BookingFormData } from './booking-form-handler';
import { HONEYPOT_FIELD } from '@/lib/validation';
import {
    trackBookingStart,
    trackBookingStepChange,
    trackPackageSelection,
    trackAddOnToggle,
    trackAddressAutosuggestSelection,
} from '@/lib/analytics';
import ErrorMsg from '../error-msg';
import { RightArrowTwo, ArrowBg, UpArrow } from '../svg';

declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    Autocomplete: new (
                        input: HTMLInputElement,
                        opts?: { types?: string[]; componentRestrictions?: { country: string | string[] }; fields?: string[] }
                    ) => {
                        addListener: (event: string, fn: () => void) => { remove: () => void };
                        getPlace: () => { formatted_address?: string };
                    };
                };
                event: { removeListener: (listener: { remove: () => void }) => void };
            };
        };
    }
}

// Simple hand SVG
const HandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-10">
        <path d="M20 10V14M4 10V14M12 2V22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Package image carousel
function PkgCarousel({ images, packageId }: { images: string[]; packageId: string }) {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const goPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent(prev => (prev === 0 ? total - 1 : prev - 1));
    };

    const goNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent(prev => (prev === total - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="pkg-carousel">
            <div className="pkg-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {images.map((src, i) => (
                    <div key={`${packageId}-img-${i}`} className="pkg-carousel-slide">
                        <img
                            src={src}
                            alt={`${packageId} example ${i + 1}`}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            {total > 1 && (
                <>
                    <button type="button" className="pkg-carousel-btn pkg-carousel-prev" onClick={goPrev} aria-label="Previous image">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button type="button" className="pkg-carousel-btn pkg-carousel-next" onClick={goNext} aria-label="Next image">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <div className="pkg-carousel-dots">
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={`pkg-carousel-dot ${i === current ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function BookingArea() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [addressGiven, setAddressGiven] = useState(false);
    
    // Use centralized booking logic hook (for listing category only)
    const bookingLogic = useBookingLogic({ defaultCategory: 'listing' });
    
    // Destructure hook state and functions
    const {
        propertyAddressInput,
        appliedPropertyAddress,
        propertySuiteInput,
        appliedPropertySuite,
        propertySizeInput,
        appliedPropertySize,
        selectedPackageId,
        selectedAddOns,
        preferredPartnerCodeInput,
        appliedPartnerCode,
        partnerCodeError,
        formData: hookFormData,
        isSubmitting,
        isSubmitted,
        formErrors,
        fieldErrors,
        enterManuallyListing,
        placesReadyListing,
        packages,
        addons,
        availableAddOns,
        propertyAddressInputRef,
        autocompleteListenerRef,
        setPropertyAddressInput,
        setAppliedPropertyAddress,
        setPropertySuiteInput,
        setAppliedPropertySuite,
        setPropertySizeInput,
        setAppliedPropertySize,
        setSelectedPackageId,
        setSelectedAddOns,
        setPreferredPartnerCodeInput,
        setAppliedPartnerCode,
        setPartnerCodeError,
        setFormData: setHookFormData,
        setIsSubmitting,
        setIsSubmitted,
        setFormErrors,
        setFieldErrors,
        setEnterManuallyListing,
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
        formatPrice,
    } = bookingLogic;
    
    // Map hook state to BookingArea's formData structure for compatibility
    const formData = {
        name: hookFormData.name,
        email: hookFormData.email,
        phone: hookFormData.phone,
        propertyAddress: appliedPropertyAddress || propertyAddressInput,
        unitNumber: appliedPropertySuite || propertySuiteInput,
        propertySize: appliedPropertySize || propertySizeInput,
        selectedPackage: selectedPackageId || '',
        selectedAddOns: selectedAddOns,
        preferredPartnerCode: preferredPartnerCodeInput,
        preferredDate: hookFormData.preferredDate,
        preferredTime: hookFormData.preferredTime,
        message: hookFormData.message,
        [HONEYPOT_FIELD]: hookFormData[HONEYPOT_FIELD],
    };
    
    // Sync formData changes back to hook
    const setFormData = (updater: typeof formData | ((prev: typeof formData) => typeof formData)) => {
        const newData = typeof updater === 'function' ? updater(formData) : updater;
        setHookFormData({
            name: newData.name,
            email: newData.email,
            phone: newData.phone,
            preferredDate: newData.preferredDate,
            preferredTime: newData.preferredTime,
            message: newData.message,
            [HONEYPOT_FIELD]: newData[HONEYPOT_FIELD],
        });
        if (newData.propertyAddress !== formData.propertyAddress) {
            setPropertyAddressInput(newData.propertyAddress);
        }
        if (newData.unitNumber !== formData.unitNumber) {
            setPropertySuiteInput(newData.unitNumber);
        }
        if (newData.propertySize !== formData.propertySize) {
            setPropertySizeInput(newData.propertySize);
        }
        if (newData.selectedPackage !== formData.selectedPackage) {
            setSelectedPackageId(newData.selectedPackage || null);
        }
        if (JSON.stringify(newData.selectedAddOns) !== JSON.stringify(formData.selectedAddOns)) {
            setSelectedAddOns(newData.selectedAddOns);
        }
        if (newData.preferredPartnerCode !== formData.preferredPartnerCode) {
            setPreferredPartnerCodeInput(newData.preferredPartnerCode);
        }
    };
    
    const addressInputRef = propertyAddressInputRef;
    const placesReady = placesReadyListing;
    const enterManually = enterManuallyListing;
    const setPlacesReady = () => {}; // Managed by hook
    const setEnterManually = setEnterManuallyListing;

    useEffect(() => {
        trackBookingStart();
    }, []);

    useEffect(() => {
        const partnerCode = searchParams.get('partnerCode');
        if (partnerCode) {
            setPreferredPartnerCodeInput(partnerCode.trim());
            handleApplyPartnerCode();
        }
    }, [searchParams]);

    useEffect(() => {
        if (currentStep !== 1 || !placesReady || enterManually || !addressInputRef.current || !window.google?.maps?.places) return;
        const input = addressInputRef.current;
        const Autocomplete = window.google.maps.places.Autocomplete;
        const autocomplete = new Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'ca' },
            fields: ['formatted_address'],
        });
        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setPropertyAddressInput(place.formatted_address);
                setAppliedPropertyAddress(place.formatted_address);
                setAddressGiven(true);
                trackAddressAutosuggestSelection(place.formatted_address);
            }
        });
        autocompleteListenerRef.current = listener;
        return () => {
            if (autocompleteListenerRef.current) {
                autocompleteListenerRef.current.remove();
                autocompleteListenerRef.current = null;
            }
        };
    }, [currentStep, placesReady, enterManually, addressInputRef, setPropertyAddressInput, setAppliedPropertyAddress]);

    // Package price after size + optional preferred partner discount
    const getDisplayPackagePrice = (basePrice: number, packageId: string) => {
        return getPackagePrice(basePrice, packageId) ?? basePrice;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'propertyAddress') {
            setPropertyAddressInput(value);
        } else if (name === 'unitNumber') {
            setPropertySuiteInput(value);
        } else if (name === 'propertySize') {
            setPropertySizeInput(value);
        } else if (name === 'preferredPartnerCode') {
            setPreferredPartnerCodeInput(value);
            setAppliedPartnerCode('');
            setPartnerCodeError('');
            setFieldErrors((prev: any) => ({ ...prev, preferredPartnerCode: '' }));
        } else {
            handleFormChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
        }
    };

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
        if (currentStep === 1) {
            if (!addressGiven) {
                setFieldErrors({ propertyAddress: "Please select an address from the list or click 'Enter address manually'." });
                return;
            }
            if (!formData.propertyAddress) {
                setFieldErrors({ propertyAddress: 'Address is required' });
                return;
            }
            if (!formData.propertySize) {
                setFieldErrors({ propertySize: 'Property size is required' });
                return;
            }
            setFieldErrors({});
        }
        // Allow proceeding to step 3 (Add Ons) even without a package
        // if (currentStep === 2 && !formData.selectedPackage) {
        //     setFormErrors(['Please select a package to continue']);
        //     return;
        // }
        setFormErrors([]);
        setFieldErrors({});
        setCurrentStep(prev => Math.min(4, prev + 1));
        trackBookingStepChange(currentStep + 1, 'next');
        window.scrollTo(0, 300);
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        trackBookingStepChange(currentStep - 1, 'previous');
        window.scrollTo(0, 300);
    };

    const handleStepClick = (stepId: number) => {
        // Allow navigation to completed steps (can always go back)
        if (currentStep > stepId) {
            setCurrentStep(stepId);
            trackBookingStepChange(stepId, 'previous');
            window.scrollTo(0, 300);
            return;
        }
        
        // Allow navigation to current step (no-op)
        if (currentStep === stepId) {
            return;
        }
        
        // For future steps, check prerequisites
        if (stepId === 2) {
            // Can go to step 2 if step 1 is completed (address and size filled)
            if (formData.propertyAddress && formData.propertySize) {
                setCurrentStep(stepId);
                trackBookingStepChange(stepId, 'next');
                window.scrollTo(0, 300);
            }
        } else if (stepId === 3) {
            // Can go to step 3 (Add Ons) - no package required
            setCurrentStep(stepId);
            trackBookingStepChange(stepId, 'next');
            window.scrollTo(0, 300);
        } else if (stepId === 4) {
            // Can go to step 4 if we've been to step 3 (no package required)
            if (currentStep >= 3) {
                setCurrentStep(stepId);
                trackBookingStepChange(stepId, 'next');
                window.scrollTo(0, 300);
            }
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Sync BookingArea's formData to hook's state before submission
        setHookFormData({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            message: formData.message,
            [HONEYPOT_FIELD]: formData[HONEYPOT_FIELD],
        });
        
        // Apply property details before submission
        setAppliedPropertyAddress(formData.propertyAddress);
        setAppliedPropertySuite(formData.unitNumber);
        setAppliedPropertySize(formData.propertySize);
        
        // Use hook's form submit handler
        await handleFormSubmit(e);
    };

    if (isSubmitted) {
        return (
            <div className="pb-100 booking-theme-light text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="success-box p-5 border rounded booking-success-box-light">
                                <h2 className="mb-4 booking-text-primary">Booking Submitted Successfully!</h2>
                                <p className="text-secondary mb-5 booking-text-muted">
                                    Thank you for your interest. Our team will review your property details and get back to you with a final confirmation and timeline within 24 hours.
                                </p>
                                <button
                                    className="tp-btn-black-2"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Back to Home
                                    <span className="p-relative ml-10">
                                        <RightArrowTwo />
                                        <ArrowBg />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // packages already available from hook

    const steps = [
        { id: 1, name: 'Property Details' },
        { id: 2, name: 'Package' },
        { id: 3, name: 'Add Ons' },
        { id: 4, name: 'Complete Booking' },
    ];

    return (
        <div className="cn-contactform-area booking-theme-light" style={{ fontFamily: 'var(--font-inter)', paddingTop: '50px', paddingBottom: '100px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="booking-page-layout">
                            {/* Left: vertical progress bar */}
                            <aside className="booking-progress-sidebar">
                                <div className="booking-progress-vertical">
                                    {steps.map((step, idx) => {
                                        const isClickable = currentStep > step.id || 
                                            (step.id === 2 && formData.propertyAddress && formData.propertySize) ||
                                            (step.id === 3 && formData.propertyAddress && formData.propertySize) || // Can access Add Ons after step 1
                                            (step.id === 4 && currentStep >= 3); // Can access step 4 if we've been to step 3
                                        
                                        return (
                                            <div 
                                                key={step.id} 
                                                className={`booking-progress-step-wrap ${isClickable ? 'clickable' : ''}`}
                                                onClick={() => isClickable && handleStepClick(step.id)}
                                                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                                            >
                                                <div className="booking-progress-step-row">
                                                    <div
                                                        className={`booking-progress-circle ${currentStep > step.id ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}
                                                        aria-current={currentStep === step.id ? 'step' : undefined}
                                                    >
                                                        {currentStep > step.id && (
                                                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="booking-progress-check">
                                                                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={`booking-progress-label ${currentStep >= step.id ? 'active' : ''}`}>
                                                        {step.name}
                                                    </span>
                                                </div>
                                                {idx < steps.length - 1 && (
                                                    <div className={`booking-progress-connector ${currentStep > step.id ? 'completed' : ''}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </aside>

                            <div className="booking-form-main">
                                <div className="cn-contactform-wrap p-relative">
                                    <form onSubmit={onSubmit}>
                                {currentStep === 1 && (
                                    <div className="step-content fadeIn">
                                        <div className="row justify-content-start">
                                            <div className="col-lg-8">
                                                {/* Honeypot - leave blank */}
                                                <div className="visually-hidden" aria-hidden="true">
                                                    <label htmlFor="booking-website_url">Leave this blank</label>
                                                    <input
                                                        id="booking-website_url"
                                                        name={HONEYPOT_FIELD}
                                                        type="text"
                                                        tabIndex={-1}
                                                        autoComplete="off"
                                                        value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="cn-contactform-input mb-25">
                                                    <label className="text-white">Property Address *</label>
                                                    <input
                                                        key={enterManually ? 'manual' : 'autosuggest'}
                                                        ref={!enterManually ? addressInputRef : undefined}
                                                        name="propertyAddress"
                                                        type="text"
                                                        placeholder={enterManually ? 'Enter full address' : 'Start typing an address...'}
                                                        value={formData.propertyAddress}
                                                        onChange={handleInputChange}
                                                        required
                                                        autoComplete="off"
                                                        className="property-address-input"
                                                    />
                                                    {!addressGiven && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 mt-2 text-white-50 text-decoration-underline"
                                                            onClick={() => {
                                                                setEnterManually(true);
                                                                setAddressGiven(true);
                                                            }}
                                                        >
                                                            Enter address manually
                                                        </button>
                                                    )}
                                                    {fieldErrors.propertyAddress && <ErrorMsg msg={fieldErrors.propertyAddress} />}
                                                </div>
                                                {addressGiven && (
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="cn-contactform-input mb-25">
                                                                <label className="text-white">Unit / Suite (Optional)</label>
                                                                <input
                                                                    name="unitNumber"
                                                                    type="text"
                                                                    placeholder="Apt 2B"
                                                                    value={formData.unitNumber}
                                                                    onChange={handleInputChange}
                                                                    style={{ fontSize: '16px' }}
                                                                    className="property-input-16px"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="cn-contactform-input mb-25">
                                                                <label className="text-white">Square Footage (sq ft) *</label>
                                                                <input
                                                                    name="propertySize"
                                                                    type="number"
                                                                    placeholder="e.g. 1500"
                                                                    value={formData.propertySize}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                    style={{ fontSize: '16px' }}
                                                                    className="property-input-16px property-size-input"
                                                                />
                                                                {fieldErrors.propertySize && <ErrorMsg msg={fieldErrors.propertySize} />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="step-content fadeIn">
                                        <div className="step2-layout">
                                            <div className="step2-left">
                                                <div className="tp-price-area">
                                                    {packages.map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className={`pkg-card cursor-pointer ${formData.selectedPackage === item.id ? "pkg-card-active" : ""}`}
                                                            onClick={() => handlePackageSelect(item.id)}
                                                        >
                                                            <PkgCarousel images={item.images} packageId={item.id} />
                                                            <div className="pkg-card-inner">
                                                                <div className="pkg-card-header">
                                                                    <div className="pkg-card-title">
                                                                        <span className="pkg-card-num">0{index + 1}</span>
                                                                        <h5>{item.name}</h5>
                                                                        {item.popular && <span className="pkg-popular-tag">Popular</span>}
                                                                    </div>
                                                                    <div className="pkg-card-price">
                                                                        <span className="pkg-price-amount">${getDisplayPackagePrice(item.basePrice, item.id)}</span>
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
                                                                        className={`tp-btn-black-md ${formData.selectedPackage === item.id ? "pkg-btn-default" : "pkg-btn-proceed"}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePackageSelect(item.id);
                                                                        }}
                                                                    >
                                                                        {formData.selectedPackage === item.id ? "Selected" : "Choose Package"}
                                                                        <span>
                                                                            <UpArrow />
                                                                        </span>
                                                                    </button>
                                                                    {formData.selectedPackage === item.id && (
                                                                        <button
                                                                            type="button"
                                                                            className="tp-btn-black-md pkg-btn-proceed"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleNext();
                                                                            }}
                                                                        >
                                                                            Choose Addons
                                                                        </button>
                                                                    )}
                                                                    {!formData.selectedPackage && (
                                                                        <button
                                                                            type="button"
                                                                            className="tp-btn-black-md pkg-btn-default"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleNext();
                                                                            }}
                                                                        >
                                                                            I'll Pick & Choose
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="step2-right">
                                                <div className="sidebar-sticky">
                                                    {/* Property Address */}
                                                    <div className="sidebar-address">
                                                        <div className="d-flex justify-content-between align-items-center mb-14">
                                                            <h6 className="sidebar-label mb-0">Property</h6>
                                                            <button
                                                                type="button"
                                                                className="sidebar-edit-btn"
                                                                onClick={() => setCurrentStep(1)}
                                                                title="Edit property details"
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <p className="sidebar-address-text">
                                                            {formData.propertyAddress}
                                                        </p>
                                                        {formData.unitNumber && (
                                                            <p className="sidebar-address-unit">Unit {formData.unitNumber}</p>
                                                        )}
                                                        <span className="sidebar-sqft">{formData.propertySize} sq ft</span>
                                                    </div>

                                                    {/* Preferred Partner Code */}
                                                    <div className="sidebar-partner-code mb-20">
                                                        <label className="sidebar-label d-block mb-10">Preferred partner code (optional)</label>
                                                        {appliedPartnerCode ? (
                                                            <div className="sidebar-partner-chip">
                                                                <span className="sidebar-partner-chip-text">{appliedPartnerCode}</span>
                                                                <button
                                                                    type="button"
                                                                    className="sidebar-partner-chip-remove"
                                                                    onClick={() => {
                                                                        setAppliedPartnerCode('');
                                                                        setFormData(prev => ({ ...prev, preferredPartnerCode: '' }));
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

                                                    {/* Price Summary */}
                                                    <div className="sidebar-pricing">
                                                        <h6 className="sidebar-label">Estimate</h6>

                                                        {formData.selectedPackage ? (
                                                            <>
                                                                <div className="sidebar-line-item sidebar-package-item">
                                                                    <span>{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <span>${packages.find(p => p.id === formData.selectedPackage) ? getDisplayPackagePrice(packages.find(p => p.id === formData.selectedPackage)!.basePrice, formData.selectedPackage) : 0}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="sidebar-remove-btn"
                                                                            onClick={handlePackageRemove}
                                                                            title="Remove package"
                                                                        >
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {formData.selectedAddOns.length > 0 && (
                                                                    <div className="sidebar-addons-list">
                                                                        {formData.selectedAddOns.map(id => {
                                                                            const addon = addons.find(a => a.id === id);
                                                                            return (
                                                                                <div key={id} className="sidebar-line-item sidebar-addon-line">
                                                                                    <span>{addon?.name}</span>
                                                                                    <span>${getAddonPrice(id)}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}

                                                                <div className="sidebar-divider"></div>

                                                                <div className="sidebar-total">
                                                                    <span>Total</span>
                                                                    <span>${calculateTotal()}</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p className="sidebar-empty">Select a package to see pricing</p>
                                                        )}
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

                                {currentStep === 3 && (
                                    <div className="step-content fadeIn">
                                        <div className="step2-layout">
                                            <div className="step2-left">
                                                <div className="addons-section">
                                                    <h6 className="text-white mb-20" style={{ fontSize: '18px', letterSpacing: '0.5px' }}>Enhance Your Listing</h6>
                                                    <div className="addons-grid">
                                                        {availableAddOns.filter(addon => {
                                                            // Hide listing_website when a package is selected
                                                            if (formData.selectedPackage && addon.id === 'listing_website') {
                                                                return false;
                                                            }
                                                            return true;
                                                        }).map(addon => (
                                                            <div
                                                                key={addon.id}
                                                                className={`addon-thumb ${formData.selectedAddOns.includes(addon.id) ? 'addon-thumb-active' : ''}`}
                                                                onClick={() => handleAddOnToggleWithTracking(addon.id)}
                                                            >
                                                                <div className="addon-thumb-img">
                                                                    <img src={addon.image} alt={addon.name} loading="lazy" />
                                                                    {formData.selectedAddOns.includes(addon.id) && (
                                                                        <div className="addon-thumb-check">✓</div>
                                                                    )}
                                                                </div>
                                                                <div className="addon-thumb-info">
                                                                    <span className="addon-thumb-name">{addon.name}</span>
                                                                    <span className="addon-thumb-price">+${getAddonPrice(addon.id)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="step2-right">
                                                <div className="sidebar-sticky">
                                                    <div className="sidebar-address">
                                                        <div className="d-flex justify-content-between align-items-center mb-14">
                                                            <h6 className="sidebar-label mb-0">Property</h6>
                                                            <button
                                                                type="button"
                                                                className="sidebar-edit-btn"
                                                                onClick={() => setCurrentStep(1)}
                                                                title="Edit property details"
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <p className="sidebar-address-text">{formData.propertyAddress}</p>
                                                        {formData.unitNumber && <p className="sidebar-address-unit">Unit {formData.unitNumber}</p>}
                                                        <span className="sidebar-sqft">{formData.propertySize} sq ft</span>
                                                    </div>
                                                    <div className="sidebar-partner-code mb-20">
                                                        <label className="sidebar-label d-block mb-10">Preferred partner code (optional)</label>
                                                        {appliedPartnerCode ? (
                                                            <div className="sidebar-partner-chip">
                                                                <span className="sidebar-partner-chip-text">{appliedPartnerCode}</span>
                                                                <button type="button" className="sidebar-partner-chip-remove" onClick={() => { setAppliedPartnerCode(''); setFormData(prev => ({ ...prev, preferredPartnerCode: '' })); }} aria-label="Remove partner code">
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="sidebar-partner-row d-flex gap-2 align-items-flex-start">
                                                                    <input type="text" name="preferredPartnerCode" className="sidebar-partner-input" placeholder="Enter code" value={formData.preferredPartnerCode} onChange={handleInputChange} autoComplete="off" />
                                                                    <button type="button" className="sidebar-partner-apply-btn" onClick={handleApplyPartnerCode}>Apply</button>
                                                                </div>
                                                                {fieldErrors.preferredPartnerCode && <div className="sidebar-partner-error mt-2"><ErrorMsg msg={fieldErrors.preferredPartnerCode} /></div>}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="sidebar-pricing">
                                                        <h6 className="sidebar-label">Estimate</h6>
                                                        {formData.selectedPackage ? (
                                                            <>
                                                                <div className="sidebar-line-item sidebar-package-item">
                                                                    <span>{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <span>${packages.find(p => p.id === formData.selectedPackage) ? getDisplayPackagePrice(packages.find(p => p.id === formData.selectedPackage)!.basePrice, formData.selectedPackage) : 0}</span>
                                                                        <button type="button" className="sidebar-remove-btn" onClick={handlePackageRemove} title="Remove package">
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {formData.selectedAddOns.length > 0 && (
                                                                    <div className="sidebar-addons-list">
                                                                        {formData.selectedAddOns.map(id => {
                                                                            const addon = addons.find(a => a.id === id);
                                                                            return <div key={id} className="sidebar-line-item sidebar-addon-line"><span>{addon?.name}</span><span>${getAddonPrice(id)}</span></div>;
                                                                        })}
                                                                    </div>
                                                                )}
                                                                <div className="sidebar-divider"></div>
                                                                <div className="sidebar-total"><span>Total</span><span>${calculateTotal()}</span></div>
                                                            </>
                                                        ) : (
                                                            <p className="sidebar-empty">Select a package to see pricing</p>
                                                        )}
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

                                {currentStep === 4 && (
                                    <div className="step-content fadeIn">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-10">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Full Name *</label>
                                                            <input
                                                                name="name"
                                                                type="text"
                                                                placeholder="John Doe"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                                className="property-input-16px"
                                                            />
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
                                                                onBlur={(e) => handleEmailBlur(e)}
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
                                                                onBlur={(e) => handlePhoneBlur(e)}
                                                            />
                                                            {fieldErrors.phone && <ErrorMsg msg={fieldErrors.phone} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Preferred Date</label>
                                                            <input
                                                                name="preferredDate"
                                                                type="date"
                                                                value={formData.preferredDate}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Preferred Start Time</label>
                                                            <input
                                                                name="preferredTime"
                                                                type="time"
                                                                value={formData.preferredTime}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Notes or Special Requirements</label>
                                                            <textarea
                                                                name="message"
                                                                placeholder="Tell us about the property, access instructions, or any specific shots you need..."
                                                                value={formData.message}
                                                                onChange={handleInputChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-summary booking-summary-light mt-50 p-5 border rounded">
                                                    <h3 className="mb-30 text-center booking-text-primary">Booking Summary</h3>
                                                    <div className="summary-details">
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="booking-text-muted">Package:</span>
                                                            <span className="font-weight-bold booking-text-primary">{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="booking-text-muted">Base Price:</span>
                                                            <span className="booking-text-primary">${packages.find(p => p.id === formData.selectedPackage) ? getDisplayPackagePrice(packages.find(p => p.id === formData.selectedPackage)!.basePrice, formData.selectedPackage) : 0}</span>
                                                        </div>

                                                        {formData.selectedAddOns.length > 0 && (
                                                            <div className="addon-summary mb-15">
                                                                <span className="booking-text-muted d-block mb-10">Add-ons:</span>
                                                                {formData.selectedAddOns.map(id => {
                                                                    const addon = addons.find(a => a.id === id);
                                                                    return (
                                                                        <div key={id} className="d-flex justify-content-between mb-5 pl-20">
                                                                            <span className="booking-text-muted small">- {addon?.name}</span>
                                                                            <span className="booking-text-muted small">${getAddonPrice(id)}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        <div className="border-top my-20 booking-summary-divider"></div>

                                                        <div className="d-flex justify-content-between mb-10">
                                                            <span className="booking-text-muted">Subtotal:</span>
                                                            <span className="booking-text-primary">${calculateTotal().toFixed(2)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="booking-text-muted">HST (13%):</span>
                                                            <span className="booking-text-primary">${(calculateTotal() * 0.13).toFixed(2)}</span>
                                                        </div>

                                                        <div className="border-top my-20 booking-summary-divider"></div>

                                                        <div className="d-flex justify-content-between">
                                                            <h4 className="booking-text-primary mb-0">Total</h4>
                                                            <h4 className="booking-text-primary mb-0">${(calculateTotal() * 1.13).toFixed(2)}</h4>
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
                                        <p className="booking-text-primary fw-bold mb-2">Submission failed</p>
                                        {formErrors.map((err, i) => (
                                            <ErrorMsg key={i} msg={err} />
                                        ))}
                                    </div>
                                )}

                                <div className="form-navigation mt-60 d-flex justify-content-start gap-4">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            className="tp-btn-black-2 booking-btn-outline"
                                            onClick={handlePrevious}
                                            disabled={isSubmitting}
                                        >
                                            Previous Step
                                        </button>
                                    )}

                                    {currentStep === 1 ? (
                                        <>
                                            <button
                                                type="button"
                                                className="tp-btn-black-md pkg-btn-proceed"
                                                onClick={handleNext}
                                                disabled={!formData.propertyAddress || !formData.propertySize}
                                            >
                                                Choose Package
                                                <span className="p-relative">
                                                    <RightArrowTwo />
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="tp-btn-black-md pkg-btn-default"
                                                onClick={() => {
                                                    if (formData.propertyAddress && formData.propertySize) {
                                                        setCurrentStep(3);
                                                        trackBookingStepChange(3, 'next');
                                                        window.scrollTo(0, 300);
                                                    }
                                                }}
                                                disabled={!formData.propertyAddress || !formData.propertySize}
                                            >
                                                Pick Services
                                            </button>
                                        </>
                                    ) : currentStep === 2 ? (
                                        <button
                                            type="button"
                                            className="tp-btn-black-2 booking-btn-primary"
                                            onClick={handleNext}
                                        >
                                            Next: AddOns
                                            <span className="p-relative">
                                                <RightArrowTwo />
                                                <ArrowBg />
                                            </span>
                                        </button>
                                    ) : currentStep === 3 ? (
                                        <button
                                            type="button"
                                            className="tp-btn-black-2 booking-btn-primary"
                                            onClick={handleNext}
                                        >
                                            Next: Complete Booking
                                            <span className="p-relative">
                                                <RightArrowTwo />
                                                <ArrowBg />
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="tp-btn-black-2 booking-btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Complete Booking'}
                                            <span className="p-relative">
                                                <RightArrowTwo />
                                                <ArrowBg />
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .fadeIn { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                /* Booking page: left progress sidebar + right form */
                .booking-page-layout { display: flex; gap: 48px; align-items: flex-start; margin-top: 32px; }
                .booking-progress-sidebar { flex: 0 0 220px; position: sticky; top: 120px; }
                .booking-form-main { flex: 1; min-width: 0; }
                .booking-form-main .cn-contactform-wrap { padding-left: 0; }

                .booking-progress-vertical { display: flex; flex-direction: column; }
                .booking-progress-step-wrap { display: flex; flex-direction: column; align-items: flex-start; flex: 0 0 auto; }
                .booking-progress-step-wrap.clickable { transition: opacity 0.2s; }
                .booking-progress-step-wrap.clickable:hover { opacity: 0.8; }
                .booking-progress-step-wrap.clickable:hover .booking-progress-circle { transform: scale(1.05); }
                .booking-progress-step-wrap.clickable:hover .booking-progress-label { opacity: 0.9; }
                .booking-progress-step-row { display: flex; align-items: center; gap: 16px; }
                .booking-progress-circle {
                    width: 36px; height: 36px; border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.35);
                    background: transparent;
                    flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
                }
                .booking-progress-circle.active {
                    border-color: #fff;
                    background: #fff;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,255,255,0.15);
                }
                .booking-progress-circle.completed {
                    border-color: #fff;
                    background: #fff;
                    color: #000;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
                }
                .booking-progress-circle.completed .booking-progress-check { color: #000; }
                .booking-progress-label {
                    font-size: 13px; text-transform: uppercase; letter-spacing: 1px;
                    color: rgba(255,255,255,0.4); font-weight: 500;
                    transition: color 0.25s;
                }
                .booking-progress-label.active { color: #fff; }
                .booking-progress-connector {
                    width: 2px; min-height: 32px; margin-left: 17px; margin-top: 6px; margin-bottom: 6px;
                    background: rgba(255,255,255,0.2);
                    transition: background 0.25s;
                }
                .booking-progress-connector.completed { background: rgba(255,255,255,0.6); }

                @media (max-width: 991px) {
                    .booking-page-layout { flex-direction: column; gap: 28px; }
                    .booking-progress-sidebar { flex: 0 0 auto; position: static; width: 100%; }
                    .booking-progress-vertical { flex-direction: row; justify-content: center; flex-wrap: wrap; gap: 8px 24px; }
                    .booking-progress-step-wrap { flex-direction: row; align-items: center; }
                    .booking-progress-connector { width: 24px; min-width: 24px; height: 2px; min-height: 0; margin: 0 4px; }
                }

                /* Step 2 - Two-column layout */
                .step2-layout { display: flex; gap: 40px; }
                .step2-left { flex: 0 0 68%; max-width: 68%; }
                .step2-right { flex: 0 0 28%; max-width: 28%; }
                @media (max-width: 991px) {
                    .step2-layout { flex-direction: column; }
                    .step2-left { flex: 0 0 100%; max-width: 100%; }
                    .step2-right { flex: 0 0 100%; max-width: 100%; }
                }

                /* Sidebar */
                .sidebar-sticky { position: sticky; top: 120px; }
                .sidebar-address { border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 20px; }
                .sidebar-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 14px; font-weight: 600; }
                .sidebar-address-text { color: #fff; font-size: 16px; font-weight: 500; margin-bottom: 4px; line-height: 1.5; }
                .sidebar-address-unit { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 4px; }
                .sidebar-sqft { color: rgba(255,255,255,0.4); font-size: 13px; }
                .sidebar-partner-row { flex-wrap: wrap; }
                .sidebar-partner-code .sidebar-partner-input {
                    flex: 1; min-width: 120px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2);
                    color: #fff; padding: 10px 14px; border-radius: 6px; font-size: 14px;
                }
                .sidebar-partner-code .sidebar-partner-input::placeholder { color: rgba(255,255,255,0.4); }
                .sidebar-partner-apply-btn {
                    padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500;
                    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
                    color: #fff; cursor: pointer; white-space: nowrap;
                }
                .sidebar-partner-apply-btn:hover { background: rgba(255,255,255,0.25); }
                .sidebar-partner-error { margin-top: 8px; }
                .sidebar-partner-chip {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
                    border-radius: 9999px; padding: 8px 6px 8px 16px;
                }
                .sidebar-partner-chip-text { color: #fff; font-size: 14px; font-weight: 500; }
                .sidebar-partner-chip-remove {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 22px; height: 22px; border-radius: 50%;
                    background: rgba(255,255,255,0.2); border: none; color: #fff;
                    cursor: pointer; padding: 0;
                }
                .sidebar-partner-chip-remove:hover { background: rgba(255,255,255,0.35); }
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

                /* Package cards - stacked vertically */
                .pkg-card { border: 1px solid rgba(255,255,255,0.1); background: #111; margin-bottom: 16px; cursor: pointer; transition: all 0.3s; }
                .pkg-card:hover { border-color: rgba(255,255,255,0.3); }
                .pkg-card-active { border-color: #fff; background: #1a1a1a; }
                .pkg-card-inner { padding: 28px 30px; }
                .pkg-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .pkg-card-title { display: flex; align-items: center; gap: 14px; }
                .pkg-card-title h5 { color: #fff; margin: 0; font-size: 20px; font-weight: 600; }
                .pkg-card-num { color: rgba(255,255,255,0.3); font-size: 14px; font-weight: 500; }
                .pkg-popular-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #000; background: #fff; padding: 3px 10px; font-weight: 600; }
                .pkg-card-price { flex-shrink: 0; }
                .pkg-price-amount { color: #fff; font-size: 28px; font-weight: 700; }
                .pkg-card-features { margin-bottom: 18px; }
                .pkg-card-features ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 6px 24px; }
                .pkg-card-features li { color: rgba(255,255,255,0.65); font-size: 14px; display: flex; align-items: center; gap: 8px; }
                .pkg-card-features li i { color: rgba(255,255,255,0.35); font-size: 12px; }
                .pkg-card-active .pkg-card-features li { color: rgba(255,255,255,0.85); }
                .pkg-card-active .pkg-card-features li i { color: #fff; }
                .pkg-card-action { display: flex; justify-content: flex-start; gap: 12px; align-items: center; }

                /* Package carousel */
                .pkg-carousel { position: relative; width: 100%; aspect-ratio: 16 / 7; overflow: hidden; background: #0a0a0a; }
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
                .pkg-btn-proceed { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .pkg-btn-proceed:hover { background-color: #333; color: #fff; border-color: #333; }

                /* ========== Light theme overrides (booking page only) ========== */
                .booking-theme-light { background: #f8f9fa; }
                .booking-theme-light .booking-text-primary { color: #1a1a1a; }
                .booking-theme-light .booking-text-muted { color: #555; }
                .booking-theme-light .success-box.booking-success-box-light { background: #fff; border-color: rgba(0,0,0,0.12); }
                .booking-theme-light .booking-summary-light { background: #fff; border-color: rgba(0,0,0,0.12); }
                .booking-theme-light .booking-summary-divider { border-color: rgba(0,0,0,0.12) !important; }

                .booking-theme-light .ab-about-category-title { color: #1a1a1a; }
                .booking-theme-light .tp-section-subtitle { color: #333; }
                .booking-theme-light .booking-progress-circle {
                    border-color: rgba(0,0,0,0.25);
                    background: #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                }
                .booking-theme-light .booking-progress-circle.active {
                    border-color: #1a1a1a;
                    background: #1a1a1a;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                }
                .booking-theme-light .booking-progress-circle.active .booking-progress-check { color: #fff; }
                .booking-theme-light .booking-progress-circle.completed {
                    border-color: #1a1a1a;
                    background: #1a1a1a;
                    color: #fff;
                }
                .booking-theme-light .booking-progress-circle.completed .booking-progress-check { color: #fff; }
                .booking-theme-light .booking-progress-label { color: rgba(0,0,0,0.45); }
                .booking-theme-light .booking-progress-label.active { color: #1a1a1a; }
                .booking-theme-light .booking-progress-connector { background: rgba(0,0,0,0.15); }
                .booking-theme-light .booking-progress-connector.completed { background: rgba(0,0,0,0.4); }

                .booking-theme-light .cn-contactform-input label,
                .booking-theme-light .text-white { color: #1a1a1a !important; }
                .booking-theme-light .text-white-50,
                .booking-theme-light .btn-link.booking-text-muted { color: #555 !important; }
                .booking-theme-light .cn-contactform-input input,
                .booking-theme-light .cn-contactform-input textarea {
                    color: #1a1a1a;
                    border-bottom-color: rgba(0,0,0,0.2);
                    background: transparent;
                }
                .booking-theme-light .cn-contactform-input input::placeholder,
                .booking-theme-light .cn-contactform-input textarea::placeholder { color: #888; }

                /* Property input font sizes */
                .property-input-16px { font-size: 16px !important; }
                .property-input-16px::placeholder { font-size: 16px !important; }
                
                /* Property address input font size */
                .property-address-input { font-size: 16px !important; }
                .property-address-input::placeholder { font-size: 16px !important; }
                
                /* Hide number input spinner */
                .property-size-input::-webkit-inner-spin-button,
                .property-size-input::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .property-size-input {
                    -moz-appearance: textfield;
                }

                .booking-theme-light .sidebar-address { border-color: rgba(0,0,0,0.12); background: #fff; }
                .booking-theme-light .sidebar-label { color: rgba(0,0,0,0.5); }
                .booking-theme-light .sidebar-address-text { color: #1a1a1a; }
                .booking-theme-light .sidebar-address-unit { color: #555; }
                .booking-theme-light .sidebar-sqft { color: rgba(0,0,0,0.5); }
                .booking-theme-light .sidebar-partner-code .sidebar-partner-input {
                    background: #f5f5f5; border-color: rgba(0,0,0,0.15);
                    color: #1a1a1a;
                }
                .booking-theme-light .sidebar-partner-code .sidebar-partner-input::placeholder { color: #888; }
                .booking-theme-light .sidebar-partner-apply-btn {
                    background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.2);
                    color: #1a1a1a;
                }
                .booking-theme-light .sidebar-partner-apply-btn:hover { background: rgba(0,0,0,0.14); }
                .booking-theme-light .sidebar-partner-chip {
                    background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.15);
                }
                .booking-theme-light .sidebar-partner-chip-text { color: #1a1a1a; }
                .booking-theme-light .sidebar-partner-chip-remove { background: rgba(0,0,0,0.15); color: #1a1a1a; }
                .booking-theme-light .sidebar-partner-chip-remove:hover { background: rgba(0,0,0,0.25); }
                .booking-theme-light .sidebar-pricing { border-color: rgba(0,0,0,0.12); background: #fff; }
                .booking-theme-light .sidebar-line-item { color: #1a1a1a; }
                .booking-theme-light .sidebar-addon-line { color: #555; }
                .booking-theme-light .sidebar-divider { background: rgba(0,0,0,0.1); }
                .booking-theme-light .sidebar-total { color: #1a1a1a; }
                .booking-theme-light .sidebar-empty { color: rgba(0,0,0,0.4); }
                .booking-theme-light .sidebar-edit-btn { color: rgba(0,0,0,0.5); }
                .booking-theme-light .sidebar-edit-btn:hover { color: #1a1a1a; }
                .booking-theme-light .sidebar-remove-btn { color: rgba(0,0,0,0.5); }
                .booking-theme-light .sidebar-remove-btn:hover { color: #1a1a1a; }

                .booking-theme-light .pkg-card { border-color: rgba(0,0,0,0.12); background: #fff; }
                .booking-theme-light .pkg-card:hover { border-color: rgba(0,0,0,0.25); }
                .booking-theme-light .pkg-card-active { border-color: #1a1a1a; background: #f8f9fa; }
                .booking-theme-light .pkg-card-title h5 { color: #1a1a1a; }
                .booking-theme-light .pkg-card-num { color: rgba(0,0,0,0.4); }
                .booking-theme-light .pkg-price-amount { color: #1a1a1a; }
                .booking-theme-light .pkg-card-features li { color: #555; }
                .booking-theme-light .pkg-card-features li i { color: rgba(0,0,0,0.35); }
                .booking-theme-light .pkg-card-active .pkg-card-features li { color: #333; }
                .booking-theme-light .pkg-card-active .pkg-card-features li i { color: #1a1a1a; }
                .booking-theme-light .pkg-popular-tag { color: #fff; background: #1a1a1a; }

                .booking-theme-light .pkg-carousel { background: #e9ecef; }
                .booking-theme-light .pkg-carousel-btn { background: rgba(0,0,0,0.5); color: #fff; }
                .booking-theme-light .pkg-carousel-dot { background: rgba(0,0,0,0.3); }
                .booking-theme-light .pkg-carousel-dot.active { background: #1a1a1a; }

                .booking-theme-light .addon-thumb { border-color: rgba(0,0,0,0.12); }
                .booking-theme-light .addon-thumb:hover { border-color: rgba(0,0,0,0.3); }
                .booking-theme-light .addon-thumb-active { border-color: #1a1a1a; }
                .booking-theme-light .addon-thumb-img { background: #e9ecef; }
                .booking-theme-light .addon-thumb-name { color: #1a1a1a; }
                .booking-theme-light .addon-thumb-price { color: #666; }
                .booking-theme-light .addon-thumb-check { background: #1a1a1a; color: #fff; }

                .booking-theme-light .booking-btn-primary { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .booking-theme-light .booking-btn-primary:hover { background-color: #333; color: #fff; border-color: #333; }
                .booking-theme-light .booking-btn-primary:hover span .svg-icon { color: #fff; }
                .booking-theme-light .booking-btn-primary span .svg-icon { color: #fff; }
                .booking-theme-light .booking-btn-step1 { background-color: #fff; color: #1a1a1a; border-color: #1a1a1a; }
                .booking-theme-light .booking-btn-step1:hover { background-color: #f5f5f5; color: #1a1a1a; border-color: #1a1a1a; }
                .booking-theme-light .booking-btn-step1 span .svg-bg { color: #1a1a1a !important; }
                .booking-theme-light .booking-btn-step1 span .svg-icon { color: #fff !important; }
                .booking-theme-light .booking-btn-step1:hover span .svg-bg { color: #1a1a1a !important; }
                .booking-theme-light .booking-btn-step1:hover span .svg-icon { color: #fff !important; }
                .booking-theme-light .booking-btn-step1:disabled {
                    background-color: #e9ecef !important;
                    color: #adb5bd !important;
                    border-color: #dee2e6 !important;
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                .booking-theme-light .booking-btn-step1:disabled span .svg-bg { color: #adb5bd !important; }
                .booking-theme-light .booking-btn-step1:disabled span .svg-icon { color: #adb5bd !important; }
                .booking-theme-light .booking-btn-step1:disabled:hover {
                    background-color: #e9ecef !important;
                    color: #adb5bd !important;
                    border-color: #dee2e6 !important;
                }
                .booking-theme-light .booking-btn-outline { background-color: transparent; color: #1a1a1a; border: 2px solid rgba(0,0,0,0.3); }
                .booking-theme-light .booking-btn-outline:hover { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }

                .booking-theme-light .pkg-btn-selected { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .booking-theme-light .pkg-btn-selected:hover { background-color: #333; color: #fff; }
                .booking-theme-light .pkg-btn-default { background-color: transparent; color: #1a1a1a; border: 2px solid rgba(0,0,0,0.25); }
                .booking-theme-light .pkg-btn-default:hover { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .booking-theme-light .pkg-btn-proceed { background-color: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                .booking-theme-light .pkg-btn-proceed:hover { background-color: #333; color: #fff; border-color: #333; }

            `}</style>
        </div>
    );
}

