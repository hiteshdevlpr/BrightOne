// Updated booking form handler with API integration
import { submitBooking } from '@/lib/booking-api';
import { validateBookingForm } from '@/lib/validation';

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  propertyAddress: string;
  propertyType?: string;
  propertySize?: string;
  budget?: string;
  timeline?: string;
  serviceTier?: string;
  message?: string;
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
    return;
  }

  setIsSubmitting(true);
  setErrors([]);

  try {
    const response = await submitBooking(formData);
    
    if (response.success) {
      setIsSubmitted(true);
    } else {
      setErrors([response.error || 'Failed to submit booking']);
    }
  } catch (error) {
    console.error('Booking submission error:', error);
    setErrors([error instanceof Error ? error.message : 'Failed to submit booking. Please try again.']);
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
