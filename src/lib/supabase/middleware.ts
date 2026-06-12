import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { authCookieOptions, withAuthCookieOptions } from '@/lib/supabase/auth-cookies';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login/';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isAdminRoute && !isLoginRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login/';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: authCookieOptions(),
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, withAuthCookieOptions(options))
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let isAdminProfile = false;
  if (user) {
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    isAdminProfile = Boolean(profile);
  }

  if (isAdminRoute && !isLoginRoute) {
    if (!user || !isAdminProfile) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login/';
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user && isAdminProfile) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
