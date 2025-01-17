export function getDb() {
  if (!db) {
    console.log('Attempting to connect to database...');
    console.log('Host:', process.env.DATABASE_HOST);
    console.log('Username:', process.env.DATABASE_USERNAME);
    // Don't log the full password for security reasons
    console.log('Password:', process.env.DATABASE_PASSWORD ? '[REDACTED]' : 'Not set');

    const connection = connect({
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    });
    db = drizzle(connection);
    console.log('Database connection established');
  }
  return db;
}

