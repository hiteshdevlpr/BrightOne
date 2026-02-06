import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

/**
 * Verify admin API key from request (Authorization: Bearer <key> or X-Admin-Key: <key>).
 * Returns null if authorized, or a NextResponse to return (401/503) if not.
 */
export function requireAdminKey(request: NextRequest): NextResponse | null {
  if (!ADMIN_API_KEY) {
    return NextResponse.json(
      { error: 'Admin API not configured' },
      { status: 503 }
    );
  }
  const authHeader = request.headers.get('authorization');
  const keyHeader = request.headers.get('x-admin-key');
  const provided = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : keyHeader ?? '';
  if (provided !== ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
