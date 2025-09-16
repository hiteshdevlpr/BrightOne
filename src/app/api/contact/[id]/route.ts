import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/database';

// GET /api/contact/[id] - Get a specific contact message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact message ID is required' },
        { status: 400 }
      );
    }

    const message = await query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (!message.rows[0]) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: message.rows[0],
    });

  } catch (error) {
    console.error('Get contact message error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contact message' },
      { status: 500 }
    );
  }
}

// PUT /api/contact/[id] - Update contact message status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Contact message ID is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if message exists
    const existingMessage = await query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (!existingMessage.rows[0]) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    // Update message status
    const updatedMessage = await db.updateContactMessageStatus(id, body.status);

    return NextResponse.json({
      success: true,
      message: 'Contact message updated successfully',
      contact: updatedMessage,
    });

  } catch (error) {
    console.error('Update contact message error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact message ID is required' },
        { status: 400 }
      );
    }

    // Check if message exists
    const existingMessage = await query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (!existingMessage.rows[0]) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    // Delete message
    await query('DELETE FROM contact_messages WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });

  } catch (error) {
    console.error('Delete contact message error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}
