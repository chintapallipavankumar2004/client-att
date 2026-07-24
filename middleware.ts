import { jwtVerify } from 'jose';
import { DEVELOPMENT_ADMIN_MODE } from './src/shared/adminMode.js';

const SESSION_COOKIE_NAME = '__Host-att_admin_session';

function getCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const value = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

export default async function middleware(request: Request) {
  // DEVELOPMENT ONLY — remove this bypass by setting DEVELOPMENT_ADMIN_MODE to false.
  if (DEVELOPMENT_ADMIN_MODE) {
    return;
  }

  const url = new URL(request.url);

  if (url.pathname === '/admin/login') {
    return;
  }

  const loginUrl = new URL('/admin/login', url.origin);
  loginUrl.searchParams.set('next', `${url.pathname}${url.search}`);
  const token = getCookie(request.headers.get('cookie'), SESSION_COOKIE_NAME);
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!token || !secret) {
    console.info('[admin-auth]', JSON.stringify({
      event: 'middleware_redirect_to_login',
      reason: !token ? 'session_missing' : 'session_secret_missing',
      path: url.pathname,
    }));
    return Response.redirect(loginUrl, 307);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    console.info('[admin-auth]', JSON.stringify({ event: 'middleware_session_valid', path: url.pathname }));
    return;
  } catch {
    console.info('[admin-auth]', JSON.stringify({ event: 'middleware_redirect_to_login', reason: 'session_invalid', path: url.pathname }));
    return Response.redirect(loginUrl, 307);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
