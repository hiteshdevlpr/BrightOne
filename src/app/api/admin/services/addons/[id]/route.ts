import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getAddonById,
    updateAddon,
    deleteAddon,
} from '@/lib/services-db';
import type { UpdateAddonRequest } from '@/types/services';

// GET /api/admin/services/addons/:id - Get addon details (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const addon = await getAddonById(id);

        if (!addon) {
            return NextResponse.json(
                { error: 'Addon not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            addon,
        });
    } catch (error) {
        console.error('Get addon error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve addon' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/services/addons/:id - Update addon (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const body: UpdateAddonRequest = await request.json();

        const addon = await updateAddon({ ...body, id });

        return NextResponse.json({
            success: true,
            addon,
        });
    } catch (error: any) {
        console.error('Update addon error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Addon with this code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update addon' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/services/addons/:id - Delete addon (admin, soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        await deleteAddon(id);

        return NextResponse.json({
            success: true,
            message: 'Addon deleted successfully',
        });
    } catch (error) {
        console.error('Delete addon error:', error);
        return NextResponse.json(
            { error: 'Failed to delete addon' },
            { status: 500 }
        );
    }
}
