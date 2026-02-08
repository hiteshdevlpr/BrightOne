import { submitContact } from '@/lib/booking-api';
import { validateContactForm } from '@/lib/validation';
import { trackFormSubmission } from '@/lib/analytics';

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    recaptchaToken?: string;
    [key: string]: any; // For honeypot field
}

export async function handleContactSubmission(
    formData: ContactFormData,
    setIsSubmitting: (value: boolean) => void,
    setIsSubmitted: (value: boolean) => void,
    setErrors: (errors: string[]) => void
): Promise<boolean> {
    // Validate form data
    const validationErrors = validateContactForm(formData);

    if (validationErrors.length > 0) {
        setErrors(validationErrors.map(error => error.message));
        trackFormSubmission('contact', false);
        return false;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
        const response = await submitContact(formData);

        if (response.success) {
            setIsSubmitted(true);
            trackFormSubmission('contact', true);
            return true;
        } else {
            setErrors([response.error || 'Failed to submit contact form']);
            trackFormSubmission('contact', false);
            return false;
        }
    } catch (error) {
        console.error('Contact submission error:', error);
        setErrors([error instanceof Error ? error.message : 'Failed to submit contact form. Please try again.']);
        trackFormSubmission('contact', false);
        return false;
    } finally {
        setIsSubmitting(false);
    }
}
