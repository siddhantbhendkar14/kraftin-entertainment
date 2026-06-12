type AuthCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
};

export function authCookieOptions(): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };
}

export function withAuthCookieOptions(options?: Record<string, unknown>) {
  return {
    ...options,
    ...authCookieOptions()
  };
}
