// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../lib/db';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {

  try {
    const { buffer, mimetype } = req.file;              // بايتات الصورة
    const r = await pool.query(
      'INSERT INTO images (data, content_type) VALUES ($1,$2) RETURNING id',
      [buffer, mimetype]
    );
    return res.status(201).json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
