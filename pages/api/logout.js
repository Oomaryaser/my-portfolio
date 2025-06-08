export default function handler(req, res) {
  const prod = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;${prod ? ' Secure;' : ''}`
  );
  res.status(200).json({ ok: true });
}
