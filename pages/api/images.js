// pages/api/images.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  /* ————— جلب كل الصور ————— */
  if (req.method === 'GET') {
    try {
      // لاحِظ {} بدل []
      const { cat } = req.query;
      const q = cat
        ? 'SELECT id, data, content_type FROM images WHERE category_id=$1 ORDER BY id DESC'
        : 'SELECT id, data, content_type FROM images ORDER BY id DESC';
      const { rows } = await pool.query(q, cat ? [cat] : []);

      const imgs = rows.map(r => ({
        id:  r.id,
        src: `data:${r.content_type};base64,${r.data.toString('base64')}`
      }));

      return res.status(200).json(imgs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'fetch-fail' });
    }
  }

  /* ————— حذف صورة ————— */
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id-required' });

    try {
      await pool.query('DELETE FROM images WHERE id = $1', [id]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'delete-fail' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end();
}
