import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAdminKey } from '@/lib/admin-auth';

// GET /api/admin/dashboard - Get dashboard statistics (requires ADMIN_API_KEY)
export async function GET(request: NextRequest) {
  try {
    const authError = requireAdminKey(request);
    if (authError) return authError;

    // Get booking statistics
    const bookingStats = await query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_bookings
      FROM bookings
    `);

    // Get contact message statistics
    const contactStats = await query(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_messages,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_messages
      FROM contact_messages
    `);

    // Get recent bookings
    const recentBookings = await query(`
      SELECT id, name, email, service_type, status, created_at
      FROM bookings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Get recent contact messages
    const recentMessages = await query(`
      SELECT id, name, email, subject, status, created_at
      FROM contact_messages 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Get service type breakdown
    const serviceBreakdown = await query(`
      SELECT service_type, COUNT(*) as count
      FROM bookings 
      GROUP BY service_type 
      ORDER BY count DESC
    `);

    return NextResponse.json({
      success: true,
      dashboard: {
        bookings: {
          total: parseInt(bookingStats.rows[0].total_bookings),
          pending: parseInt(bookingStats.rows[0].pending_bookings),
          confirmed: parseInt(bookingStats.rows[0].confirmed_bookings),
          completed: parseInt(bookingStats.rows[0].completed_bookings),
          recent: parseInt(bookingStats.rows[0].recent_bookings),
        },
        messages: {
          total: parseInt(contactStats.rows[0].total_messages),
          unread: parseInt(contactStats.rows[0].unread_messages),
          read: parseInt(contactStats.rows[0].read_messages),
          recent: parseInt(contactStats.rows[0].recent_messages),
        },
        recentBookings: recentBookings.rows,
        recentMessages: recentMessages.rows,
        serviceBreakdown: serviceBreakdown.rows,
      },
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard data' },
      { status: 500 }
    );
  }
}
