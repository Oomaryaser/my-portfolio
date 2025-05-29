// pages/api/images.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  // GET /api/images  → إرجاع كل الصور
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT id, data, content_type FROM images ORDER BY id DESC'
      );

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

  // DELETE /api/images?id=123
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
