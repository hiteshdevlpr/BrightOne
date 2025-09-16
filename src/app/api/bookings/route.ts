import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

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

    // Create booking data object
    const bookingData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      serviceType: body.serviceType,
      propertyAddress: body.propertyAddress.trim(),
      propertyType: body.propertyType || undefined,
      propertySize: body.propertySize || undefined,
      budget: body.budget || undefined,
      timeline: body.timeline || undefined,
      serviceTier: body.serviceTier || undefined,
      message: body.message?.trim() || undefined,
    };

    // Save to database
    const booking = await db.createBooking(bookingData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Booking submitted successfully',
        booking: {
          id: booking.id,
          name: booking.name,
          email: booking.email,
          serviceType: booking.service_type,
          status: booking.status,
          createdAt: booking.created_at,
        },
      },
      { status: 201 }
    );

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
      bookings = await db.query(
        'SELECT * FROM bookings WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [status, limit, offset]
      );
    } else {
      bookings = await db.getBookings(limit, offset);
    }

    return NextResponse.json({
      success: true,
      bookings: bookings.rows || bookings,
      pagination: {
        limit,
        offset,
        hasMore: (bookings.rows || bookings).length === limit,
      },
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
