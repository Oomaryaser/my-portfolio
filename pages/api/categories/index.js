import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../../lib/db';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const kind = req.query.kind || null;
  const q = kind
    ?
      'SELECT id, name, cover, cover_type FROM categories WHERE kind=$1 ORDER BY id DESC'
    :
      'SELECT id, name, cover, cover_type, kind FROM categories ORDER BY id DESC';
  const { rows } = await pool.query(q, kind ? [kind] : []);
  const cats = rows.map(r => ({
    id:   r.id,
    name: r.name,
    cover: r.cover
      ? `data:${r.cover_type};base64,${r.cover.toString('base64')}`
      : '',
    kind: r.kind
  }));
  res.json(cats);
});

handler.use(upload.single('cover'));

handler.post(async (req, res) => {
  const { name, kind = 'skill' } = req.body;
  if (!name) return res.status(400).json({ error: 'name-required' });

  const cover   = req.file ? req.file.buffer   : null;
  const cType   = req.file ? req.file.mimetype : null;

  const r = await pool.query(
    'INSERT INTO categories (name, cover, cover_type, kind) VALUES ($1,$2,$3,$4) RETURNING id',
    [name.trim(), cover, cType, kind]
  );
  res.status(201).json({ id: r.rows[0].id });
});

export const config = { api: { bodyParser: false } };
export default handler;
