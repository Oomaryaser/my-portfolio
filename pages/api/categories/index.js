import nextConnect from 'next-connect';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import toBase64 from '../../../lib/b64';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.get(async (_, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, cover, cover_type')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'fetch-fail' });
  }

  const cats = (data || []).map(r => ({
    id: r.id,
    name: r.name,
    cover: r.cover ? `data:${r.cover_type};base64,${toBase64(r.cover)}` : ''
  }));

  res.json(cats);
});

handler.use(upload.single('cover'));

handler.post(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name-required' });

  const cover = req.file ? req.file.buffer.toString('base64') : null;
  const cType = req.file ? req.file.mimetype : null;

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), cover, cover_type: cType }])
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
