// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false   // مطلوبة لـ Neon
  }
});

export default pool;
console.log('POSTGRES_URL =>', process.env.POSTGRES_URL);