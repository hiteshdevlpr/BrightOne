'use client';

import React, { useState } from "react";
import Link from "next/link";
import { getPackages, getAdjustedPackagePrice, PROPERTY_SIZE_CONFIGS, PropertySize, ADD_ONS, AddOn } from "@/data/booking-data";
import { getPersonalPackages } from "@/data/personal-branding-data";

type ServiceCategory = 'personal' | 'listing' | null;

export default function BookClient() {
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(null);
    const [selectedPropertySize, setSelectedPropertySize] = useState<PropertySize | null>(null);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const toggleAccordion = (accordionId: string) => {
        setOpenAccordion(prev => prev === accordionId ? null : accordionId);
    };

    const canCompleteBooking = selectedPackageId !== null || selectedAddOns.length > 0;
    
    const realEstatePackages = getPackages();
    const personalPackages = getPersonalPackages();

    const calculatePrice = (basePrice: number) => {
        if (!selectedPropertySize || selectedCategory !== 'listing') {
            return basePrice;
        }
        // For xlarge (5000+), return null to show "Contact for Price"
        if (selectedPropertySize === 'xlarge') {
            return null;
        }
        return getAdjustedPackagePrice(basePrice, selectedPropertySize);
    };

    const handlePackageClick = (pkgId: string) => {
        if (selectedPackageId === pkgId) {
            setSelectedPackageId(null);
        } else {
            setSelectedPackageId(pkgId);
        }
    };

    const handlePropertySizeClick = (size: PropertySize) => {
        setSelectedPropertySize(size);
        // Reset package selection when size changes
        setSelectedPackageId(null);
    };

    const handleAddOnToggle = (addOnId: string) => {
        setSelectedAddOns(prev => {
            if (prev.includes(addOnId)) {
                return prev.filter(id => id !== addOnId);
            } else {
                return [...prev, addOnId];
            }
        });
    };


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission - redirect to booking page with all data
        const params = new URLSearchParams({
            package: selectedPackageId || '',
            ...(selectedPropertySize && { size: selectedPropertySize }),
            ...(selectedAddOns.length > 0 && { addons: selectedAddOns.join(',') }),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            ...(formData.message && { message: formData.message })
        });
        window.location.href = `/booking/${selectedCategory === 'personal' ? 'personal' : 'real-estate'}?${params.toString()}`;
    };

    const handleCategoryClick = (category: ServiceCategory) => {
        setSelectedCategory(category);
    };

    const handleBack = () => {
        setSelectedCategory(null);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
        }).format(price);
    };

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
                    href="https://youtube.com/@brightoneca" 
                    target="_blank"
                    className="book-social-link"
                    aria-label="YouTube"
                >
                    <i className="fa-brands fa-youtube"></i>
                </Link>
            </div>

            {/* Content */}
            <div className="book-content">
                {!selectedCategory ? (
                    <>
                        {/* Service Categories */}
                        <h1 className="book-title">Choose Your Service</h1>
                        <p className="book-subtitle">Select a category to view packages</p>
                        
                        <div className="book-categories">
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

                        {/* Property Size Selection - Only for Real Estate */}
                        {selectedCategory === 'listing' && (
                            <div className="book-property-size-container">
                                <p className="book-property-size-label">Select Property Size:</p>
                                <div className="book-property-size-buttons">
                                    {PROPERTY_SIZE_CONFIGS.map((config) => (
                                        <button
                                            key={config.id}
                                            onClick={() => handlePropertySizeClick(config.id)}
                                            className={`book-property-size-btn ${selectedPropertySize === config.id ? 'active' : ''}`}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accordion 1: Packages */}
                        <div className="book-accordion">
                            <button
                                onClick={() => toggleAccordion('packages')}
                                className={`book-accordion-header ${openAccordion === 'packages' ? 'open' : ''}`}
                            >
                                <span className="book-accordion-title">1. Packages</span>
                                <i className={`fa-solid fa-chevron-${openAccordion === 'packages' ? 'up' : 'down'}`}></i>
                            </button>
                            {openAccordion === 'packages' && (
                                <div className="book-accordion-content">
                                    <div className="book-packages">
                                        {(selectedCategory === 'personal' ? personalPackages : realEstatePackages).map((pkg) => {
                                            const calculatedPrice = calculatePrice(pkg.basePrice);
                                            const isSelected = selectedPackageId === pkg.id;
                                            const showContactPrice = selectedCategory === 'listing' && selectedPropertySize === 'xlarge';
                                            
                                            return (
                                                <div 
                                                    key={pkg.id} 
                                                    onClick={() => selectedCategory === 'listing' && handlePackageClick(pkg.id)}
                                                    className={`book-package-card ${pkg.popular ? 'book-package-popular' : ''} ${isSelected ? 'book-package-selected' : ''} ${selectedCategory === 'listing' ? 'book-package-clickable' : ''}`}
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
                                                        ) : (
                                                            formatPrice(calculatedPrice || pkg.basePrice)
                                                        )}
                                                    </div>
                                                    <p className="book-package-desc">{pkg.description}</p>
                                                    <ul className="book-package-services">
                                                        {pkg.services.map((service, idx) => (
                                                            <li key={idx}>{service}</li>
                                                        ))}
                                                    </ul>
                                                    {selectedCategory === 'listing' ? (
                                                        <div className="book-package-btn-placeholder">
                                                            {isSelected ? 'Package Selected' : 'Click to Select'}
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            href={`/booking/personal?package=${pkg.id}`}
                                                            className="book-package-btn"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Select Package
                                                        </Link>
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
                            <div className="book-accordion">
                                <button
                                    onClick={() => toggleAccordion('addons')}
                                    className={`book-accordion-header ${openAccordion === 'addons' ? 'open' : ''}`}
                                >
                                    <span className="book-accordion-title">2. Standalone Services or Add-ons</span>
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'addons' ? 'up' : 'down'}`}></i>
                                </button>
                                {openAccordion === 'addons' && (
                                    <div className="book-accordion-content">
                                        <p className="book-addons-subtitle">Enhance your package with additional services</p>
                                        <div className="book-addons-grid">
                                            {ADD_ONS.map((addon) => {
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
                                                            <div className="book-addon-price">{formatPrice(addon.price)}</div>
                                                            {addon.comments && (
                                                                <p className="book-addon-comment">{addon.comments}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Accordion 3: Complete your Booking */}
                        <div className="book-accordion">
                            <button
                                onClick={() => canCompleteBooking && toggleAccordion('booking')}
                                disabled={!canCompleteBooking}
                                className={`book-accordion-header ${openAccordion === 'booking' ? 'open' : ''} ${!canCompleteBooking ? 'disabled' : ''}`}
                            >
                                <span className="book-accordion-title">
                                    3. Complete your Booking
                                    {!canCompleteBooking && <span className="book-accordion-disabled-text"> (Select a package or add-on first)</span>}
                                </span>
                                {canCompleteBooking && (
                                    <i className={`fa-solid fa-chevron-${openAccordion === 'booking' ? 'up' : 'down'}`}></i>
                                )}
                            </button>
                            {openAccordion === 'booking' && canCompleteBooking && (
                                <div className="book-accordion-content">
                                    <form onSubmit={handleFormSubmit} className="book-contact-form">
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
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div className="book-form-group">
                                            <label htmlFor="phone">Phone *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                required
                                                placeholder="(416) 123-4567"
                                            />
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
                                            {selectedPackageId && (
                                                <div className="book-form-summary-item">
                                                    <span>Selected Package:</span>
                                                    <span>{(selectedCategory === 'personal' ? personalPackages : realEstatePackages).find(p => p.id === selectedPackageId)?.name}</span>
                                                </div>
                                            )}
                                            {selectedCategory === 'listing' && selectedPropertySize && (
                                                <div className="book-form-summary-item">
                                                    <span>Property Size:</span>
                                                    <span>{PROPERTY_SIZE_CONFIGS.find(c => c.id === selectedPropertySize)?.label}</span>
                                                </div>
                                            )}
                                            {selectedAddOns.length > 0 && (
                                                <div className="book-form-summary-item">
                                                    <span>Add-ons:</span>
                                                    <span>{selectedAddOns.length} selected</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="book-form-actions">
                                            <button
                                                type="submit"
                                                className="book-form-submit-btn"
                                            >
                                                Submit Booking Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .book-mobile-page {
                    min-height: 100vh;
                    background: #000;
                    color: #fff;
                    padding: 20px;
                    padding-bottom: 40px;
                    font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .book-logo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 30px 0 20px;
                }

                .book-logo-img {
                    max-width: 210px;
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .book-social-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    padding: 20px 0 30px;
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
                    background: rgba(255, 255, 255, 0.4);
                    color: #fff;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .book-social-link:hover {
                    background: rgba(255, 255, 255, 0.5);
                    border-color: rgba(255, 255, 255, 0.7);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transform: translateY(-2px);
                }

                .book-content {
                    max-width: 600px;
                    margin: 0 auto;
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

                .book-packages {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .book-package-card {
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

                .book-package-clickable {
                    cursor: pointer;
                }

                .book-package-clickable:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
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
                    font-style: italic;
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
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    pointer-events: none;
                }

                .book-package-selected .book-package-btn-placeholder {
                    background: rgba(26, 26, 26, 0.1);
                    color: #1a1a1a !important;
                }

                .book-property-size-container {
                    margin-bottom: 30px;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .book-property-size-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 10px;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .book-property-size-buttons {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .book-property-size-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 8px 12px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .book-property-size-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .book-property-size-btn.active {
                    background: rgba(255, 255, 255, 0.25);
                    border-color: rgba(255, 255, 255, 0.5);
                    color: rgba(255, 255, 255, 0.95);
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

                @media (min-width: 768px) {
                    .book-property-size-buttons {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                /* Tablet and Desktop */
                @media (min-width: 768px) {
                    .book-mobile-page {
                        padding: 40px;
                    }

                    .book-logo-container {
                        padding: 40px 0 30px;
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
