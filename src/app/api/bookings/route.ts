import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';
import { handleBookingSubmissionServer } from '@/lib/server-form-handlers';

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'serviceType', 'propertyAddress'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (if provided)
    if (body.phone && body.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(body.phone.replace(/[\s\-\(\)]/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
    }

    // Use server-side form handler to handle submission and emails
    const result = await handleBookingSubmissionServer({
      name: body.name,
      email: body.email,
      phone: body.phone,
      serviceType: body.serviceType,
      propertyAddress: body.propertyAddress,
      propertyType: body.propertyType,
      propertySize: body.propertySize,
      budget: body.budget,
      timeline: body.timeline,
      serviceTier: body.serviceTier,
      message: body.message,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      packageType: body.packageType,
      totalPrice: body.totalPrice,
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