import { NextResponse } from 'next/server';
import { getDb } from '@/utils/db';
import { users } from '@/db/schema.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.select().from(users).limit(5);
    console.log('First 5 users:', result);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });
  }
}

