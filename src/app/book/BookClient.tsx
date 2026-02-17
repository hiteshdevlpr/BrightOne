'use client';

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorMsg from "@/components/error-msg";
import { useBookingLogic } from "@/hooks/use-booking-logic";
import { HONEYPOT_FIELD } from "@/lib/validation";
import { createPaymentIntent } from "@/lib/booking-payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/booking/checkout-form";
import BookingCalendar from "@/components/booking/booking-calendar";
import TimeSlotGrid from "@/components/booking/time-slot-grid";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type BookClientProps = {
    defaultCategory?: 'personal' | 'listing';
};

export default function BookClient({ defaultCategory }: BookClientProps) {
    const router = useRouter();
    const step1SectionRef = useRef<HTMLDivElement>(null);
    const packagesSectionRef = useRef<HTMLDivElement>(null);
    const addonsSectionRef = useRef<HTMLDivElement>(null);
    const schedulingSectionRef = useRef<HTMLDivElement>(null);
    const paymentSectionRef = useRef<HTMLDivElement>(null);
    const bookingSectionRef = useRef<HTMLDivElement>(null);

    // Payment intent state (same business logic as /booking)
    const [clientSecret, setClientSecret] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentIntentError, setPaymentIntentError] = useState<string | null>(null);

    // Use centralized booking logic hook
    const bookingLogic = useBookingLogic({ defaultCategory });
    
    // Destructure hook state and functions
    const {
        selectedCategory,
        propertyAddressInput,
        appliedPropertyAddress,
        propertySuiteInput,
        appliedPropertySuite,
        propertySizeInput,
        appliedPropertySize,
        selectedPackageId,
        selectedAddOns,
        virtualStagingPhotoCount,
        preferredPartnerCodeInput,
        appliedPartnerCode,
        partnerCodeError,
        showPartnerCodePopup,
        partnerCodePopupInput,
        partnerCodePopupError,
        formData,
        isSubmitting,
        isSubmitted,
        formErrors,
        fieldErrors,
        openAccordion,
        enterManuallyListing,
        placesReadyListing,
        packages,
        addons,
        availableAddOns,
        includedInSelectedPackage,
        resolvedSelectedAddOns,
        canCompleteBooking,
        step1Filled,
        setSelectedCategory,
        setPropertyAddressInput,
        setAppliedPropertyAddress,
        setPropertySuiteInput,
        setAppliedPropertySuite,
        setPropertySizeInput,
        setAppliedPropertySize,
        setSelectedPackageId,
        setSelectedAddOns,
        setVirtualStagingPhotoCount,
        setPreferredPartnerCodeInput,
        setPartnerCodeError,
        setShowPartnerCodePopup,
        setPartnerCodePopupInput,
        setPartnerCodePopupError,
        setFormData,
        setIsSubmitting,
        setIsSubmitted,
        setFormErrors,
        setFieldErrors,
        setOpenAccordion,
        setEnterManuallyListing,
        setPlacesReadyListing,
        getPackagePrice,
        getAddonPrice,
        calculateTotal,
        handlePackageClick,
        handleAddOnToggle,
        handleApplyPartnerCode,
        handleApplyPartnerCodeFromPopup,
        handleFormChange,
        handleEmailBlur,
        handlePhoneBlur,
        handleFormSubmit,
        formatPrice,
        propertyAddressInputRef,
        autocompleteListenerRef,
        setAppliedPartnerCode,
    } = bookingLogic;
    
    // Local state for property address buffer (used for Google Maps autocomplete)
    const [propertyAddressBuffer, setPropertyAddressBuffer] = React.useState('');

    // Sync buffer when Google Maps autocomplete updates the address
    React.useEffect(() => {
        if (propertyAddressInput && !enterManuallyListing) {
            setPropertyAddressBuffer(propertyAddressInput);
        }
    }, [propertyAddressInput, enterManuallyListing]);

    // UI-specific helper functions
    const toggleAccordion = (accordionId: string) => {
        setOpenAccordion(openAccordion === accordionId ? null : accordionId);
    };

    const openPartnerCodePopup = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPartnerCodePopupInput(appliedPartnerCode || '');
        setPartnerCodePopupError('');
        setShowPartnerCodePopup(true);
    };

    const closePartnerCodePopup = () => {
        setShowPartnerCodePopup(false);
        setPartnerCodePopupError('');
    };

    // UI-specific helper functions
    const handleSelectPackageAndGoToAddons = (pkgId: string) => {
        handlePackageClick(pkgId);
        if (selectedCategory === 'listing') {
            setOpenAccordion('addons');
            setTimeout(() => {
                addonsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const handleApplyPropertySize = () => {
        const val = propertySizeInput.trim();
        setAppliedPropertySize(val);
    };

    const handleApplyStep1 = () => {
        setAppliedPropertyAddress(propertyAddressInput.trim());
        setAppliedPropertySuite(propertySuiteInput.trim());
        setAppliedPropertySize(propertySizeInput.trim());
    };

    const handleSelectPackages = () => {
        handleApplyStep1();
        setOpenAccordion('packages');
        setTimeout(() => {
            packagesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleEditPropertyDetails = () => {
        setOpenAccordion(selectedCategory === 'listing' ? 'property' : null);
        setTimeout(() => {
            step1SectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleContinueFromAddons = () => {
        setOpenAccordion('scheduling');
        setTimeout(() => {
            schedulingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleContinueFromScheduling = () => {
        setOpenAccordion('booking');
        setTimeout(() => {
            bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleContinueToPayment = () => {
        setOpenAccordion('payment');
        setTimeout(() => {
            paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // Scheduling filled: same validation as /booking step 4
    const schedulingFilled = !!(formData.preferredDate && formData.preferredTime);

    // Can open Payment when package/addons selected, scheduling and contact details filled (same as /booking)
    const canOpenPayment =
        canCompleteBooking &&
        schedulingFilled &&
        !!formData.name?.trim() &&
        !!formData.email?.trim() &&
        !!formData.phone?.trim();

    // Create payment intent when Payment accordion opens (same business logic as /booking)
    useEffect(() => {
        if (
            openAccordion !== 'payment' ||
            !canCompleteBooking ||
            !selectedPackageId ||
            clientSecret
        ) {
            return;
        }
        const displayPkgs =
            selectedCategory === 'personal'
                ? packages.filter((p) => ['growth', 'accelerator', 'tailored'].includes(p.id))
                : packages.filter((p) => ['essential', 'premium', 'luxury'].includes(p.id));
        const pkg = displayPkgs.find((p) => p.id === selectedPackageId);
        const pkgPrice = pkg ? getPackagePrice(pkg.basePrice, pkg.id) : null;
        if (pkgPrice == null) {
            setPaymentIntentError(null);
            return;
        }
        const totalCents = Math.round(calculateTotal() * 1.13 * 100);
        if (totalCents < 50) {
            setPaymentIntentError(null);
            return;
        }
        setPaymentIntentError(null);
        setIsSubmitting(true);
        createPaymentIntent({
            selectedPackageId,
            selectedAddOns: resolvedSelectedAddOns,
            propertySize: selectedCategory === 'listing' ? appliedPropertySize : undefined,
            preferredPartnerCode: appliedPartnerCode || undefined,
        })
            .then(({ clientSecret: secret, amount }) => {
                setClientSecret(secret);
                setPaymentAmount(amount);
            })
            .catch((err: Error) => {
                setPaymentIntentError(err.message || 'Failed to initialize payment');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }, [
        openAccordion,
        canCompleteBooking,
        selectedPackageId,
        resolvedSelectedAddOns,
        appliedPropertySize,
        appliedPartnerCode,
        selectedCategory,
        packages,
        getPackagePrice,
        calculateTotal,
        clientSecret,
    ]);

    const handleCategoryClick = (category: 'personal' | 'listing') => {
        router.push(category === 'personal' ? '/book/personal' : '/book/listing');
    };

    const handleBack = () => {
        router.push('/book');
    };
    
    // Get packages filtered by category
    const displayPackages = selectedCategory === 'personal' 
        ? packages.filter(p => ['growth', 'accelerator', 'tailored'].includes(p.id))
        : packages.filter(p => ['essential', 'premium', 'luxury'].includes(p.id));

    // Same as /booking: payment required when total >= 50 cents and we have a numeric price
    const totalWithTaxCents = Math.round(calculateTotal() * 1.13 * 100);
    const selectedPkg = selectedPackageId ? displayPackages.find((p) => p.id === selectedPackageId) : null;
    const hasNumericPrice = selectedPkg && getPackagePrice(selectedPkg.basePrice, selectedPkg.id) != null;
    const needsPayment = !!(hasNumericPrice && totalWithTaxCents >= 50);

    return (
        <div className="book-mobile-page">
            {/* Logo */}
            <div className="book-logo-container">
                <Link href="/">
                    <img 
                        src="/logo-wo-shadow.png"
                        alt="BrightOne Creative"
                        className="book-logo-img"
                    />
                </Link>
            </div>

            <p className="book-contact-line">
                <a href="tel:4164199689">Call Now to Book!</a>
            </p>

            {/* Social Media Links */}
            <div className="book-social-container">
                <Link 
                    href="https://www.facebook.com/BrightOneInc" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="Facebook"
                >
                    <i className="fa-brands fa-facebook-f"></i>
                </Link>
                <Link 
                    href="https://www.instagram.com/brightoneinc" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="Instagram"
                >
                    <i className="fa-brands fa-instagram"></i>
                </Link>
                <Link 
                    href="https://www.linkedin.com/company/brightoneInc/" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="LinkedIn"
                >
                    <i className="fa-brands fa-linkedin-in"></i>
                </Link>
                <Link 
                    href="https://www.youtube.com/@BrightOneInc" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="YouTube"
                >
                    <i className="fa-brands fa-youtube"></i>
                </Link>
                <Link 
                    href="mailto:hitesh@brightone.ca" 
                    className="book-social-link"
                    aria-label="Email"
                >
                    <i className="fa-solid fa-envelope"></i>
                </Link>
                <Link 
                    href="https://wa.me/14164199689" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp"></i>
                </Link>
            </div>

            {/* Content */}
            <div className="book-content">
                {isSubmitted ? (
                    <div className="book-success-wrap">
                        <div className="book-success-box">
                            <h2 className="book-success-title">Booking Submitted Successfully!</h2>
                            <p className="book-success-text">
                                Thank you for your interest. Our team will review your request and get back to you with confirmation within 24 hours.
                            </p>
                            <Link href="/" className="book-form-submit-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : !selectedCategory ? (
                    <>
                        {/* Service Categories */}
                        <h1 className="book-title">Choose Your Service</h1>
                        <p className="book-subtitle">Select a category to view packages</p>
                        
                        <div className="book-categories">

                            <button
                                onClick={() => handleCategoryClick('listing')}
                                className="book-category-card"
                            >
                                <div className="book-category-icon">
                                    <i className="fa-solid fa-home"></i>
                                </div>
                                <h2 className="book-category-title">Real Estate Listing Media</h2>
                                <p className="book-category-desc">
                                    HDR photography, video tours, drone aerials, and virtual staging
                                </p>
                                <span className="book-category-arrow">View Packages →</span>
                            </button>

                            <button
                                onClick={() => handleCategoryClick('personal')}
                                className="book-category-card"
                            >
                                <div className="book-category-icon">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <h2 className="book-category-title">Personal Branding Media</h2>
                                <p className="book-category-desc">
                                    Professional headshots, lifestyle portraits, and social media content
                                </p>
                                <span className="book-category-arrow">View Packages →</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Packages View */}
                        <div className="book-packages-header">
                            <button onClick={handleBack} className="book-back-btn">
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <h1 className="book-title">
                                {selectedCategory === 'personal' ? 'Personal Branding' : 'Real Estate Listing'}
                            </h1>
                            <p className="book-subtitle">Choose a package that fits your needs</p>
                        </div>

                        {/* Accordion 1: Property Details - Only for Listing */}
                        {selectedCategory === 'listing' && (
                            <div ref={step1SectionRef} className="book-accordion">
                                <button
                                    onClick={() => toggleAccordion('property')}
                                    className={`book-accordion-header ${openAccordion === 'property' ? 'open' : ''}`}
                                >
                                    <span className="book-accordion-title">1. Property Details</span>
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'property' ? 'up' : 'down'}`}></i>
                                </button>
                                {openAccordion === 'property' && (
                                    <div className="book-accordion-content">
                                        <div className="book-step1-wrap" style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>

                                            <div className="book-step1-fields">
                                                <div className="book-form-group">
                                                    <label htmlFor="book-property-address">Property address *</label>
                                                    <input
                                                        ref={propertyAddressInputRef}
                                                        id="book-property-address"
                                                        type="text"
                                                        className="book-step1-input"
                                                        placeholder="Start typing address..."
                                                        value={enterManuallyListing ? propertyAddressInput : propertyAddressBuffer}
                                                        onChange={(e) =>
                                                            enterManuallyListing
                                                                ? setPropertyAddressInput(e.target.value)
                                                                : setPropertyAddressBuffer(e.target.value)
                                                        }
                                                        autoComplete="off"
                                                    />
                                                    {!enterManuallyListing ? (
                                                        <button
                                                            type="button"
                                                            className="book-enter-manually-link"
                                                            onClick={() => {
                                                                setPropertyAddressInput(propertyAddressBuffer);
                                                                setEnterManuallyListing(true);
                                                            }}
                                                        >
                                                            Enter address manually
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="book-enter-manually-link"
                                                            onClick={() => {
                                                                setPropertyAddressInput('');
                                                                setPropertyAddressBuffer('');
                                                                setEnterManuallyListing(false);
                                                            }}
                                                        >
                                                            Use address suggestions
                                                        </button>
                                                    )}
                                                </div>
                                    <div className="book-step1-row">
                                        <div className="book-form-group">
                                            <label htmlFor="book-property-suite">Suite / Unit (optional)</label>
                                            <input
                                                id="book-property-suite"
                                                type="text"
                                                className="book-step1-input"
                                                placeholder="e.g. 101"
                                                value={propertySuiteInput}
                                                onChange={(e) => setPropertySuiteInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="book-form-group">
                                            <label htmlFor="book-property-size">Property size (Sq.Ft)</label>
                                            <input
                                                id="book-property-size"
                                                type="number"
                                                className="book-step1-input"
                                                placeholder="Enter property size"
                                                min={1}
                                                value={propertySizeInput}
                                                onChange={(e) => {
                                                    setPropertySizeInput(e.target.value);
                                                    setAppliedPropertySize('');
                                                }}
                                            />
                                        </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="book-select-packages-btn"
                                                onClick={handleSelectPackages}
                                                disabled={!step1Filled}
                                            >
                                                Continue to Packages
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Accordion 2: Packages (listing) / 1. Packages (personal) */}
                        <div ref={packagesSectionRef} className="book-accordion">
                            <div className={`book-accordion-header book-accordion-header-packages ${openAccordion === 'packages' ? 'open' : ''} ${selectedCategory === 'listing' && !step1Filled ? 'disabled' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => (selectedCategory !== 'listing' || step1Filled) && toggleAccordion('packages')}
                                    className="book-accordion-header-toggle"
                                >
                                    <span className="book-accordion-title">{selectedCategory === 'listing' ? '2. Packages' : '1. Packages'}</span>
                                    {appliedPartnerCode && (
                                        <span className="book-accordion-partner-badge">
                                            PartnerID: {appliedPartnerCode}
                                            <button
                                                type="button"
                                                className="book-accordion-partner-remove"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAppliedPartnerCode('');
                                                    setPreferredPartnerCodeInput('');
                                                }}
                                                aria-label="Remove partner code"
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </span>
                                    )}
                                </button>
                                {(selectedCategory === 'listing' || selectedCategory === 'personal') && !appliedPartnerCode && (
                                    <button
                                        type="button"
                                        className="book-accordion-partner-btn"
                                        onClick={openPartnerCodePopup}
                                    >
                                        Add Partner Code
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => (selectedCategory !== 'listing' || step1Filled) && toggleAccordion('packages')}
                                    className="book-accordion-chevron-btn"
                                    aria-expanded={openAccordion === 'packages'}
                                >
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'packages' ? 'up' : 'down'}`}></i>
                                </button>
                            </div>
                            {openAccordion === 'packages' && (
                                <div className="book-accordion-content">
                                    {selectedCategory === 'listing' && (appliedPropertyAddress || appliedPropertySize) && (
                                        <div className="book-packages-property-summary">
                                            <div className="book-packages-property-details">
                                                {appliedPropertyAddress && <p className="book-packages-property-address">{appliedPropertyAddress}</p>}
                                                {appliedPropertySuite && <p className="book-packages-property-suite">Suite / Unit: {appliedPropertySuite}</p>}
                                                {appliedPropertySize && <p className="book-packages-property-size">Property size: {appliedPropertySize} Sq.Ft</p>}
                                            </div>
                                            <button type="button" className="book-packages-edit-property-btn" onClick={handleEditPropertyDetails}>
                                                <i className="fa-solid fa-pen"></i> Edit
                                            </button>
                                        </div>
                                    )}
                                    <div className="book-packages">
                                        {displayPackages.map((pkg) => {
                                            const calculatedPrice = getPackagePrice(pkg.basePrice, pkg.id);
                                            const isSelected = selectedPackageId === pkg.id;
                                            const sqftNum = appliedPropertySize ? parseInt(appliedPropertySize, 10) : NaN;
                                            const showContactPrice = selectedCategory === 'listing' && !isNaN(sqftNum) && sqftNum >= 5000;
                                            
                                            return (
                                                <div 
                                                    key={pkg.id} 
                                                    className={`book-package-card ${pkg.popular ? 'book-package-popular' : ''} ${isSelected ? 'book-package-selected' : ''}`}
                                                >
                                                    {pkg.popular && (
                                                        <div className="book-package-badge">Most Popular</div>
                                                    )}
                                                    {isSelected && (
                                                        <div className="book-package-selected-badge">
                                                            <i className="fa-solid fa-check"></i> Selected
                                                        </div>
                                                    )}
                                                    <h3 className="book-package-name">{pkg.name}</h3>
                                                    <div className="book-package-price">
                                                        {showContactPrice ? (
                                                            <span className="book-package-contact-price">Contact for Price</span>
                                                        ) : selectedCategory === 'personal' && pkg.id === 'tailored' ? (
                                                            <span className="book-package-contact-price">Book a Call</span>
                                                        ) : (
                                                            formatPrice(calculatedPrice ?? pkg.basePrice)
                                                        )}
                                                    </div>
                                                    <p className="book-package-desc">{pkg.description}</p>
                                                    <ul className="book-package-services">
                                                        {pkg.services.map((service, idx) => (
                                                            <li key={idx}>{service}</li>
                                                        ))}
                                                    </ul>
                                                    {(selectedCategory === 'listing' || selectedCategory === 'personal') ? (
                                                        isSelected ? (
                                                            <div className="book-package-btn-placeholder">Package Selected</div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="book-package-btn-placeholder book-package-select-btn"
                                                                onClick={() => handleSelectPackageAndGoToAddons(pkg.id)}
                                                            >
                                                                {selectedCategory === 'personal' ? 'Select Package' : 'Select and choose Add Ons'}
                                                            </button>
                                                        )
                                                    ) : (
                                                        <div className="book-package-btn-placeholder">—</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Accordion 2: Standalone Services or Add-ons */}
                        {selectedCategory === 'listing' && (
                            <div ref={addonsSectionRef} className="book-accordion">
                                <button
                                    onClick={() => step1Filled && toggleAccordion('addons')}
                                    className={`book-accordion-header ${openAccordion === 'addons' ? 'open' : ''} ${!step1Filled ? 'disabled' : ''}`}
                                >
                                    <span className="book-accordion-title">3. Services and Add-ons</span>
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'addons' ? 'up' : 'down'}`}></i>
                                </button>
                                {openAccordion === 'addons' && (
                                    <div className="book-accordion-content">
                                        <p className="book-addons-subtitle">Enhance your package with additional services</p>
                                        <div className="book-addons-grid">
                                            {availableAddOns.map((addon) => {
                                                const isSelected = selectedAddOns.includes(addon.id);
                                                return (
                                                    <div
                                                        key={addon.id}
                                                        onClick={() => handleAddOnToggle(addon.id)}
                                                        className={`book-addon-card ${isSelected ? 'book-addon-selected' : ''}`}
                                                    >
                                                        <div className="book-addon-content">
                                                            <h4 className="book-addon-name">{addon.name}</h4>
                                                            <p className="book-addon-desc">{addon.description}</p>
                                                            <div className="book-addon-price">{formatPrice(getAddonPrice(addon.id))}</div>
                                                            {addon.comments && (
                                                                <p className="book-addon-comment">{addon.comments}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            type="button"
                                            className="book-addons-continue-btn"
                                            onClick={handleContinueFromAddons}
                                        >
                                            {selectedAddOns.length > 0 ? 'Continue' : 'Continue without Add-ons'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Accordion: Scheduling (same business logic as /booking step 4) */}
                        <div ref={schedulingSectionRef} className="book-accordion">
                            <button
                                onClick={() => canCompleteBooking && toggleAccordion('scheduling')}
                                disabled={!canCompleteBooking}
                                className={`book-accordion-header ${openAccordion === 'scheduling' ? 'open' : ''} ${!canCompleteBooking ? 'disabled' : ''}`}
                            >
                                <span className="book-accordion-title">
                                    {selectedCategory === 'listing' ? '4. Scheduling' : '2. Scheduling'}
                                    {!canCompleteBooking && <span className="book-accordion-disabled-text"> (Select a package first)</span>}
                                </span>
                                {canCompleteBooking && (
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'scheduling' ? 'up' : 'down'}`}></i>
                                )}
                            </button>
                            {openAccordion === 'scheduling' && canCompleteBooking && (
                                <div className="book-accordion-content">
                                    <p className="book-addons-subtitle">Select your preferred date and time</p>
                                    <BookingCalendar
                                        selectedDate={formData.preferredDate || ''}
                                        onDateSelect={(date) => {
                                            setFormData((prev: typeof formData) => ({ ...prev, preferredDate: date, preferredTime: '' }));
                                            setFormErrors([]);
                                        }}
                                    />
                                    <TimeSlotGrid
                                        selectedDate={formData.preferredDate || null}
                                        selectedTime={formData.preferredTime || null}
                                        onTimeSelect={(time) => {
                                            setFormData((prev: typeof formData) => ({ ...prev, preferredTime: time }));
                                            setFormErrors([]);
                                        }}
                                    />
                                    {formErrors.length > 0 && (
                                        <div className="book-form-errors mb-20" role="alert">
                                            {formErrors.map((err, i) => (
                                                <ErrorMsg key={i} msg={err} />
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="book-addons-continue-btn"
                                        onClick={handleContinueFromScheduling}
                                        disabled={!schedulingFilled}
                                    >
                                        Contact Information
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Accordion: Complete Your Booking (contact + message + breakup) */}
                        <div ref={bookingSectionRef} className="book-accordion">
                            <button
                                onClick={() => canCompleteBooking && schedulingFilled && toggleAccordion('booking')}
                                disabled={!canCompleteBooking || !schedulingFilled}
                                className={`book-accordion-header ${openAccordion === 'booking' ? 'open' : ''} ${!canCompleteBooking || !schedulingFilled ? 'disabled' : ''}`}
                            >
                                <span className="book-accordion-title">
                                    {selectedCategory === 'listing' ? '5. Contact Information' : '3. Contact Information'}
                                    {(!canCompleteBooking || !schedulingFilled) && <span className="book-accordion-disabled-text"> (Select package and date/time first)</span>}
                                </span>
                                {canCompleteBooking && schedulingFilled && (
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'booking' ? 'up' : 'down'}`}></i>
                                )}
                            </button>
                            {openAccordion === 'booking' && canCompleteBooking && schedulingFilled && (
                                <div className="book-accordion-content">
                                    {/* Preferred Partner Code - Real Estate (same design as property size) */}
                                    {selectedCategory === 'listing' && (
                                        <div className="book-partner-code-wrap">
                                            <div className="book-partner-code-row">
                                                {appliedPartnerCode ? (
                                                    <>
                                                        <span className="book-partner-applied-code">{appliedPartnerCode}</span>
                                                        <button
                                                            type="button"
                                                            className="book-partner-remove-btn"
                                                            onClick={() => {
                                                                setAppliedPartnerCode('');
                                                                setPreferredPartnerCodeInput('');
                                                            }}
                                                            aria-label="Remove partner code"
                                                        >
                                                            <i className="fa-solid fa-times"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="book-partner-input"
                                                            placeholder="Preferred partner code (optional)"
                                                            value={preferredPartnerCodeInput}
                                                            onChange={(e) => {
                                                                setPreferredPartnerCodeInput(e.target.value);
                                                                setPartnerCodeError('');
                                                            }}
                                                            autoComplete="off"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="book-partner-apply-btn"
                                                            onClick={handleApplyPartnerCode}
                                                        >
                                                            Apply
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {partnerCodeError && <div className="book-partner-error-wrap"><ErrorMsg msg={partnerCodeError} /></div>}
                                        </div>
                                    )}

                                    {/* Breakup: selected package + addons + tax */}
                                    {selectedPackageId && (
                                    <div className="book-form-breakup">
                                        {(() => {
                                            const pkg = displayPackages.find(p => p.id === selectedPackageId);
                                            const pkgPrice = pkg ? getPackagePrice(pkg.basePrice, pkg.id) : null;
                                            const addonsTotal = selectedAddOns.reduce((sum, id) => sum + getAddonPrice(id), 0);
                                            const packageTotal = pkgPrice != null ? pkgPrice : 0;
                                            const subtotal = packageTotal + addonsTotal;
                                            const taxRate = 0.13;
                                            const taxAmount = pkgPrice != null ? Math.round(subtotal * taxRate) : 0;
                                            const totalWithTax = calculateTotal();
                                            return (
                                                <>
                                                    {pkg && (
                                                        <div className="book-form-breakup-item">
                                                            <span>{pkg.name}{appliedPartnerCode ? ' (Preferred Partner)' : ''}</span>
                                                            <span>{pkgPrice != null ? formatPrice(pkgPrice) : 'Contact for Price'}</span>
                                                        </div>
                                                    )}
                                                    {selectedAddOns.map((id) => {
                                                        if (id === 'virtual_staging') {
                                                            return (
                                                                <div key={id} className="book-form-breakup-item">
                                                                    <span>Virtual Staging ({virtualStagingPhotoCount} photos)</span>
                                                                    <span>{formatPrice(getAddonPrice(id))}</span>
                                                                </div>
                                                            );
                                                        }
                                                        const addon = addons.find(a => a.id === id);
                                                        return addon ? (
                                                            <div key={id} className="book-form-breakup-item">
                                                                <span>{addon.name}</span>
                                                                <span>{formatPrice(getAddonPrice(id))}</span>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                    {selectedAddOns.includes('virtual_staging') && (
                                                        <div className="book-virtual-staging-count book-virtual-staging-count-inline">
                                                            <div className="book-virtual-staging-controls">
                                                                <button
                                                                    type="button"
                                                                    className="book-virtual-staging-btn"
                                                                    onClick={() => setVirtualStagingPhotoCount(Math.max(1, virtualStagingPhotoCount - 1))}
                                                                    aria-label="Decrease photo count"
                                                                >
                                                                    <i className="fa-solid fa-minus"></i>
                                                                </button>
                                                                <span className="book-virtual-staging-number">{virtualStagingPhotoCount}</span>
                                                                <button
                                                                    type="button"
                                                                    className="book-virtual-staging-btn"
                                                                    onClick={() => setVirtualStagingPhotoCount(Math.min(99, virtualStagingPhotoCount + 1))}
                                                                    aria-label="Increase photo count"
                                                                >
                                                                    <i className="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            <span className="book-virtual-staging-hint">$12 per photo</span>
                                                        </div>
                                                    )}
                                                    {pkgPrice != null && (
                                                        <div className="book-form-breakup-item book-form-breakup-tax">
                                                            <span>Tax (13%)</span>
                                                            <span>{formatPrice(taxAmount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="book-form-breakup-total">
                                                        <span>Total</span>
                                                        <span>{pkgPrice != null ? formatPrice(totalWithTax) : 'Contact for Price'}</span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    )}

                                    {formErrors.length > 0 && (
                                        <div className="book-form-errors mb-20" role="alert">
                                            {formErrors.map((err, i) => (
                                                <ErrorMsg key={i} msg={err} />
                                            ))}
                                        </div>
                                    )}
                                    <form onSubmit={handleFormSubmit} className="book-contact-form">
                                        <div className="visually-hidden" aria-hidden="true">
                                            <label htmlFor="book-page-website_url">Leave this blank</label>
                                            <input
                                                id="book-page-website_url"
                                                name={HONEYPOT_FIELD}
                                                type="text"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={formData[HONEYPOT_FIELD as keyof typeof formData] ?? ''}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="book-form-group">
                                            <label htmlFor="name">Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                required
                                                placeholder="Your full name"
                                            />
                                        </div>

                                        <div className="book-form-group">
                                            <label htmlFor="email">Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                onBlur={handleEmailBlur}
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                            {fieldErrors.email && <ErrorMsg msg={fieldErrors.email} />}
                                        </div>

                                        <div className="book-form-group">
                                            <label htmlFor="phone">Phone *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                onBlur={handlePhoneBlur}
                                                required
                                                placeholder="(416) 123-4567"
                                            />
                                            {fieldErrors.phone && <ErrorMsg msg={fieldErrors.phone} />}
                                        </div>

                                        <div className="book-form-group">
                                            <label htmlFor="message">Message (Optional)</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleFormChange}
                                                rows={4}
                                                placeholder="Any additional information or special requests..."
                                            />
                                        </div>

                                        <div className="book-form-summary">
                                            {selectedCategory === 'listing' && appliedPropertySize && (
                                                <div className="book-form-summary-item">
                                                    <span>Property Size:</span>
                                                    <span>{appliedPropertySize} sq ft</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="book-form-actions">
                                            {needsPayment ? (
                                                <button
                                                    type="button"
                                                    className="book-form-submit-btn"
                                                    disabled={isSubmitting}
                                                    onClick={handleContinueToPayment}
                                                >
                                                    Proceed to Payment
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="book-form-submit-btn"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Accordion: Payment (same business logic as /booking step 6) */}
                        <div ref={paymentSectionRef} className="book-accordion">
                            <button
                                onClick={() => canOpenPayment && toggleAccordion('payment')}
                                disabled={!canOpenPayment}
                                className={`book-accordion-header ${openAccordion === 'payment' ? 'open' : ''} ${!canOpenPayment ? 'disabled' : ''}`}
                            >
                                <span className="book-accordion-title">
                                    {selectedCategory === 'listing' ? '6. Payment' : '4. Payment'}
                                    {!canOpenPayment && <span className="book-accordion-disabled-text"> (Complete scheduling and contact details first)</span>}
                                </span>
                                {canOpenPayment && (
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'payment' ? 'up' : 'down'}`}></i>
                                )}
                            </button>
                            {openAccordion === 'payment' && canOpenPayment && (
                                <div className="book-accordion-content">
                                    {paymentIntentError && (
                                        <div className="book-form-errors mb-20" role="alert">
                                            <ErrorMsg msg={paymentIntentError} />
                                        </div>
                                    )}
                                    {!needsPayment && (
                                        <p className="book-addons-subtitle">No payment required. Submit your booking from the previous step.</p>
                                    )}
                                    {needsPayment && clientSecret && (
                                        <div className="book-payment-stripe-wrap">
                                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                                                <CheckoutForm
                                                    amount={paymentAmount}
                                                    onSuccess={(paymentIntentId) => {
                                                        handleFormSubmit(undefined, {
                                                            paymentIntentId,
                                                            propertyAddress: appliedPropertyAddress,
                                                            unitNumber: appliedPropertySuite,
                                                            propertySize: appliedPropertySize,
                                                        });
                                                    }}
                                                    onCancel={() => setOpenAccordion('booking')}
                                                />
                                            </Elements>
                                        </div>
                                    )}
                                    {needsPayment && !clientSecret && !paymentIntentError && (
                                        <p className="book-addons-subtitle">Initializing payment...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {showPartnerCodePopup && (
                <div className="book-partner-popup-overlay" onClick={closePartnerCodePopup}>
                    <div className="book-partner-popup" onClick={(e) => e.stopPropagation()}>
                        <h3 className="book-partner-popup-title">Partner Code</h3>
                        <input
                            type="text"
                            className="book-partner-popup-input"
                            placeholder="Enter partner code"
                            value={partnerCodePopupInput}
                            onChange={(e) => {
                                setPartnerCodePopupInput(e.target.value);
                                setPartnerCodePopupError('');
                            }}
                            autoComplete="off"
                        />
                        {partnerCodePopupError && (
                            <p className="book-partner-popup-error" role="alert">{partnerCodePopupError}</p>
                        )}
                        <div className="book-partner-popup-actions">
                            <button type="button" className="book-partner-popup-apply" onClick={handleApplyPartnerCodeFromPopup}>
                                Apply
                            </button>
                            <button type="button" className="book-partner-popup-close" onClick={closePartnerCodePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .book-mobile-page {
                    min-height: 100vh;
                    background: #272C30;
                    color: #fff;
                    padding: 20px;
                    padding-bottom: 40px;
                    font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .book-logo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                }

                .book-logo-img {
                    max-width: 210px;
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .book-contact-line {
                    text-align: center;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                }

                .book-contact-line a {
                    color: rgba(255, 255, 255, 0.9);
                    text-decoration: none;
                }

                .book-contact-line a:hover {
                    text-decoration: underline;
                }

                .book-contact-sep {
                    color: rgba(255, 255, 255, 0.5);
                }

                .book-social-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    padding: 10px 0 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }

                .book-social-link {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.7);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .book-social-link:hover {
                    background: rgba(255, 255, 255, 0.35);
                    border-color: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transform: translateY(-2px);
                }

                .book-content {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .book-success-wrap {
                    padding: 40px 20px;
                    min-height: 50vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .book-success-box {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 16px;
                    padding: 32px 24px;
                    max-width: 420px;
                    width: 100%;
                    text-align: center;
                }

                .book-success-title {
                    color: #fff;
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }

                .book-success-text {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 15px;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }

                .book-title {
                    font-size: 28px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 10px;
                    color: #fff;
                }

                .book-subtitle {
                    font-size: 16px;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 30px;
                }

                .book-categories {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .book-category-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 30px 24px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    color: #fff;
                    text-decoration: none;
                    display: block;
                }

                .book-category-card:active {
                    transform: scale(0.98);
                }

                .book-category-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                .book-category-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    font-size: 28px;
                }

                .book-category-title {
                    font-size: 22px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #fff;
                }

                .book-category-desc {
                    font-size: 15px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.5;
                    margin-bottom: 16px;
                }

                .book-category-arrow {
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .book-packages-header {
                    margin-bottom: 30px;
                }

                .book-back-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .book-back-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .book-step1-wrap {
                    margin-bottom: 28px;
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                }

                .book-step1-title {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .book-step1-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .book-step1-row {
                    display: flex;
                    flex-direction: row;
                    gap: 16px;
                }

                .book-step1-row .book-form-group {
                    flex: 1;
                    min-width: 0;
                }

                .book-step1-fields .book-form-group label {
                    display: block;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                    margin-bottom: 6px;
                }

                .book-step1-input {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #fff;
                    font-size: 15px;
                }

                .book-step1-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .book-enter-manually-link {
                    display: inline-block;
                    margin-top: 8px;
                    padding: 0;
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 13px;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .book-enter-manually-link:hover {
                    color: #fff;
                }

                .book-select-packages-btn {
                    width: 100%;
                    padding: 14px 20px;
                    background: #fff;
                    color: #000;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .book-select-packages-btn:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-1px);
                }

                .book-select-packages-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .book-packages-property-summary {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 16px 18px;
                    margin-bottom: 20px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 12px;
                }

                .book-packages-property-details {
                    flex: 1;
                    min-width: 0;
                }

                .book-packages-property-details p {
                    margin: 0;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                    line-height: 1.5;
                }

                .book-packages-property-details p + p {
                    margin-top: 6px;
                }

                .book-packages-property-address {
                    font-weight: 500;
                }

                .book-packages-edit-property-btn {
                    flex-shrink: 0;
                    padding: 8px 14px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    color: #fff;
                    border-radius: 8px;
                    font-size: 13px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                }

                .book-packages-edit-property-btn:hover {
                    background: rgba(255, 255, 255, 0.18);
                }

                .book-packages {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .book-package-card {
                    display: flex;
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 28px 24px;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .book-package-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .book-package-selected {
                    background: #dee0e2 !important;
                    border: 2px solid #dee0e2 !important;
                    box-shadow: 0 4px 16px rgba(222, 224, 226, 0.3);
                }

                .book-package-selected .book-package-name,
                .book-package-selected .book-package-price,
                .book-package-selected .book-package-desc,
                .book-package-selected .book-package-contact-price {
                    color: #1a1a1a !important;
                }

                .book-package-selected .book-package-services li {
                    color: #2a2a2a !important;
                }

                .book-package-selected .book-package-services li::before {
                    color: #1a1a1a !important;
                }

                .book-package-popular {
                    border-color: rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.08);
                }

                .book-package-badge {
                    position: absolute;
                    top: -12px;
                    right: 24px;
                    background: #fff;
                    color: #000;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .book-package-name {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #fff;
                }

                .book-package-price {
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #fff;
                }

                .book-package-contact-price {
                    font-size: 24px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }

                .book-package-desc {
                    font-size: 15px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 20px;
                    line-height: 1.5;
                }

                .book-package-services {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 24px 0;
                }

                .book-package-services li {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                    padding: 8px 0;
                    padding-left: 24px;
                    position: relative;
                    line-height: 1.5;
                }

                .book-package-services li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 600;
                }

                .book-package-btn {
                    display: block;
                    width: 100%;
                    background: #fff;
                    color: #000;
                    text-align: center;
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .book-package-btn:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-1px);
                }

                .book-package-selected-badge {
                    position: absolute;
                    top: -12px;
                    left: 24px;
                    background: #4CAF50;
                    color: #fff;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .book-package-btn-placeholder {
                    display: block;
                    width: 100%;
                    margin-top: auto;
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    pointer-events: none;
                }

                .book-package-select-btn {
                    pointer-events: auto;
                    cursor: pointer;
                    border: none;
                    font: inherit;
                }

                .book-package-select-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .book-package-selected .book-package-btn-placeholder {
                    background: rgba(26, 26, 26, 0.1);
                    color: #1a1a1a !important;
                }

                .book-property-size-row {
                    display: flex;
                    align-items: stretch;
                    gap: 10px;
                    margin-bottom: 20px;
                    padding: 0;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                }

                .book-property-size-input {
                    flex: 0 0 70%;
                    width: 70%;
                    height: 40px;
                    min-height: 40px;
                    background: rgba(255, 255, 255, 0.06);
                    border: none;
                    color: #fff;
                    padding: 0 14px;
                    font-size: 13px;
                }

                .book-property-size-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .book-property-size-apply-btn {
                    flex: 0 0 30%;
                    width: 30%;
                    height: 40px;
                    min-height: 40px;
                    padding: 0 16px;
                    border-radius: 0;
                    border: none;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 13px;
                    font-weight: 600;
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                    cursor: pointer;
                }

                .book-property-size-apply-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                }

                .book-partner-code-row {
                    display: flex;
                    align-items: stretch;
                    gap: 0;
                    padding: 0;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    position: relative;
                }
                .book-partner-code-row .book-partner-input {
                    flex: 0 0 70%;
                    width: 70%;
                    height: 40px;
                    min-height: 40px;
                    background: rgba(255, 255, 255, 0.06);
                    border: none;
                    color: #fff;
                    padding: 0 14px;
                    font-size: 13px;
                }
                .book-partner-code-row .book-partner-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }
                .book-partner-code-row .book-partner-apply-btn {
                    flex: 0 0 30%;
                    width: 30%;
                    height: 40px;
                    min-height: 40px;
                    padding: 0 16px;
                    border-radius: 0;
                    border: none;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 13px;
                    font-weight: 600;
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                    cursor: pointer;
                }
                .book-partner-code-row .book-partner-apply-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
                .book-partner-applied-code {
                    flex: 0 0 70%;
                    width: 70%;
                    height: 40px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    padding: 0 14px;
                    font-size: 13px;
                    color: #fff;
                    background: rgba(255, 255, 255, 0.06);
                }
                .book-partner-remove-btn {
                    flex: 0 0 30%;
                    width: 30%;
                    height: 40px;
                    min-height: 40px;
                    padding: 0;
                    border: none;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 14px;
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                    cursor: pointer;
                }
                .book-partner-remove-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
                .book-partner-code-wrap {
                    margin-bottom: 20px;
                }
                .book-partner-error-wrap {
                    margin-top: 6px;
                }

                .book-accordion {
                    margin-bottom: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .book-accordion-header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                }

                .book-accordion-header-packages {
                    cursor: default;
                    gap: 12px;
                }

                .book-accordion-header-toggle {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0;
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    text-align: left;
                }

                .book-accordion-partner-badge {
                    font-size: 12px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.85);
                    margin-left: 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.35);
                    border-radius: 999px;
                }

                .book-accordion-partner-remove {
                    padding: 2px 4px;
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                }

                .book-accordion-partner-remove:hover {
                    color: #fff;
                }

                .book-accordion-partner-btn {
                    flex-shrink: 0;
                    padding: 8px 14px;
                    background: rgba(255, 255, 255, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    color: #fff;
                    border-radius: 8px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .book-accordion-partner-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .book-accordion-chevron-btn {
                    flex-shrink: 0;
                    padding: 8px;
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .book-accordion-chevron-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 6px;
                }

                .book-accordion-header:hover:not(.disabled) {
                    background: rgba(255, 255, 255, 0.08);
                }

                .book-accordion-header.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .book-accordion-header.open {
                    background: rgba(255, 255, 255, 0.1);
                }

                .book-accordion-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                }

                .book-accordion-disabled-text {
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.5);
                    margin-left: 8px;
                }

                .book-partner-popup-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .book-partner-popup {
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 16px;
                    padding: 24px;
                    max-width: 360px;
                    width: 100%;
                }

                .book-partner-popup-title {
                    margin: 0 0 16px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                }

                .book-partner-popup-input {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.06);
                    color: #fff;
                    font-size: 15px;
                    margin-bottom: 12px;
                }

                .book-partner-popup-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .book-partner-popup-error {
                    margin: 0 0 12px;
                    font-size: 13px;
                    color: #f87171;
                }

                .book-partner-popup-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 16px;
                }

                .book-partner-popup-apply {
                    flex: 1;
                    padding: 12px 16px;
                    background: #fff;
                    color: #000;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .book-partner-popup-apply:hover {
                    background: rgba(255, 255, 255, 0.9);
                }

                .book-partner-popup-close {
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    font-size: 15px;
                    cursor: pointer;
                }

                .book-partner-popup-close:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .book-accordion-content {
                    padding: 20px;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .book-addons-subtitle {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 24px;
                    text-align: center;
                }

                .book-addons-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .book-addons-continue-btn {
                    width: 100%;
                    margin-top: 24px;
                    padding: 14px 20px;
                    background: #fff;
                    color: #000;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .book-addons-continue-btn:hover {
                    background: rgba(255, 255, 255, 0.9);
                }

                .book-addon-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .book-addon-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .book-addon-selected {
                    background: #dee0e2 !important;
                    border-color: #dee0e2 !important;
                }

                .book-addon-selected .book-addon-name,
                .book-addon-selected .book-addon-price {
                    color: #1a1a1a !important;
                }

                .book-addon-selected .book-addon-desc {
                    color: #3a3a3a !important;
                }

                .book-addon-selected .book-addon-comment {
                    color: #5a5a5a !important;
                }

                .book-addon-content {
                    width: 100%;
                }

                .book-addon-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }

                .book-addon-desc {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .book-addon-price {
                    font-size: 14px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 2px;
                }

                .book-addon-comment {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                    margin-top: 2px;
                    line-height: 1.2;
                }


                .book-contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .book-form-row-two {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .book-form-row-two .book-form-group {
                    flex: 1;
                    min-width: 140px;
                }
                .book-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .book-form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }

                .book-form-group input,
                .book-form-group textarea {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 12px 16px;
                    color: #fff;
                    font-size: 16px;
                    font-family: var(--font-inter), sans-serif;
                    transition: all 0.3s ease;
                }

                .book-form-group input::placeholder,
                .book-form-group textarea::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .book-form-group input:focus,
                .book-form-group textarea:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.4);
                    background: rgba(255, 255, 255, 0.15);
                }

                .book-virtual-staging-count {
                    margin-bottom: 20px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .book-virtual-staging-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 12px;
                }

                .book-virtual-staging-controls {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }

                .book-virtual-staging-btn {
                    width: 36px;
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .book-virtual-staging-btn:hover {
                    background: rgba(255, 255, 255, 0.18);
                }

                .book-virtual-staging-number {
                    min-width: 28px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                }

                .book-virtual-staging-hint {
                    display: block;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 8px;
                }

                .book-virtual-staging-count-inline {
                    margin-top: 12px;
                    margin-bottom: 12px;
                }

                .book-payment-stripe-wrap {
                    padding: 16px 0;
                }

                .book-form-breakup {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .book-form-breakup-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                }

                .book-form-breakup-item span:first-child {
                    color: rgba(255, 255, 255, 0.75);
                }

                .book-form-breakup-tax {
                    margin-top: 4px;
                }

                .book-form-breakup-total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                    padding-top: 8px;
                    margin-top: 4px;
                    border-top: 1px solid rgba(255, 255, 255, 0.15);
                }

                .book-form-summary {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .book-form-summary-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .book-form-summary-item span:first-child {
                    color: rgba(255, 255, 255, 0.6);
                }

                .book-form-actions {
                    display: flex;
                    gap: 12px;
                }

                .book-form-submit-btn {
                    flex: 1;
                    background: #fff;
                    border: none;
                    color: #000;
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .book-form-submit-btn:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-1px);
                }

                /* Tablet and Desktop */
                @media (min-width: 768px) {
                    .book-mobile-page {
                        padding: 40px;
                    }

                    .book-logo-container {
                        padding: 20px 0 16px;
                    }

                    .book-title {
                        font-size: 36px;
                    }

                    .book-subtitle {
                        font-size: 18px;
                    }

                    .book-categories {
                        flex-direction: row;
                        gap: 24px;
                    }

                    .book-category-card {
                        flex: 1;
                    }

                    .book-packages {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 24px;
                    }
                }

                @media (min-width: 1024px) {
                    .book-content {
                        max-width: 900px;
                    }

                    .book-packages {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
