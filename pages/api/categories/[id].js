import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../../lib/supabase';
import toBase64 from '../../../lib/b64';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, cover, cover_type')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'not-found' });

  res.json({
    id: data.id,
    name: data.name,
    cover: data.cover ? `data:${data.cover_type};base64,${toBase64(data.cover)}` : ''
  });
});

handler.use(upload.single('cover'));

handler.put(async (req, res) => {
  const { id } = req.query;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'name required' });

  const cover = req.file ? req.file.buffer : null;
  const cType = req.file ? req.file.mimetype : null;

  const { error } = await supabase
    .from('categories')
    .update({
      name: name.trim(),
      ...(cover && { cover }),
      ...(cType && { cover_type: cType })
    })
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




