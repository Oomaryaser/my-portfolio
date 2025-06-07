// lib/db.js
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or DATABASE_URL must be provided');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false   // مطلوبة لـ Neon
  }
});

export default pool;
console.log('POSTGRES_URL =>', connectionString);

