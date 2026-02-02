import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';
import { handleBookingSubmissionServer } from '@/lib/server-form-handlers';
import { verifyRecaptchaToken } from '@/lib/recaptcha';
import { sanitizeBookingInput, validateBookingForm, HONEYPOT_FIELD } from '@/lib/validation';

const RECAPTCHA_ACTION = 'booking';

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: if filled, pretend success and do not store or email
    const honeypot = body[HONEYPOT_FIELD];
    if (honeypot != null && String(honeypot).trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Booking request submitted successfully' },
        { status: 201 }
      );
    }

    // reCAPTCHA v3
    const token = body.recaptchaToken;
    const recaptcha = await verifyRecaptchaToken(token, RECAPTCHA_ACTION);
    if (!recaptcha.valid) {
      return NextResponse.json(
        { error: recaptcha.error ?? 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const sanitized = sanitizeBookingInput(body);

    // Validate required fields and formats
    const validationErrors = validateBookingForm(sanitized);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    // Use server-side form handler to handle submission and emails
    const result = await handleBookingSubmissionServer({
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone || undefined,
      serviceType: sanitized.serviceType,
      propertyAddress: sanitized.propertyAddress,
      propertyType: sanitized.propertyType,
      propertySize: sanitized.propertySize,
      budget: sanitized.budget,
      timeline: sanitized.timeline,
      serviceTier: sanitized.serviceTier,
      selectedAddOns: sanitized.selectedAddOns,
      message: sanitized.message,
      preferredDate: sanitized.preferredDate,
      preferredTime: sanitized.preferredTime,
      packageType: sanitized.packageType,
      totalPrice: sanitized.totalPrice,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Booking request submitted successfully',
          booking: result.booking,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Booking creation error:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A booking with this email already exists' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get all bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd check for admin authentication here
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let bookings;
    if (status) {
      // Filter by status if provided
      bookings = await query(
        'SELECT * FROM bookings WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [status, limit, offset]
      );
    } else {
      bookings = await db.getBookings(limit, offset);
    }

    return NextResponse.json({
      success: true,
      bookings: Array.isArray(bookings) ? bookings : bookings.rows,
      pagination: {
        limit,
        offset,
        hasMore: (Array.isArray(bookings) ? bookings : bookings.rows).length === limit,
      },
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    );
  }
}