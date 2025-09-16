// Updated contact form handler with API integration
import { submitContact } from '@/lib/booking-api';
import { validateContactForm } from '@/lib/validation';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function handleContactSubmission(
  formData: ContactFormData,
  setIsSubmitting: (value: boolean) => void,
  setIsSubmitted: (value: boolean) => void,
  setErrors: (errors: string[]) => void
) {
  // Validate form data
  const validationErrors = validateContactForm(formData);
  
  if (validationErrors.length > 0) {
    setErrors(validationErrors.map(error => error.message));
    return;
  }

  setIsSubmitting(true);
  setErrors([]);

  try {
    const response = await submitContact(formData);
    
    if (response.success) {
      setIsSubmitted(true);
    } else {
      setErrors([response.error || 'Failed to submit contact message']);
    }
  } catch (error) {
    console.error('Contact submission error:', error);
    setErrors([error instanceof Error ? error.message : 'Failed to submit contact message. Please try again.']);
  } finally {
    setIsSubmitting(false);
  }
}

// Example usage in your contact form component:
/*
import { handleContactSubmission } from './contact-form-handler';

const [errors, setErrors] = useState<string[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  await handleContactSubmission(
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
