import { submitBooking } from '@/lib/booking-api';
import { validateBookingForm } from '@/lib/validation';
import { trackFormSubmission, trackBookingCompletion } from '@/lib/analytics';

export interface BookingFormData {
    name: string;
    email: string;
    phone?: string;
    serviceType: string;
    propertyAddress: string;
    unitNumber?: string;
    propertySize?: string;
    serviceTier?: string;
    selectedPackage?: string;
    selectedAddOns?: string[];
    message?: string;
    preferredDate?: string;
    preferredTime?: string;
    totalPrice?: string;
    recaptchaToken?: string;
    website_url?: string;
}

export async function handleBookingSubmission(
    formData: BookingFormData,
    setIsSubmitting: (value: boolean) => void,
    setIsSubmitted: (value: boolean) => void,
    setErrors: (errors: string[]) => void
) {
    // Validate form data
    const validationErrors = validateBookingForm(formData);

    if (validationErrors.length > 0) {
        setErrors(validationErrors.map(error => error.message));
        trackFormSubmission('booking', false);
        return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
        const response = await submitBooking(formData);

        if (response.success) {
            setIsSubmitted(true);

            const totalPrice = parseFloat(formData.totalPrice || '0');
            const addOnsCount = formData.selectedAddOns?.length || 0;

            trackBookingCompletion(
                totalPrice,
                formData.serviceTier || formData.selectedPackage || 'unknown',
                addOnsCount
            );
        } else {
            setErrors([response.error || 'Failed to submit booking']);
            trackFormSubmission('booking', false);
        }
    } catch (error) {
        console.error('Booking submission error:', error);
        setErrors([error instanceof Error ? error.message : 'Failed to submit booking. Please try again.']);
        trackFormSubmission('booking', false);
    } finally {
        setIsSubmitting(false);
    }
}
