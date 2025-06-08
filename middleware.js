import { NextResponse } from 'next/server'

export function middleware(req) {
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'same-origin')
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; object-src 'none'"
  )
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }
  return res
}

export const config = {
  matcher: '/:path*'
}
