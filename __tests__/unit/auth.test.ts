import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Supabase client before importing auth helpers
const mockSignInWithOtp = vi.fn();
const mockVerifyOtp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
      verifyOtp: mockVerifyOtp,
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
  }),
}));

import { signInWithPhone, verifyOtp, signOut, getSession } from '@/lib/auth';

describe('Auth helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInWithPhone', () => {
    it('calls supabase.auth.signInWithOtp with the phone number', async () => {
      mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });

      const result = await signInWithPhone('+919876543210');

      expect(mockSignInWithOtp).toHaveBeenCalledWith({ phone: '+919876543210' });
      expect(result).toEqual({ data: {}, error: null });
    });

    it('returns error when signInWithOtp fails', async () => {
      const error = { message: 'Rate limit exceeded', status: 429 };
      mockSignInWithOtp.mockResolvedValue({ data: {}, error });

      const result = await signInWithPhone('+919876543210');

      expect(result.error).toEqual(error);
    });
  });

  describe('verifyOtp', () => {
    describe('when NEXT_PUBLIC_MOCK_OTP is not set (production mode)', () => {
      beforeEach(() => {
        delete process.env.NEXT_PUBLIC_MOCK_OTP;
      });

      it('calls supabase.auth.verifyOtp with phone, token, and type sms', async () => {
        const mockData = {
          user: { id: 'user-123', phone: '+919876543210' },
          session: { access_token: 'token-abc' },
        };
        mockVerifyOtp.mockResolvedValue({ data: mockData, error: null });

        const result = await verifyOtp('+919876543210', '123456');

        expect(mockVerifyOtp).toHaveBeenCalledWith({
          phone: '+919876543210',
          token: '123456',
          type: 'sms',
        });
        expect(result.data).toEqual(mockData);
        expect(result.error).toBeNull();
      });

      it('returns error for invalid OTP from Supabase', async () => {
        const error = { message: 'Invalid OTP', status: 400 };
        mockVerifyOtp.mockResolvedValue({ data: { user: null, session: null }, error });

        const result = await verifyOtp('+919876543210', '000000');

        expect(result.error).toEqual(error);
      });
    });

    describe('when NEXT_PUBLIC_MOCK_OTP is true (development mode)', () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_MOCK_OTP = 'true';
      });

      afterEach(() => {
        delete process.env.NEXT_PUBLIC_MOCK_OTP;
      });

      it('accepts any 6-digit code and returns a mock success response', async () => {
        const result = await verifyOtp('+919876543210', '123456');

        expect(result.error).toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data?.user).toBeDefined();
        expect(result.data?.session).toBeDefined();
        expect(result.data?.user?.phone).toBe('+919876543210');
        // Should NOT call the real Supabase client
        expect(mockVerifyOtp).not.toHaveBeenCalled();
      });

      it('accepts any 6-digit code (e.g. 000000)', async () => {
        const result = await verifyOtp('+919876543210', '000000');

        expect(result.error).toBeNull();
        expect(result.data?.session).toBeDefined();
      });

      it('accepts any 6-digit code (e.g. 999999)', async () => {
        const result = await verifyOtp('+919876543210', '999999');

        expect(result.error).toBeNull();
        expect(result.data?.session).toBeDefined();
      });

      it('rejects non-6-digit codes in mock mode', async () => {
        const result = await verifyOtp('+919876543210', '12345');

        expect(result.error).toBeDefined();
        expect(result.data?.user).toBeNull();
        expect(result.data?.session).toBeNull();
      });

      it('rejects non-numeric codes in mock mode', async () => {
        const result = await verifyOtp('+919876543210', 'abcdef');

        expect(result.error).toBeDefined();
        expect(result.data?.user).toBeNull();
      });
    });
  });

  describe('signOut', () => {
    it('calls supabase.auth.signOut', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const result = await signOut();

      expect(mockSignOut).toHaveBeenCalled();
      expect(result).toEqual({ error: null });
    });

    it('returns error when signOut fails', async () => {
      const error = { message: 'Network error', status: 500 };
      mockSignOut.mockResolvedValue({ error });

      const result = await signOut();

      expect(result.error).toEqual(error);
    });
  });

  describe('getSession', () => {
    it('calls supabase.auth.getSession and returns session data', async () => {
      const sessionData = {
        session: {
          access_token: 'token-abc',
          user: { id: 'user-123' },
        },
      };
      mockGetSession.mockResolvedValue({ data: sessionData, error: null });

      const result = await getSession();

      expect(mockGetSession).toHaveBeenCalled();
      expect(result.data).toEqual(sessionData);
      expect(result.error).toBeNull();
    });

    it('returns null session when not authenticated', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null }, error: null });

      const result = await getSession();

      expect(result.data?.session).toBeNull();
      expect(result.error).toBeNull();
    });
  });
});
