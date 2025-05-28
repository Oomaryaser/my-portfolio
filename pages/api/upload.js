// File: pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import dbConnect from '../../lib/db';
import Image from '../../models/Image';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect({
  onError(err, req, res) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  await dbConnect();
  const { buffer, mimetype } = req.file;
  const img = new Image({ data: buffer, contentType: mimetype });
  await img.save();
  res.status(201).json({ message: 'Uploaded successfully' });
});

// حظر bodyParser الافتراضي لتمكين multer
export const config = { api: { bodyParser: false } };
export default handler;
