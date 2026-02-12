import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getAddons,
    createAddon,
} from '@/lib/services-db';
import type { CreateAddonRequest } from '@/types/services';

// GET /api/admin/services/addons - List all addons (admin)
export async function GET(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active') !== 'false';

        const addons = await getAddons(category || undefined, active);

        return NextResponse.json({
            success: true,
            addons,
        });
    } catch (error) {
        console.error('Get addons error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve addons' },
            { status: 500 }
        );
    }
}

// POST /api/admin/services/addons - Create addon (admin)
export async function POST(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const body: CreateAddonRequest = await request.json();

        // Validate required fields
        if (!body.code || !body.name || body.base_price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: code, name, base_price' },
                { status: 400 }
            );
        }

        const addon = await createAddon(body);

        return NextResponse.json({
            success: true,
            addon,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create addon error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Addon with this code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create addon' },
            { status: 500 }
        );
    }
}
