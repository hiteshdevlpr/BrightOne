// Type definitions for booking logic and state management

export type ServiceCategory = 'personal' | 'listing' | null;

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    message: string;
    [key: string]: string; // For honeypot and other dynamic fields
}

export interface BookingState {
    // Category selection
    selectedCategory: ServiceCategory;
    
    // Property details (for listing)
    propertyAddress: string;
    propertyAddressInput: string;
    appliedPropertyAddress: string;
    propertySuite: string;
    propertySuiteInput: string;
    appliedPropertySuite: string;
    propertySize: string;
    propertySizeInput: string;
    appliedPropertySize: string;
    
    // Package and addons
    selectedPackageId: string | null;
    selectedAddOns: string[];
    virtualStagingPhotoCount: number;
    
    // Partner code
    preferredPartnerCodeInput: string;
    appliedPartnerCode: string;
    partnerCodeError: string;
    showPartnerCodePopup: boolean;
    partnerCodePopupInput: string;
    partnerCodePopupError: string;
    
    // Form state
    formData: BookingFormData;
    isSubmitting: boolean;
    isSubmitted: boolean;
    formErrors: string[];
    fieldErrors: { [key: string]: string };
    
    // UI state
    openAccordion: string | null;
    enterManuallyListing: boolean;
    placesReadyListing: boolean;
}

export interface BookingActions {
    setSelectedCategory: (category: ServiceCategory) => void;
    setPropertyAddressInput: (value: string) => void;
    setAppliedPropertyAddress: (value: string) => void;
    setPropertySuiteInput: (value: string) => void;
    setAppliedPropertySuite: (value: string) => void;
    setPropertySizeInput: (value: string) => void;
    setAppliedPropertySize: (value: string) => void;
    setSelectedPackageId: (id: string | null) => void;
    setSelectedAddOns: (ids: string[] | ((prev: string[]) => string[])) => void;
    setVirtualStagingPhotoCount: (count: number) => void;
    setPreferredPartnerCodeInput: (value: string) => void;
    setAppliedPartnerCode: (value: string) => void;
    setPartnerCodeError: (error: string) => void;
    setShowPartnerCodePopup: (show: boolean) => void;
    setPartnerCodePopupInput: (value: string) => void;
    setPartnerCodePopupError: (error: string) => void;
    setFormData: (data: BookingFormData | ((prev: BookingFormData) => BookingFormData)) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setIsSubmitted: (submitted: boolean) => void;
    setFormErrors: (errors: string[]) => void;
    setFieldErrors: (errors: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void;
    setOpenAccordion: (id: string | null) => void;
    setEnterManuallyListing: (manual: boolean) => void;
    setPlacesReadyListing: (ready: boolean) => void;
}

export interface BookingComputed {
    // Package pricing
    getPackagePrice: (basePrice: number, packageId: string) => number | null;
    
    // Addon pricing
    getAddonPrice: (addonId: string) => number;
    
    // Total calculation
    calculateTotal: () => number;
    
    // Available addons (filtered by package inclusions)
    availableAddOns: any[];
    
    // Included addons for selected package
    includedInSelectedPackage: string[];
    
    // Validation
    canCompleteBooking: boolean;
    step1Filled: boolean;
    
    // Resolved addons (virtual staging expanded)
    resolvedSelectedAddOns: string[];
}

export interface BookingPayload {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    propertyAddress: string;
    unitNumber?: string;
    propertySize?: string;
    serviceTier: string;
    selectedAddOns: string[];
    preferredPartnerCode?: string;
    preferredDate?: string;
    preferredTime?: string;
    message?: string;
    totalPrice: string;
    recaptchaToken: string;
    website_url: string;
}
