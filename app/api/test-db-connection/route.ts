import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/utils/db';

export const dynamic = 'force-dynamic'; // Ensures this route is not cached

export async function GET() {
  try {
    console.log('Starting database connection test...');
    const isConnected = await testDatabaseConnection();
    console.log('Database connection test result:', isConnected);
    return NextResponse.json({ success: true, message: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection failed:', error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

