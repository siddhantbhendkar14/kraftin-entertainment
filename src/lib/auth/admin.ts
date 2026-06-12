import { createClient } from '@/lib/supabase/server';

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthError('Unauthorized', 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id, email, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new AuthError('Forbidden', 403);
  }

  return { supabase, user, profile };
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
