import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../../lib/supabase';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

/* ———ـ جلب صور قسم واحد ———ـ */
handler.get(async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('images')
    .select('id, image_url')
    .eq('category_id', id)
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const imgs = (data || []).map(r => ({ id: r.id, src: r.image_url }));

  res.json(imgs);
});

/* ———ـ رفع صورة جديدة ———ـ */
handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const { id } = req.query;
  const { buffer, mimetype, originalname } = req.file || {};

  try {
    const fileName = `${Date.now()}-${originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, { contentType: mimetype });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl }
    } = supabase.storage.from('images').getPublicUrl(fileName);

    const { error } = await supabase
      .from('images')
      .insert([{ image_url: publicUrl, category_id: id }]);

    if (error) throw error;

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'insert-fail' });
  }
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


export const config = { api: { bodyParser: false } };
export default handler;