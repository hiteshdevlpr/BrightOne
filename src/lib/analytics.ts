// Google Analytics utility functions for tracking form interactions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
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
