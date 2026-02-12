import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getPropertySizeConfigs,
    createPropertySizeConfig,
} from '@/lib/services-db';
import type { CreatePropertySizeConfigRequest } from '@/types/services';

// GET /api/admin/services/property-sizes - List all property size configs (admin)
export async function GET(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active') !== 'false';

        const configs = await getPropertySizeConfigs(active);

        return NextResponse.json({
            success: true,
            configs,
        });
    } catch (error) {
        console.error('Get property sizes error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve property size configurations' },
            { status: 500 }
        );
    }
}

// POST /api/admin/services/property-sizes - Create property size config (admin)
export async function POST(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const body: CreatePropertySizeConfigRequest = await request.json();

        // Validate required fields
        if (!body.code || !body.label || body.multiplier === undefined || body.min_sqft === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: code, label, multiplier, min_sqft' },
                { status: 400 }
            );
        }

        const config = await createPropertySizeConfig(body);

        return NextResponse.json({
            success: true,
            config,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create property size config error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Property size config with this code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create property size configuration' },
            { status: 500 }
        );
    }
}
