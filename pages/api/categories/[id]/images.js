import nextConnect from 'next-connect';
import multer      from 'multer';
import pool        from '../../../../lib/db';   // ملاحظة مسار الرجوع ../..

const upload  = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

/* ———ـ جلب صور قسم واحد ———ـ */
handler.get(async (req, res) => {
  const { id }   = req.query;
  const { rows } = await pool.query(
    'SELECT id, data, content_type FROM images WHERE category_id=$1 ORDER BY id DESC',
    [id]
  );
  const imgs = rows.map(r => ({
    id : r.id,
    src: `data:${r.content_type};base64,${r.data.toString('base64')}`
  }));
  res.json(imgs);
});

/* ———ـ رفع صورة جديدة ———ـ */
handler.use(upload.single('file'));          // المفتاح «file» هو نفسه الذى ترسله الواجهة‏:contentReference[oaicite:5]{index=5}

handler.post(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no-file' });

  const { id } = req.query;
  const { buffer, mimetype } = req.file;

  await pool.query(
    'INSERT INTO images (data, content_type, category_id) VALUES ($1,$2,$3)',
    [buffer, mimetype, id]
  );
  res.status(201).json({ ok: true });
});

/* ———ـ حذف صورة ———ـ (اختياري) */
handler.delete(async (req, res) => {
  const { img } = req.query;                // ?img=123
  await pool.query('DELETE FROM images WHERE id=$1', [img]);
  res.json({ ok: true });
});

export const config = { api: { bodyParser: false } };  // لازم لتعطيل بارسر Next.js
export default handler;
