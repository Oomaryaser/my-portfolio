import nextConnect from 'next-connect';
import multer      from 'multer';
import pool        from '../../../../lib/db';   // ملاحظة مسار الرجوع ../..
const util = require('util');

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
handler.use(upload.single('file'));          // المفتاح «file» هو نفسه الذى ترسله الواجهة\:contentReference[oaicite:5]{index=5}

handler.post(async (req, res) => {
    console.log('🔵 POST-HIT post1');               // لتتأكد أنّ الطلب وصل
  const { id }   = req.query;
  const cover   = req?.file ? req?.file?.buffer   : null;
  const cType   = req?.file ? req?.file?.mimetype : null;
console.log(util.inspect(req, { showHidden: false, depth: null, colors: true }));
  console.log('🔵 POST-HIT 1 '+ req.cat);               // لتتأكد أنّ الطلب وصل

  await pool.query(
    'INSERT INTO images (data, content_type, category_id) VALUES ($1,$2,$3)',
    [cover, cType, id]
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

handler.post(async (req, res) => {
  console.log('🔵 POST-HIT post2');               // لتتأكد أنّ الطلب وصل

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'no-file' });
    }

    const { id } = req.query;                      // category_id
    const {
      buffer,           // بيانات الصورة
      mimetype,         // image/jpeg …
      originalname      // اسم الملف الأصلي
    } = req.file;

    const fileName = originalname ?? randomUUID(); // يعوّض عمود name

    await pool.query(
      `INSERT INTO images (name, img, img_type, category_id)
       VALUES ($1, $2, $3, $4)`,
      [fileName, buffer, mimetype, id]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    // يطبع كامل الـ Stack Trace
    console.error('🚨 IMAGE-UPLOAD-ERR:\n', err.stack || err);
    return res.status(500).json({ error: 'server-error' });
  }
});


// KMKFLDMVLKMFV