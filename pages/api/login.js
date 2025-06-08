import crypto from 'crypto';
import { createSessionToken } from '../../lib/auth';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { password } = req.body;
  if (typeof password !== 'string') {
    return res.status(400).json({ error: 'missing-password' });
  }

  const hash = crypto
    .pbkdf2Sync(password, process.env.ADMIN_SALT, ITERATIONS, KEY_LEN, DIGEST)
    .toString('hex');
  const expected = process.env.ADMIN_HASH;
  if (!expected || hash.length !== expected.length) {
    return res.status(401).json({ error: 'invalid-password' });
  }
  const valid = crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(expected, 'hex')
  );
  if (!valid) {
    return res.status(401).json({ error: 'invalid-password' });
  }

  const token = createSessionToken();
  const prod = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=3600;${prod ? ' Secure;' : ''}`
  );

  return res.status(200).json({ ok: true });
}
