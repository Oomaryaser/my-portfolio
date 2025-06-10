// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import supabase from '../../lib/supabase';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
    console.log('🔵 POST-HIT post3');               // لتتأكد أنّ الطلب وصل

  try {
    const { buffer, mimetype } = req.file;              // بايتات الصورة
    const { data, error } = await supabase
      .from('images')
      .insert([{ data: buffer, content_type: mimetype }])
      .select('id')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'upload-fail' });
    }

    return res.status(201).json({ id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload-fail' });
  }
});

export const config = { api: { bodyParser: false } };
export default handler;
