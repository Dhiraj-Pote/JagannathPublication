import { createClient } from '@/lib/supabase/client';

/**
 * Send a one-time password to the given phone number.
 * In mock OTP mode the call still goes through (Supabase may or may not
 * actually send an SMS depending on project config), but the important
 * part is that `verifyOtp` will accept any 6-digit code.
 */
export async function signInWithPhone(phone: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  return { data, error };
}

/**
 * Verify the OTP code for the given phone number.
 *
 * When `NEXT_PUBLIC_MOCK_OTP` is `"true"` (local development), any 6-digit
 * code is accepted and a mock success response is returned so that
 * developers can test the auth flow without incurring SMS costs.
 */
export async function verifyOtp(phone: string, token: string) {
  if (process.env.NEXT_PUBLIC_MOCK_OTP === 'true') {
    // In mock mode, accept any 6-digit code
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
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Retrieve the current session (if any).
 */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}
