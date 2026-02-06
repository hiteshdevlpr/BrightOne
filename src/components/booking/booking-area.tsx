'use client';

import React, { useState, useEffect } from 'react';
import { getPackages, ADD_ONS, Package, AddOn } from '@/data/booking-data';
import { handleBookingSubmission } from './booking-form-handler';
import {
    trackBookingStart,
    trackBookingStepChange,
    trackPackageSelection,
    trackAddOnToggle,
} from '@/lib/analytics';
import ErrorMsg from '../error-msg';
import { RightArrowTwo, ArrowBg, UpArrow } from '../svg';
import Image from 'next/image';

// Simple hand SVG
const HandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-10">
        <path d="M20 10V14M4 10V14M12 2V22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function BookingArea() {
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
        preferredDate: '',
        preferredTime: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        trackBookingStart();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePackageSelect = (packageId: string) => {
        setFormData(prev => ({ ...prev, selectedPackage: packageId }));
        const pkg = getPackages().find(p => p.id === packageId);
        if (pkg) {
            trackPackageSelection(packageId, pkg.name, pkg.basePrice);
        }
    };

    const handleAddOnToggle = (addOnId: string) => {
        setFormData(prev => {
            const isSelected = prev.selectedAddOns.includes(addOnId);
            const updatedAddOns = isSelected
                ? prev.selectedAddOns.filter(id => id !== addOnId)
                : [...prev.selectedAddOns, addOnId];

            const addOn = ADD_ONS.find(a => a.id === addOnId);
            if (addOn) {
                trackAddOnToggle(addOnId, addOn.name, !isSelected, addOn.price);
            }

            return { ...prev, selectedAddOns: updatedAddOns };
        });
    };

    const calculateTotal = () => {
        const pkg = getPackages().find(p => p.id === formData.selectedPackage);
        const packagePrice = pkg?.basePrice || 0;

        const addOnsPrice = formData.selectedAddOns.reduce((total, id) => {
            const addOn = ADD_ONS.find(a => a.id === id);
            return total + (addOn?.price || 0);
        }, 0);

        return packagePrice + addOnsPrice;
    };

    const handleNext = () => {
        if (currentStep === 1 && (!formData.propertyAddress || !formData.propertySize)) {
            setFieldErrors({
                propertyAddress: !formData.propertyAddress ? 'Address is required' : '',
                propertySize: !formData.propertySize ? 'Property size is required' : ''
            });
            return;
        }
        if (currentStep === 2 && !formData.selectedPackage) {
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
        await handleBookingSubmission(
            {
                ...formData,
                serviceType: 'Real Estate Media',
                serviceTier: formData.selectedPackage,
                totalPrice: calculateTotal().toString(),
            },
            setIsSubmitting,
            setIsSubmitted,
            setFormErrors
        );
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

    const packages = getPackages();

    return (
        <div className="cn-contactform-area pt-100 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="ab-about-category-title-box mb-60 text-center p-relative">
                            <span className="tp-section-subtitle mb-15 justify-content-center d-flex align-items-center">
                                <HandIcon /> Book Your Session
                            </span>
                            <h4 className="ab-about-category-title text-white">
                                {currentStep === 1 && "Start With Property Details"}
                                {currentStep === 2 && "Select Your Media Package"}
                                {currentStep === 3 && "Finalize Your Booking"}
                            </h4>

                            <div className="booking-stepper d-flex justify-content-center mt-30">
                                {[1, 2, 3].map(step => (
                                    <div key={step} className={`booking-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                                        <div className="step-num">{step}</div>
                                        <span className="step-txt">
                                            {step === 1 && "Details"}
                                            {step === 2 && "Packages"}
                                            {step === 3 && "Contact"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="cn-contactform-wrap p-relative">
                            <form onSubmit={onSubmit}>
                                {currentStep === 1 && (
                                    <div className="step-content fadeIn">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-8">
                                                <div className="cn-contactform-input mb-25">
                                                    <label className="text-white">Property Address *</label>
                                                    <input
                                                        name="propertyAddress"
                                                        type="text"
                                                        placeholder="123 Main St, Toronto, ON"
                                                        value={formData.propertyAddress}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                    {fieldErrors.propertyAddress && <ErrorMsg msg={fieldErrors.propertyAddress} />}
                                                </div>
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
                                                            />
                                                            {fieldErrors.propertySize && <ErrorMsg msg={fieldErrors.propertySize} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="step-content fadeIn">
                                        <div className="tp-price-area">
                                            <div className="row">
                                                {packages.map((item, index) => (
                                                    <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                                                        <div
                                                            className={`tp-price-item cursor-pointer transition-all ${formData.selectedPackage === item.id ? "active selected" : ""} ${item.popular ? "popular-highlight" : ""}`}
                                                            style={{
                                                                backgroundImage: (formData.selectedPackage === item.id || (formData.selectedPackage === '' && item.popular)) ? `url(/assets/img/price/price-bg-${index + 1}.jpg)` : "",
                                                                backgroundColor: '#111',
                                                                border: formData.selectedPackage === item.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)'
                                                            }}
                                                            onClick={() => handlePackageSelect(item.id)}
                                                        >
                                                            <div
                                                                className="tp-price-head"
                                                                style={{
                                                                    backgroundImage: !(formData.selectedPackage === item.id || (formData.selectedPackage === '' && item.popular)) ? `url(/assets/img/price/price-bg-${index + 1}.jpg)` : "",
                                                                }}
                                                            >
                                                                <span>0{index + 1}</span>
                                                                <h5>{item.name}</h5>
                                                            </div>
                                                            <div className="tp-price-body">
                                                                <span className="tp-price-monthly">
                                                                    $<i>{item.basePrice}</i>
                                                                </span>
                                                                <div className="tp-price-list">
                                                                    <ul>
                                                                        {item.services.map((l, i) => (
                                                                            <li key={i} className="text-white">
                                                                                <i className="fa-sharp fa-light fa-check"></i>
                                                                                {l}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className={`tp-btn-black-md ${formData.selectedPackage === item.id ? "white-bg text-black" : "border-white text-white"} w-100 text-center`}
                                                                    style={{
                                                                        backgroundColor: formData.selectedPackage === item.id ? '#fff' : 'transparent',
                                                                        color: formData.selectedPackage === item.id ? '#000' : '#fff'
                                                                    }}
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="addons-section mt-60">
                                            <div className="section-title-box text-center mb-40">
                                                <h5 className="text-white h3">Enhance Your Listing</h5>
                                                <p className="text-white-50">Select additional services to make your property stand out.</p>
                                            </div>
                                            <div className="row">
                                                {ADD_ONS.map(addon => (
                                                    <div key={addon.id} className="col-lg-4 col-md-6 mb-30">
                                                        <div
                                                            className={`addon-item p-4 border rounded cursor-pointer transition-all d-flex align-items-center justify-content-between ${formData.selectedAddOns.includes(addon.id) ? 'bg-white text-black border-white' : 'border-secondary text-white-50 hover-border-white'}`}
                                                            onClick={() => handleAddOnToggle(addon.id)}
                                                        >
                                                            <div className="addon-info">
                                                                <h6 className={`mb-0 ${formData.selectedAddOns.includes(addon.id) ? 'text-black' : 'text-white'}`}>{addon.name}</h6>
                                                                <span className="small">${addon.price}</span>
                                                            </div>
                                                            <div className={`addon-check ${formData.selectedAddOns.includes(addon.id) ? 'checked' : ''}`}>
                                                                {formData.selectedAddOns.includes(addon.id) ? '✓' : '+'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
                                                            />
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
                                                                required
                                                            />
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
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="cn-contactform-input mb-25">
                                                            <label className="text-white">Preferred Session Date</label>
                                                            <input
                                                                name="preferredDate"
                                                                type="date"
                                                                value={formData.preferredDate}
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

                                                <div className="booking-summary mt-50 p-5 border border-secondary rounded bg-black">
                                                    <h3 className="text-white mb-30 text-center">Booking Summary</h3>
                                                    <div className="summary-details">
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="text-white-50">Package:</span>
                                                            <span className="text-white font-weight-bold">{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-15">
                                                            <span className="text-white-50">Base Price:</span>
                                                            <span className="text-white">${packages.find(p => p.id === formData.selectedPackage)?.basePrice}</span>
                                                        </div>

                                                        {formData.selectedAddOns.length > 0 && (
                                                            <div className="addon-summary mb-15">
                                                                <span className="text-white-50 d-block mb-10">Add-ons:</span>
                                                                {formData.selectedAddOns.map(id => {
                                                                    const addon = ADD_ONS.find(a => a.id === id);
                                                                    return (
                                                                        <div key={id} className="d-flex justify-content-between mb-5 pl-20">
                                                                            <span className="text-white-50 small">- {addon?.name}</span>
                                                                            <span className="text-white-50 small">${addon?.price}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        <div className="border-top border-secondary my-20"></div>

                                                        <div className="d-flex justify-content-between">
                                                            <h4 className="text-white mb-0">Total Estimated Cost</h4>
                                                            <h4 className="text-white mb-0">${calculateTotal()}</h4>
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

                                <div className="form-navigation mt-60 d-flex justify-content-center gap-4">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            className="tp-btn-black-md border border-white text-white"
                                            style={{ backgroundColor: 'transparent' }}
                                            onClick={handlePrevious}
                                            disabled={isSubmitting}
                                        >
                                            Previous Step
                                        </button>
                                    )}

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            className="tp-btn-black-md"
                                            onClick={handleNext}
                                        >
                                            Continue
                                            <span className="p-relative ml-10">
                                                <RightArrowTwo />
                                                <ArrowBg />
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="tp-btn-black-md"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Complete Booking'}
                                            <span className="p-relative ml-10">
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

            <style jsx>{`
                .fadeIn { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .booking-stepper { gap: 40px; margin-bottom: 40px; }
                .booking-step { display: flex; flex-direction: column; align-items: center; opacity: 0.3; transition: all 0.3s; }
                .booking-step.active { opacity: 1; }
                .booking-step.completed { opacity: 0.6; }
                .step-num { width: 40px; height: 40px; border: 1px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; margin-bottom: 10px; }
                .booking-step.completed .step-num { background: #fff; color: #000; }
                .step-txt { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #fff; }
                
                .tp-price-item { border-radius: 0; padding-bottom: 0; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
                .tp-price-item.active { scale: 1.02; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 10; }
                .tp-price-body { flex-grow: 1; display: flex; flex-direction: column; }
                .tp-price-list { flex-grow: 1; }
                
                .addon-item { min-height: 80px; }
                .addon-check { width: 24px; height: 24px; border: 1px solid currentColor; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                
                .gap-4 { gap: 20px; }

                .tp-price-item.active .tp-price-head h5, 
                .tp-price-item.active .tp-price-head span,
                .tp-price-item.active .tp-price-monthly,
                .tp-price-item.active .tp-price-list ul li {
                    color: #fff !important;
                }
                .tp-price-item.active .tp-price-list ul li i {
                    border-color: #fff !important;
                    color: #fff !important;
                }
            `}</style>
        </div>
    );
}

