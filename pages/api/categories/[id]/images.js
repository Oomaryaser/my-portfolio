import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../../../lib/db';
import optimize from '../../../../lib/optimize';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  const { rows } = await pool.query(
    'SELECT id, data, content_type FROM images WHERE category_id=$1 ORDER BY id DESC',
    [id]
  );
  const imgs = rows.map(r => ({
    id: r.id,
    src: `data:${r.content_type};base64,${r.data.toString('base64')}`
  }));
  res.json(imgs);
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
    const { id } = req.query;
    if (!req.file) return res.status(400).json({ error: 'no-file' });

    const optimized = await optimize(req.file.buffer);
    await pool.query(
      'INSERT INTO images (data, content_type, category_id) VALUES ($1,$2,$3)',
      [optimized, 'image/webp', id]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server-error' });
  }
});

handler.delete(async (req, res) => {
  const { img } = req.query;
  await pool.query('DELETE FROM images WHERE id=$1', [img]);
  res.json({ ok: true });
});

export const config = { api: { bodyParser: false } };
export default handler;
