import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../lib/supabase';

// Updated to store cover images in Supabase storage

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, cover_url, section')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'not-found' });

  res.json({
    id: data.id,
    name: data.name,
    cover: data.cover_url || '',
    section: data.section || 'skills'
  });
});

handler.use(upload.single('cover'));

handler.put(async (req, res) => {
  const { id } = req.query;
  const { name, section } = req.body;

  if (!name) return res.status(400).json({ error: 'name required' });

  let fields = { name: name.trim() };
  if (section) fields.section = section;
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
    fields.cover_url = publicUrl;
  }

  const { error } = await supabase
    .from('categories')
    .update(fields)
    .eq('id', id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'update-fail' });
  }

  res.json({ ok: true });
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'delete-fail' });
  }

  res.json({ ok: true });
});

export const config = { api: { bodyParser: false } };
export default handler;




