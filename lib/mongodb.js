// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // في التطوير، حافظ على الـ client في ذاكرة الموديل لإعادة التحميل السريع
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // في الإنتاج، أنشئ اتصال جديد مرة وحدة
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
