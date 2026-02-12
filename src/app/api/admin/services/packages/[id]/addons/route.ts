import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getPackageIncludedAddons,
    addPackageIncludedAddon,
    removePackageIncludedAddon,
    getPackageById,
} from '@/lib/services-db';

// GET /api/admin/services/packages/:id/addons - Get included addons for a package (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;

        // Verify package exists
        const package_ = await getPackageById(id);
        if (!package_) {
            return NextResponse.json(
                { error: 'Package not found' },
                { status: 404 }
            );
        }

        const includedAddons = await getPackageIncludedAddons(id);

        return NextResponse.json({
            success: true,
            includedAddons,
        });
    } catch (error) {
        console.error('Get package included addons error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve included addons' },
            { status: 500 }
        );
    }
}

// POST /api/admin/services/packages/:id/addons - Add included addon to package (admin)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const body = await request.json();

        if (!body.addon_id) {
            return NextResponse.json(
                { error: 'Missing required field: addon_id' },
                { status: 400 }
            );
        }

        const includedAddon = await addPackageIncludedAddon(id, body.addon_id);

        return NextResponse.json({
            success: true,
            includedAddon,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Add package included addon error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Addon is already included in this package' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to add included addon' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/services/packages/:id/addons?addonId=xxx - Remove included addon from package (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { id } = await params;
        const addonId = request.nextUrl.searchParams.get('addonId');
        if (!addonId) {
            return NextResponse.json(
                { error: 'Missing required query parameter: addonId' },
                { status: 400 }
            );
        }
        await removePackageIncludedAddon(id, addonId);

        return NextResponse.json({
            success: true,
            message: 'Included addon removed successfully',
        });
    } catch (error) {
        console.error('Remove package included addon error:', error);
        return NextResponse.json(
            { error: 'Failed to remove included addon' },
            { status: 500 }
        );
    }
}
