// pages/api/images.js
import supabase from '../../lib/supabase';
import toBase64 from '../../lib/b64';

export default async function handler(req, res) {
  /* ————— جلب كل الصور ————— */
  if (req.method === 'GET') {
    try {
      const { cat } = req.query;
      let query = supabase
        .from('images')
        .select('id, data, content_type')
        .order('id', { ascending: false });
      if (cat) query = query.eq('category_id', cat);
      const { data, error } = await query;

      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'fetch-fail' });
      }

      const imgs = (data || []).map(r => ({
        id: r.id,
        src: `data:${r.content_type};base64,${toBase64(r.data)}`
      }));

      return res.status(200).json(imgs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'fetch-fail' });
    }
  }

  /* ————— حذف صورة ————— */
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id-required' });

    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'delete-fail' });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'delete-fail' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end();
}
