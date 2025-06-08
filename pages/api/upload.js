// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../lib/db';
import optimize from '../../lib/optimize';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no-file' });

    const optimized = await optimize(req.file.buffer);
    const r = await pool.query(
      'INSERT INTO images (data, content_type) VALUES ($1,$2) RETURNING id',
      [optimized, 'image/webp']
    );

    return res.status(201).json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
