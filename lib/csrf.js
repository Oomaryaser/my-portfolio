import crypto from 'crypto'

export function createCsrfToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function setCsrfCookie(res, token) {
  const prod = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `csrf=${token}; Path=/; SameSite=Strict; Max-Age=3600;${prod ? ' Secure;' : ''}`
  )
}

export function verifyCsrf(req) {
  const cookie = req.headers.cookie
    ?.split(';')
    .find(c => c.trim().startsWith('csrf='))
  if (!cookie) return false
  const tokenInCookie = cookie.trim().slice('csrf='.length)
  const headerToken = req.headers['x-csrf-token']
  if (!headerToken || headerToken.length !== tokenInCookie.length) return false
  return crypto.timingSafeEqual(
    Buffer.from(headerToken),
    Buffer.from(tokenInCookie)
  )
}
