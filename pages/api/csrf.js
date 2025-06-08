import { createCsrfToken, setCsrfCookie } from '../../lib/csrf'

export default function handler(req, res) {
  const token = createCsrfToken()
  setCsrfCookie(res, token)
  res.status(200).json({ token })
}
