import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    console.log('APP_LOG:: Testing email service...');
    
    // Test contact email
    const contactEmailData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      subject: 'Test Email from Production',
      message: 'This is a test email to verify SES functionality in production.',
    };

    console.log('APP_LOG:: Sending contact confirmation email...');
    const customerEmailSent = await EmailService.sendContactConfirmationToCustomer(contactEmailData);
    
    console.log('APP_LOG:: Sending contact admin notification...');
    const adminEmailSent = await EmailService.sendContactNotificationToAdmin(contactEmailData);

    console.log('APP_LOG:: Email test results:', {
      customerEmailSent,
      adminEmailSent
    });

    return NextResponse.json({
      success: true,
      message: 'Email test completed',
      results: {
        customerEmailSent,
        adminEmailSent
      }
    });

  } catch (error) {
    console.error('APP_LOG:: Email test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      },
      { status: 500 }
    );
  }
}
