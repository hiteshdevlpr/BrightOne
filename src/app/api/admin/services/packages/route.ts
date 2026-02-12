import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getPackages,
    createPackage,
    getPackageById,
} from '@/lib/services-db';
import type { CreatePackageRequest } from '@/types/services';

// GET /api/admin/services/packages - List all packages (admin)
export async function GET(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active') !== 'false';

        const packages = await getPackages(category || undefined, active);

        return NextResponse.json({
            success: true,
            packages,
        });
    } catch (error) {
        console.error('Get packages error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve packages' },
            { status: 500 }
        );
    }
}

// POST /api/admin/services/packages - Create package (admin)
export async function POST(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const body: CreatePackageRequest = await request.json();

        // Validate required fields
        if (!body.category_id || !body.code || !body.name || body.base_price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: category_id, code, name, base_price' },
                { status: 400 }
            );
        }

        const package_ = await createPackage(body);

        return NextResponse.json({
            success: true,
            package: package_,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create package error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Package with this code already exists for this category' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create package' },
            { status: 500 }
        );
    }
}
