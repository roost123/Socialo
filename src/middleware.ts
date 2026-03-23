import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Add Secure flag to NEXT_LOCALE cookie
  const cookies = response.headers.getSetCookie();
  if (cookies.length > 0) {
    response.headers.delete('set-cookie');
    for (const cookie of cookies) {
      if (cookie.includes('NEXT_LOCALE') && !cookie.toLowerCase().includes('secure')) {
        response.headers.append('set-cookie', cookie + '; Secure');
      } else {
        response.headers.append('set-cookie', cookie);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/(nl|en|de|fr|es|pt|ar|zh|uk|hi|tr)/:path*'],
};
