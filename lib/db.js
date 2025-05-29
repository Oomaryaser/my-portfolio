// File: lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect("mongodb+srv://dbUser:dbUserPassword@myporto.bs8o24q.mongodb.net/omarpor?retryWrites=true&w=majority").then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
