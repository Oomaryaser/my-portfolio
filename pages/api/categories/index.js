import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../lib/supabase';

// Store category cover images in Supabase storage instead of the database

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { section } = req.query;
  let query = supabase
    .from('categories')
    .select('id, name, cover_url, section')
    .order('id', { ascending: false });
  if (section) query = query.eq('section', section);
  const { data, error } = await query;

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const cats = (data || []).map(r => ({
    id: r.id,
    name: r.name,
    cover: r.cover_url || '',
    section: r.section || 'skills'
  }));

  res.json(cats);
});

handler.use(upload.single('cover'));

handler.post(async (req, res) => {
  const { name, section = 'skills' } = req.body;
  if (!name) return res.status(400).json({ error: 'name-required' });

  let coverUrl = '';
  if (req.file) {
    const { buffer, mimetype, originalname } = req.file;
    const fileName = `covers/${Date.now()}-${originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, { contentType: mimetype });
    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: 'upload-fail' });
    }
    const {
      data: { publicUrl }
    } = supabase.storage.from('images').getPublicUrl(fileName);
    coverUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), cover_url: coverUrl, section }])
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
