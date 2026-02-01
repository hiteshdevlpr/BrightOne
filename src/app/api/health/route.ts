import { NextResponse } from 'next/server';

// GET /api/health - Lightweight liveness check (no DB). Used by deployment health checks.
export async function GET() {
  return NextResponse.json({ ok: true });
}
