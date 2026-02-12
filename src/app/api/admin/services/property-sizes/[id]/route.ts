import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import { query } from '@/lib/database';
import {
    updatePropertySizeConfig,
    deletePropertySizeConfig,
} from '@/lib/services-db';
import type { UpdatePropertySizeConfigRequest } from '@/types/services';

// GET /api/admin/services/property-sizes/:id - Get property size config details (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const result = await query('SELECT * FROM property_size_configs WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Property size config not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            config: result.rows[0],
        });
    } catch (error) {
        console.error('Get property size config error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve property size configuration' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/services/property-sizes/:id - Update property size config (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const body: UpdatePropertySizeConfigRequest = await request.json();

        const config = await updatePropertySizeConfig({ ...body, id });

        return NextResponse.json({
            success: true,
            config,
        });
    } catch (error: any) {
        console.error('Update property size config error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Property size config with this code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update property size configuration' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/services/property-sizes/:id - Delete property size config (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        await deletePropertySizeConfig(id);

        return NextResponse.json({
            success: true,
            message: 'Property size configuration deleted successfully',
        });
    } catch (error) {
        console.error('Delete property size config error:', error);
        return NextResponse.json(
            { error: 'Failed to delete property size configuration' },
            { status: 500 }
        );
    }
}
