// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../lib/supabase';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
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

    const { data, error } = await supabase
      .from('images')
      .insert([{ image_url: publicUrl }])
      .select('id')
      .single();

    if (error) throw error;

    return res.status(201).json({ id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;