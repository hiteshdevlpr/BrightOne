// Updated booking form handler with API integration and email notifications
import { submitBooking } from '@/lib/booking-api';
import { validateBookingForm } from '@/lib/validation';
import { EmailService, BookingEmailData } from '@/lib/email-service';
import { trackBookingCompletion, trackFormSubmission } from '@/lib/analytics';

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  propertyAddress: string;
  unitNumber?: string;
  propertySize?: string;
  budget?: string;
  timeline?: string;
  serviceTier?: string;
  selectedPackage?: string;
  selectedAddOns?: string[];
  virtualStagingPhotos?: number;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  packageType?: string;
  totalPrice?: string;
}

export async function handleBookingSubmission(
  formData: BookingFormData,
  setIsSubmitting: (value: boolean) => void,
  setIsSubmitted: (value: boolean) => void,
  setErrors: (errors: string[]) => void,
  startTime?: number
) {
  // Validate form data
  const validationErrors = validateBookingForm(formData);
  
  if (validationErrors.length > 0) {
    setErrors(validationErrors.map(error => error.message));
    // Track validation errors
    trackFormSubmission('booking', false);
    return;
  }

  setIsSubmitting(true);
  setErrors([]);

  try {
    // Submit booking to database
    const response = await submitBooking(formData);
    
    if (response.success) {
      // Send email notifications
      const emailData: BookingEmailData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone || 'Not provided',
        serviceType: formData.serviceType,
        propertyAddress: formData.propertyAddress,
        preferredDate: formData.preferredDate || 'Not specified',
        preferredTime: formData.preferredTime || 'Not specified',
        message: formData.message || '',
        packageType: formData.packageType || formData.serviceTier || 'Standard',
        totalPrice: formData.totalPrice || 'To be determined',
        selectedAddOns: formData.selectedAddOns || [],
      };

      // Send emails in parallel (don't wait for them to complete)
      Promise.all([
        EmailService.sendBookingConfirmationToCustomer(emailData),
        EmailService.sendBookingNotificationToAdmin(emailData)
      ]).then(([customerEmailSent, adminEmailSent]) => {
        console.log('Email notifications:', {
          customerEmailSent,
          adminEmailSent
        });
      }).catch((emailError) => {
        console.error('Email sending failed:', emailError);
        // Don't fail the booking submission if emails fail
      });

      setIsSubmitted(true);
      
      // Track successful booking completion
      const completionTime = startTime ? Date.now() - startTime : 0;
      const totalPrice = parseFloat(formData.totalPrice || '0');
      const addOnsCount = formData.selectedAddOns?.length || 0;
      
      trackBookingCompletion(
        totalPrice,
        formData.serviceTier || formData.selectedPackage || 'unknown',
        addOnsCount,
        completionTime
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

// Example usage in your booking form component:
/*
import { handleBookingSubmission } from './booking-form-handler';

const [errors, setErrors] = useState<string[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  await handleBookingSubmission(
    formData,
    setIsSubmitting,
    setIsSubmitted,
    setErrors
  );
};

// Display errors in your form:
{errors.length > 0 && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    <ul className="list-disc list-inside">
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </div>
)}
*/
