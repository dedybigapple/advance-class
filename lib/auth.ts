import { cookies } from 'next/headers';

const COOKIE_NAME = 'crm_lite_session';

export function setSessionCookie() {
  cookies().set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
}

export function isAuthenticated() {
  return cookies().get(COOKIE_NAME)?.value === 'ok';
}
