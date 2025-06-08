import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../../lib/db';
import optimize from '../../../lib/optimize';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (_, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, cover, cover_type FROM categories ORDER BY id DESC'
  );
  const cats = rows.map(r => ({
    id:   r.id,
    name: r.name,
    cover: r.cover
      ? `data:${r.cover_type};base64,${r.cover.toString('base64')}`
      : ''
  }));
  res.json(cats);
});

handler.use(upload.single('cover'));

handler.post(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name-required' });

  const cover   = req.file ? await optimize(req.file.buffer) : null;
  const cType   = req.file ? 'image/webp' : null;

  const r = await pool.query(
    'INSERT INTO categories (name, cover, cover_type) VALUES ($1,$2,$3) RETURNING id',
    [name.trim(), cover, cType]
  );
  res.status(201).json({ id: r.rows[0].id });
});

export const config = { api: { bodyParser: false } };
export default handler;
