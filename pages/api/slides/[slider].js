import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../lib/supabase';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { slider } = req.query;
  const { data, error } = await supabase
    .from('slides')
    .select('id, image_url, target')
    .eq('slider', slider)
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const slides = (data || []).map(r => ({ id: r.id, src: r.image_url, link: r.target }));
  res.json(slides);
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const { slider } = req.query;
  const { link = '' } = req.body;
  const { buffer, mimetype, originalname } = req.file || {};

  try {
    const fileName = `slides/${Date.now()}-${originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, { contentType: mimetype });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

    const { error } = await supabase
      .from('slides')
      .insert([{ slider, image_url: publicUrl, target: link }]);
    if (error) throw error;

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'insert-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
