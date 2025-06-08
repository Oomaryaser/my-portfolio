import crypto from 'crypto';
import { createSessionToken } from '../../lib/auth';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10);
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '5', 10);
const attempts = new Map();

function recordAttempt(ip) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  attempts.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (recordAttempt(ip)) {
    return res.status(429).json({ error: 'too-many-attempts' });
  }

  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'missing-credentials' });
  }

  if (username !== (process.env.ADMIN_USERNAME || 'omaradmin')) {
    return res.status(401).json({ error: 'invalid-username' });
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

  attempts.delete(ip);

  return res.status(200).json({ ok: true });
}
