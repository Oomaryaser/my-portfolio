// File: models/Image.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now, index: true }
});

// إنشاء الفهرس على createdAt
ImageSchema.index({ createdAt: -1 });

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
