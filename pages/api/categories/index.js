import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../lib/supabase';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (_, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, cover_url')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const cats = (data || []).map(r => ({
    id: r.id,
    name: r.name,
    cover: r.cover_url || ''
  }));

  res.json(cats);
});

handler.use(upload.single('cover'));

handler.post(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name-required' });

  let publicUrl = null;
  if (req.file) {
    const { buffer, mimetype, originalname } = req.file;
    const fileName = `${Date.now()}-${originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, { contentType: mimetype });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: 'upload-fail' });
    }

    const {
      data: { publicUrl: url }
    } = supabase.storage.from('images').getPublicUrl(fileName);
    publicUrl = url;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), ...(publicUrl && { cover_url: publicUrl }) }])
    .select('id')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'insert-fail' });
  }

  res.status(201).json({ id: data.id });
});

export const config = { api: { bodyParser: false } };
export default handler;
