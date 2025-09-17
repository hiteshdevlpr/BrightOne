// Test API endpoint for email functionality
import { NextRequest, NextResponse } from 'next/server';
import { EmailTestService } from '@/lib/email-test';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Email testing is only available in development mode' },
        { status: 403 }
      );
    }

    console.log('Starting email tests...');
    
    // Test booking emails
    await EmailTestService.testBookingConfirmation();
    
    // Test contact emails
    await EmailTestService.testContactConfirmation();
    
    return NextResponse.json({
      success: true,
      message: 'Email tests completed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Email test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Email testing is only available in development mode' },
        { status: 403 }
      );
    }

    switch (testType) {
      case 'booking':
        await EmailTestService.testBookingConfirmation();
        break;
      case 'contact':
        await EmailTestService.testContactConfirmation();
        break;
      case 'all':
        await EmailTestService.testAllEmails();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: booking, contact, or all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${testType} email test completed successfully`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Email test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
