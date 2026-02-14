import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';
import { requireAdminKey } from '@/lib/admin-auth';

// GET /api/bookings/[id] - Get a specific booking (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdminKey(request);
    if (authError) return authError;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const booking = await db.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve booking' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdminKey(request);
    if (authError) return authError;
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db.getBookingById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking status
    const updatedBooking = await db.updateBookingStatus(id, body.status);

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete a booking (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdminKey(request);
    if (authError) return authError;

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db.getBookingById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    await query('DELETE FROM bookings WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
