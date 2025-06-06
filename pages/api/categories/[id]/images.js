import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../../../lib/db';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  try {
    const { rows } = await pool.query(
      'SELECT id, data, content_type FROM images WHERE category_id=$1 ORDER BY id DESC',
      [id]
    );
    const imgs = rows.map(r => ({
      id: r.id,
      src: `data:${r.content_type};base64,${r.data.toString('base64')}`
    }));
    res.json(imgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fetch-fail' });
  }
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const { id } = req.query;
  const { buffer, mimetype } = req.file;
  try {
    const r = await pool.query(
      'INSERT INTO images (data, content_type, category_id) VALUES ($1,$2,$3) RETURNING id',
      [buffer, mimetype, id]
    );
    res.status(201).json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upload-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
