import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';

// POST /api/contact - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
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

    // Validate message length
    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 2000 characters allowed.' },
        { status: 400 }
      );
    }

    // Create contact message in database
    const message = await db.createContactMessage({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      subject: body.subject.trim(),
      message: body.message.trim(),
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Contact message submitted successfully',
        contact: {
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          status: message.status,
          createdAt: message.created_at,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact message creation error:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
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

// GET /api/contact - Get all contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd check for admin authentication here
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let messages;
    if (status) {
      // Filter by status if provided
      messages = await query(
        'SELECT * FROM contact_messages WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [status, limit, offset]
      );
    } else {
      messages = await db.getContactMessages(limit, offset);
    }

    return NextResponse.json({
      success: true,
      messages: Array.isArray(messages) ? messages : messages.rows,
      pagination: {
        limit,
        offset,
        hasMore: (Array.isArray(messages) ? messages : messages.rows).length === limit,
      },
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contact messages' },
      { status: 500 }
    );
  }
}
