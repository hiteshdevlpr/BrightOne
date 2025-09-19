// Email testing utility for development and debugging
import { EmailService, BookingEmailData, ContactEmailData } from './email-service';

/**
 * Test email functionality with sample data
 */
export class EmailTestService {
  /**
   * Test booking confirmation email
   */
  static async testBookingConfirmation(): Promise<void> {
    const sampleBookingData: BookingEmailData = {
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 123-4567',
      serviceType: 'Real Estate Photography',
      propertyAddress: '123 Main Street, Toronto, ON M5V 3A8',
      preferredDate: '2024-01-15',
      preferredTime: '10:00 AM',
      message: 'Please ensure to capture the beautiful garden in the backyard.',
      packageType: 'Premium Package',
      totalPrice: '$299',
    };

    console.log('Testing booking confirmation email...');
    
    try {
      const customerEmailSent = await EmailService.sendBookingConfirmationToCustomer(sampleBookingData);
      const adminEmailSent = await EmailService.sendBookingNotificationToAdmin(sampleBookingData);
      
      console.log('Booking email test results:', {
        customerEmailSent,
        adminEmailSent
      });
    } catch (error) {
      console.error('Booking email test failed:', error);
    }
  }

  /**
   * Test contact confirmation email
   */
  static async testContactConfirmation(): Promise<void> {
    const sampleContactData: ContactEmailData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      subject: 'Inquiry about Virtual Staging Services',
      message: 'I am interested in your virtual staging services for a 3-bedroom condo. Could you please provide more information about pricing and turnaround time?',
    };

    console.log('Testing contact confirmation email...');
    
    try {
      const customerEmailSent = await EmailService.sendContactConfirmationToCustomer(sampleContactData);
      const adminEmailSent = await EmailService.sendContactNotificationToAdmin(sampleContactData);
      
      console.log('Contact email test results:', {
        customerEmailSent,
        adminEmailSent
      });
    } catch (error) {
      console.error('Contact email test failed:', error);
    }
  }

  /**
   * Test all email types
   */
  static async testAllEmails(): Promise<void> {
    console.log('Starting email tests...');
    
    await this.testBookingConfirmation();
    await this.testContactConfirmation();
    
    console.log('Email tests completed!');
  }
}

// Example usage in a test script or API endpoint

// In a test API endpoint (e.g., /api/test-emails)
// import { EmailTestService } from '@/lib/email-test';

export async function GET() {
  try {
    await EmailTestService.testAllEmails();
    return Response.json({ success: true, message: 'Email tests completed' });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

