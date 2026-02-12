import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import { query } from '@/lib/database';
import type { UpdatePartnerCodeRequest } from '@/types/services';

// GET /api/admin/services/partner-codes/:id - Get partner code details (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const result = await query('SELECT * FROM partner_codes WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Partner code not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            partnerCode: result.rows[0],
        });
    } catch (error) {
        console.error('Get partner code error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve partner code' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/services/partner-codes/:id - Update partner code (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const body: UpdatePartnerCodeRequest = await request.json();

        const { updatePartnerCode } = await import('@/lib/services-db');
        const partnerCode = await updatePartnerCode({ ...body, id });

        return NextResponse.json({
            success: true,
            partnerCode,
        });
    } catch (error: any) {
        console.error('Update partner code error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Partner code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update partner code' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/services/partner-codes/:id - Delete partner code (admin, soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const { deletePartnerCode } = await import('@/lib/services-db');
        await deletePartnerCode(id);

        return NextResponse.json({
            success: true,
            message: 'Partner code deleted successfully',
        });
    } catch (error) {
        console.error('Delete partner code error:', error);
        return NextResponse.json(
            { error: 'Failed to delete partner code' },
            { status: 500 }
        );
    }
}
