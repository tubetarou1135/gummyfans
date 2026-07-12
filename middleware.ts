import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OLD_HOST = 'gummyfans.vercel.app'
const CANONICAL_HOST = 'www.gummyfans.jp'

export function middleware(request: NextRequest) {
  if (request.headers.get('host') === OLD_HOST) {
    const url = new URL(request.url)
    url.protocol = 'https'
    url.host = CANONICAL_HOST
    return NextResponse.redirect(url, 308)
  }

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authed = request.cookies.get('admin_authed')?.value === 'true'
    if (!authed) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
