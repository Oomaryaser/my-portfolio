import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id-required' });
    try {
      const { error } = await supabase.from('slides').delete().eq('id', id);
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

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end();
}
