import { createClient } from '@/lib/supabase/client';

/**
 * Send a one-time password to the given phone number.
 */
export async function signInWithPhone(phone: string) {
  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: { message: 'Auth not configured', status: 500 } };
  }
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  return { data, error };
}

/**
 * Verify the OTP code for the given phone number.
 */
export async function verifyOtp(phone: string, token: string) {
  if (process.env.NEXT_PUBLIC_MOCK_OTP === 'true') {
    if (/^\d{6}$/.test(token)) {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            phone,
            aud: 'authenticated',
            role: 'authenticated',
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'mock-user-id',
              phone,
              aud: 'authenticated',
              role: 'authenticated',
            },
          },
        },
        error: null,
      };
    }
    return {
      data: { user: null, session: null },
      error: { message: 'Invalid OTP code. Must be 6 digits.', status: 400 },
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { data: { user: null, session: null }, error: { message: 'Auth not configured', status: 500 } };
  }
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
}

/**
 * Sign the current user out.
 */
export async function signOut() {
  const supabase = createClient();
  if (!supabase) {
    return { error: { message: 'Auth not configured', status: 500 } };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Retrieve the current session (if any).
 */
export async function getSession() {
  const supabase = createClient();
  if (!supabase) {
    return { data: { session: null }, error: null };
  }
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}
