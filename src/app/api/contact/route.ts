import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';
import { handleContactSubmissionServer } from '@/lib/server-form-handlers';
import { verifyRecaptchaToken } from '@/lib/recaptcha';
import { sanitizeContactInput, validateContactForm, HONEYPOT_FIELD } from '@/lib/validation';

const RECAPTCHA_ACTION = 'contact';

// POST /api/contact - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: if filled, pretend success and do not store or email
    const honeypot = body[HONEYPOT_FIELD];
    if (honeypot != null && String(honeypot).trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Contact message submitted successfully' },
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

    const sanitized = sanitizeContactInput(body);

    // Validate required fields and formats
    const validationErrors = validateContactForm(sanitized);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    // Validate message length after sanitization
    if (sanitized.message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 2000 characters allowed.' },
        { status: 400 }
      );
    }

    // Use server-side form handler to handle submission and emails
    const result = await handleContactSubmissionServer({
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone || undefined,
      subject: sanitized.subject,
      message: sanitized.message,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Contact message submitted successfully',
          contact: result.contact,
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
