import crypto from 'crypto';

const SESSION_AGE_MS = 60 * 60 * 1000; // 1 hour

export function createSessionToken() {
  const expires = Date.now() + SESSION_AGE_MS;
  const token = `${expires}:${crypto.randomBytes(32).toString('hex')}`;
  const sig = crypto.createHmac('sha256', process.env.SESSION_SECRET)
    .update(token)
    .digest('hex');
  return `${token}.${sig}`;
}

export function verifySession(req) {
  const cookie = req.headers.cookie
    ?.split(';')
    .find(c => c.trim().startsWith('session='));
  if (!cookie) return false;
  const raw = cookie.trim().slice('session='.length);
  const [token, sig] = raw.split('.');
  if (!token || !sig) return false;

  const expectedSig = crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(token)
    .digest('hex');
  if (sig.length !== expectedSig.length) return false;
  const validSig = crypto.timingSafeEqual(
    Buffer.from(sig, 'hex'),
    Buffer.from(expectedSig, 'hex')
  );
  if (!validSig) return false;

  const [expiresStr] = token.split(':');
  const expires = parseInt(expiresStr, 10);
  if (Number.isNaN(expires) || Date.now() > expires) return false;

  return true;
}
