import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Client } from '@planetscale/database';
import { eq } from 'drizzle-orm';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    console.log('Attempting to connect to database...');
    console.log('Host:', process.env.DATABASE_HOST);
    console.log('Username:', process.env.DATABASE_USERNAME);
    console.log('Password:', process.env.DATABASE_PASSWORD ? '[REDACTED]' : 'Not set');
    console.log('Database Name:', process.env.DATABASE_NAME);

    if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_PASSWORD || !process.env.DATABASE_NAME) {
      throw new Error('Database credentials are not properly set in environment variables');
    }

    try {
      const client = new Client({
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      });

      db = drizzle(client);
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error establishing database connection:', error);
      throw error;
    }
  }
  return db;
}

export async function testDatabaseConnection() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT 1');
    console.log('Database test query result:', result);
    return true;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export { eq };

