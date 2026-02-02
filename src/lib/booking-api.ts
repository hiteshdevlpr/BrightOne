// API functions for booking form submission

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
  totalPrice?: string;
  message?: string;
  recaptchaToken?: string;
  website_url?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}

export async function submitBooking(formData: BookingFormData): Promise<BookingResponse> {
  try {
    const payload = {
      ...formData,
      recaptchaToken: formData.recaptchaToken ?? '',
      website_url: formData.website_url ?? '',
    };
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit booking');
    }

    return data;
  } catch (error) {
    console.error('Booking submission error:', error);
    throw error;
  }
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
  website_url?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contact?: {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}

export async function submitContact(formData: ContactFormData): Promise<ContactResponse> {
  try {
    const payload = {
      ...formData,
      recaptchaToken: formData.recaptchaToken ?? '',
      website_url: formData.website_url ?? '',
    };
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit contact message');
    }

    return data;
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
}
