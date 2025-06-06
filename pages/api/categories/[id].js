import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../../lib/db';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  const r = await pool.query(
    'SELECT id, name, cover, cover_type FROM categories WHERE id=$1',
    [id]
  );
  if (r.rows.length === 0) return res.status(404).json({ error: 'not-found' });
  const c = r.rows[0];
  res.json({
    id: c.id,
    name: c.name,
    cover: c.cover ? `data:${c.cover_type};base64,${c.cover.toString('base64')}` : ''
  });
});

handler.use(upload.single('cover'));

handler.put(async (req, res) => {
  const { id } = req.query;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'name required' });

  const cover = req.file ? req.file.buffer   : null;
  const cType = req.file ? req.file.mimetype : null;

  const r = await pool.query(
  'UPDATE categories SET name=$1, cover=COALESCE($2,cover), cover_type=COALESCE($3,cover_type) WHERE id=$4 RETURNING id',
  [name.trim(), cover, cType, id]
);

  res.json({ ok: true });
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  await pool.query('DELETE FROM categories WHERE id=$1', [id]);
  res.json({ ok: true });
});

export const config = { api: { bodyParser: false } };
export default handler;




