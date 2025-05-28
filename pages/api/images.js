// File: pages/api/images.js
import dbConnect from '../../lib/db';
import Image from '../../models/Image';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // فرز على _id تنازليًا (يوازي أحدث المستندات أولًا)
      const docs = await Image.find()
        .sort({ _id: -1 })
        .select('data contentType')  // نجلب فقط الحقول الضرورية
        .lean();

      const result = docs.map(doc => ({
        id:  doc._id,
        src: `data:${doc.contentType};base64,${doc.data.toString('base64')}`
      }));

      return res.status(200).json(result);
    } catch (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing image id' });
    }
    try {
      await Image.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
