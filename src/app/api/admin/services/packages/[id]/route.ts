import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getPackageById,
    updatePackage,
    deletePackage,
} from '@/lib/services-db';
import type { UpdatePackageRequest } from '@/types/services';

// GET /api/admin/services/packages/:id - Get package details (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const package_ = await getPackageById(id);

        if (!package_) {
            return NextResponse.json(
                { error: 'Package not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            package: package_,
        });
    } catch (error) {
        console.error('Get package error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve package' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/services/packages/:id - Update package (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const body: UpdatePackageRequest = await request.json();

        const package_ = await updatePackage({ ...body, id });

        return NextResponse.json({
            success: true,
            package: package_,
        });
    } catch (error: any) {
        console.error('Update package error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Package with this code already exists for this category' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update package' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/services/packages/:id - Delete package (admin, soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        await deletePackage(id);

        return NextResponse.json({
            success: true,
            message: 'Package deleted successfully',
        });
    } catch (error) {
        console.error('Delete package error:', error);
        return NextResponse.json(
            { error: 'Failed to delete package' },
            { status: 500 }
        );
    }
}
