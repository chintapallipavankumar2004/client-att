import { jwtVerify } from 'jose';

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
  const url = new URL(request.url);

  if (url.pathname === '/admin/login') {
    return;
  }

  const loginUrl = new URL('/admin/login', url.origin);
  loginUrl.searchParams.set('next', `${url.pathname}${url.search}`);
  const token = getCookie(request.headers.get('cookie'), SESSION_COOKIE_NAME);
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!token || !secret) {
    return Response.redirect(loginUrl, 307);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return;
  } catch {
    return Response.redirect(loginUrl, 307);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
