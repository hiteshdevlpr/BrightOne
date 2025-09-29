// Google Analytics utility functions for tracking form interactions

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Form-specific tracking functions
export const trackFormFieldFocus = (formType: 'booking' | 'contact', fieldName: string) => {
  trackEvent('form_field_focus', 'form_interaction', `${formType}_${fieldName}`);
};

export const trackFormFieldBlur = (formType: 'booking' | 'contact', fieldName: string) => {
  trackEvent('form_field_blur', 'form_interaction', `${formType}_${fieldName}`);
};

export const trackFormFieldChange = (formType: 'booking' | 'contact', fieldName: string, value?: string) => {
  trackEvent('form_field_change', 'form_interaction', `${formType}_${fieldName}`, value?.length || 0);
};

export const trackFormSubmission = (formType: 'booking' | 'contact', success: boolean) => {
  trackEvent('form_submit', 'form_interaction', `${formType}_${success ? 'success' : 'error'}`);
};

export const trackFormValidationError = (formType: 'booking' | 'contact', fieldName: string, errorType: string) => {
  trackEvent('form_validation_error', 'form_interaction', `${formType}_${fieldName}_${errorType}`);
};

export const trackServiceTierSelection = (tierId: string, tierName: string) => {
  trackEvent('service_tier_select', 'booking_interaction', `${tierId}_${tierName}`);
};

export const trackAddressSuggestionClick = (suggestion: string) => {
  trackEvent('address_suggestion_click', 'booking_interaction', suggestion.substring(0, 50));
};

// Enhanced tracking for form completion progress
export const trackFormProgress = (formType: 'booking' | 'contact', completedFields: number, totalFields: number) => {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  trackEvent('form_progress', 'form_interaction', `${formType}_${progressPercentage}%`, progressPercentage);
};

// Booking-specific analytics events
export const trackBookingStepChange = (step: number, direction: 'next' | 'previous') => {
  trackEvent('booking_step_change', 'booking_flow', `step_${step}_${direction}`, step);
};

export const trackPackageSelection = (packageId: string, packageName: string, packagePrice: number) => {
  trackEvent('package_select', 'booking_interaction', `${packageId}_${packageName}`, packagePrice);
};

export const trackAddOnToggle = (addOnId: string, addOnName: string, isSelected: boolean, addOnPrice: number) => {
  trackEvent('addon_toggle', 'booking_interaction', `${addOnId}_${addOnName}_${isSelected ? 'selected' : 'deselected'}`, addOnPrice);
};

export const trackVirtualStagingPhotosChange = (photoCount: number, direction: 'increase' | 'decrease') => {
  trackEvent('virtual_staging_photos_change', 'booking_interaction', `${direction}_to_${photoCount}`, photoCount);
};

export const trackPropertySizeSelection = (propertySize: string, sizeCategory: string) => {
  trackEvent('property_size_select', 'booking_interaction', `${sizeCategory}_${propertySize}`);
};

export const trackBookingCompletion = (totalPrice: number, selectedPackage: string, addOnsCount: number, formCompletionTime: number) => {
  trackEvent('booking_complete', 'conversion', `${selectedPackage}_${addOnsCount}_addons`, totalPrice);
  // Track conversion value for e-commerce
  trackEvent('purchase', 'ecommerce', selectedPackage, totalPrice);
};

export const trackBookingAbandonment = (step: number, formData: any) => {
  trackEvent('booking_abandon', 'booking_flow', `step_${step}`, step);
};

export const trackAddressAutocomplete = (query: string, suggestionCount: number) => {
  trackEvent('address_autocomplete', 'booking_interaction', `query_${query.length}_chars`, suggestionCount);
};

export const trackAddressSelection = (address: string, source: 'autocomplete' | 'manual') => {
  trackEvent('address_select', 'booking_interaction', source, address.length);
};

export const trackAddressAutosuggestSelection = (address: string) => {
  // Track the actual address selected from autosuggest for detailed analysis
  trackEvent('address_autosuggest_select', 'booking_interaction', address.substring(0, 100), address.length);
};

export const trackFormValidationError = (fieldName: string, errorType: string, step: number) => {
  trackEvent('form_validation_error', 'booking_flow', `${fieldName}_${errorType}_step_${step}`, step);
};

export const trackBookingStart = () => {
  trackEvent('booking_start', 'booking_flow', 'user_initiated');
};

export const trackBookingReset = (step: number) => {
  trackEvent('booking_reset', 'booking_flow', `from_step_${step}`, step);
};
