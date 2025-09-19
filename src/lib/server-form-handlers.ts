// Server-side form handlers that call the database directly
import { db } from './database';
import { validateContactForm, validateBookingForm } from './validation';
import { EmailService, ContactEmailData, BookingEmailData } from './email-service';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

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
  preferredDate?: string;
  preferredTime?: string;
  packageType?: string;
  totalPrice?: string;
}

export async function handleContactSubmissionServer(formData: ContactFormData): Promise<{ success: boolean; error?: string; contact?: any }> {
  try {
    console.log('APP_LOG:: Server-side contact form submission started');
    
    // Validate form data
    const validationErrors = validateContactForm(formData);
    
    if (validationErrors.length > 0) {
      console.log('APP_LOG:: Validation errors:', validationErrors);
      return {
        success: false,
        error: validationErrors.map(error => error.message).join(', ')
      };
    }

    console.log('APP_LOG:: Submitting contact message to database');
    
    // Submit contact message to database directly
    const contact = await db.createContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || undefined,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    console.log('APP_LOG:: Contact message submitted to database:', contact.id);

    // Send email notifications
    console.log('APP_LOG:: Sending email notifications');
    const emailData: ContactEmailData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
    };

    console.log('APP_LOG:: Email data:', emailData);

    // Send emails in parallel (don't wait for them to complete)
    Promise.all([
      EmailService.sendContactConfirmationToCustomer(emailData),
      EmailService.sendContactNotificationToAdmin(emailData)
    ]).then(([customerEmailSent, adminEmailSent]) => {
      console.log('APP_LOG:: Email notifications:', {
        customerEmailSent,
        adminEmailSent
      });
    }).catch((emailError) => {
      console.error('APP_LOG:: Email sending failed:', emailError);
      // Don't fail the contact submission if emails fail
    });

    return {
      success: true,
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        status: contact.status,
        createdAt: contact.created_at,
      }
    };

  } catch (error) {
    console.error('APP_LOG:: Contact submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit contact message. Please try again.'
    };
  }
}

export async function handleBookingSubmissionServer(formData: BookingFormData): Promise<{ success: boolean; error?: string; booking?: any }> {
  try {
    console.log('APP_LOG:: Server-side booking form submission started');
    
    // Validate form data
    const validationErrors = validateBookingForm(formData);
    
    if (validationErrors.length > 0) {
      console.log('APP_LOG:: Validation errors:', validationErrors);
      return {
        success: false,
        error: validationErrors.map(error => error.message).join(', ')
      };
    }

    console.log('APP_LOG:: Submitting booking to database');
    
    // Submit booking to database directly
    const booking = await db.createBooking({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || undefined,
      serviceType: formData.serviceType,
      propertyAddress: formData.propertyAddress.trim(),
      propertyType: formData.propertyType || undefined,
      propertySize: formData.propertySize || undefined,
      budget: formData.budget || undefined,
      timeline: formData.timeline || undefined,
      serviceTier: formData.serviceTier || undefined,
      message: formData.message?.trim() || undefined,
    });

    console.log('APP_LOG:: Booking submitted to database:', booking.id);

    // Send email notifications
    console.log('APP_LOG:: Sending email notifications');
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
    };

    console.log('APP_LOG:: Email data:', emailData);

    // Send emails in parallel (don't wait for them to complete)
    Promise.all([
      EmailService.sendBookingConfirmationToCustomer(emailData),
      EmailService.sendBookingNotificationToAdmin(emailData)
    ]).then(([customerEmailSent, adminEmailSent]) => {
      console.log('APP_LOG:: Email notifications:', {
        customerEmailSent,
        adminEmailSent
      });
    }).catch((emailError) => {
      console.error('APP_LOG:: Email sending failed:', emailError);
      // Don't fail the booking submission if emails fail
    });

    return {
      success: true,
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        serviceType: booking.service_type,
        status: booking.status,
        createdAt: booking.created_at,
      }
    };

  } catch (error) {
    console.error('APP_LOG:: Booking submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit booking. Please try again.'
    };
  }
}
