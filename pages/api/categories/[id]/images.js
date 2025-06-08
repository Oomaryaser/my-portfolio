import nextConnect from 'next-connect';
import multer      from 'multer';
import supabase    from '../../../../lib/supabase';
const util = require('util');

const upload  = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

/* ———ـ جلب صور قسم واحد ———ـ */
handler.get(async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('images')
    .select('id, data, content_type')
    .eq('category_id', id)
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const imgs = (data || []).map(r => ({
    id: r.id,
    src: `data:${r.content_type};base64,${r.data}`
  }));

  res.json(imgs);
});

/* ———ـ رفع صورة جديدة ———ـ */
handler.use(upload.single('file'));          // المفتاح «file» هو نفسه الذى ترسله الواجهة\:contentReference[oaicite:5]{index=5}

handler.post(async (req, res) => {
  console.log('🔵 POST-HIT post1');               // لتتأكد أنّ الطلب وصل
  const { id } = req.query;
  const cover   = req?.file ? req?.file?.buffer   : null;
  const cType   = req?.file ? req?.file?.mimetype : null;
  console.log(util.inspect(req, { showHidden: false, depth: null, colors: true }));
  console.log('🔵 POST-HIT 1 '+ req.cat);               // لتتأكد أنّ الطلب وصل

  const { error } = await supabase
    .from('images')
    .insert([{ data: cover ? cover.toString('base64') : null, content_type: cType, category_id: id }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'insert-fail' });
  }

  res.status(201).json({ ok: true });
});

/* ———ـ حذف صورة ———ـ (اختياري) */
handler.delete(async (req, res) => {
  const { img } = req.query;                // ?img=123
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', img);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'delete-fail' });
  }

  res.json({ ok: true });
});

export const config = { api: { bodyParser: false } };  // لازم لتعطيل بارسر Next.js
export default handler;
