import { NextRequest, NextResponse } from 'next/server';
import { handleContactSubmission } from '../../contact/contact-form-handler';

export async function POST(request: NextRequest) {
  try {
    console.log('APP_LOG:: Testing form handler directly...');
    
    const formData = {
      name: 'Test User',
      email: 'hitesh@brightone.ca',
      phone: '+1 (555) 123-4567',
      subject: 'Test Form Handler',
      message: 'This is a test to verify the form handler is working correctly.',
    };

    let errors: string[] = [];
    let isSubmitting = false;
    let isSubmitted = false;

    console.log('APP_LOG:: Calling handleContactSubmission...');
    await handleContactSubmission(
      formData,
      (value) => { isSubmitting = value; },
      (value) => { isSubmitted = value; },
      (errors) => { errors = errors; }
    );

    console.log('APP_LOG:: Form handler completed:', {
      isSubmitted,
      errors,
      isSubmitting
    });

    return NextResponse.json({
      success: true,
      message: 'Form handler test completed',
      results: {
        isSubmitted,
        errors,
        isSubmitting
      }
    });

  } catch (error) {
    console.error('APP_LOG:: Form handler test failed:', error);
    
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
