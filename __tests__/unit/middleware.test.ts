import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock updateSession from supabase middleware
const mockUpdateSession = vi.fn();
vi.mock('@/lib/supabase/middleware', () => ({
  updateSession: (...args: unknown[]) => mockUpdateSession(...args),
}));

// Mock createServerClient from @supabase/ssr
const mockGetUser = vi.fn();
vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}));

import { middleware, config } from '@/middleware';

function createMockRequest(pathname: string): NextRequest {
  const url = new URL(pathname, 'http://localhost:3000');
  return new NextRequest(url);
}

function createMockResponse(): NextResponse {
  const response = NextResponse.next();
  return response;
}

describe('Auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSession.mockImplementation(() => Promise.resolve(createMockResponse()));
  });

  describe('config matcher', () => {
    it('matches /checkout route', () => {
      expect(config.matcher).toContain('/checkout');
    });

    it('matches /orders route', () => {
      expect(config.matcher).toContain('/orders');
    });

    it('matches /checkout sub-routes', () => {
      expect(config.matcher).toContain('/checkout/:path*');
    });

    it('matches /orders sub-routes', () => {
      expect(config.matcher).toContain('/orders/:path*');
    });
  });

  describe('non-protected routes', () => {
    it('calls updateSession and returns the response for non-protected routes', async () => {
      const request = createMockRequest('/');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(mockUpdateSession).toHaveBeenCalledWith(request);
      expect(result).toBe(sessionResponse);
      // Should not check user for non-protected routes
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it('allows /books route without auth check', async () => {
      const request = createMockRequest('/books/some-id');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(result).toBe(sessionResponse);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it('allows /cart route without auth check', async () => {
      const request = createMockRequest('/cart');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(result).toBe(sessionResponse);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it('allows /auth/login route without auth check', async () => {
      const request = createMockRequest('/auth/login');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(result).toBe(sessionResponse);
      expect(mockGetUser).not.toHaveBeenCalled();
    });
  });

  describe('protected routes - unauthenticated', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it('redirects unauthenticated users from /checkout to /auth/login', async () => {
      const request = createMockRequest('/checkout');

      const result = await middleware(request);

      expect(mockUpdateSession).toHaveBeenCalledWith(request);
      expect(mockGetUser).toHaveBeenCalled();
      expect(result.status).toBe(307);
      const redirectUrl = new URL(result.headers.get('location')!);
      expect(redirectUrl.pathname).toBe('/auth/login');
      expect(redirectUrl.searchParams.get('redirectTo')).toBe('/checkout');
    });

    it('redirects unauthenticated users from /orders to /auth/login', async () => {
      const request = createMockRequest('/orders');

      const result = await middleware(request);

      expect(mockGetUser).toHaveBeenCalled();
      expect(result.status).toBe(307);
      const redirectUrl = new URL(result.headers.get('location')!);
      expect(redirectUrl.pathname).toBe('/auth/login');
      expect(redirectUrl.searchParams.get('redirectTo')).toBe('/orders');
    });

    it('redirects unauthenticated users from /orders/some-sub-path to /auth/login', async () => {
      const request = createMockRequest('/orders/some-sub-path');

      const result = await middleware(request);

      expect(result.status).toBe(307);
      const redirectUrl = new URL(result.headers.get('location')!);
      expect(redirectUrl.pathname).toBe('/auth/login');
      expect(redirectUrl.searchParams.get('redirectTo')).toBe('/orders/some-sub-path');
    });
  });

  describe('protected routes - authenticated', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123', phone: '+919876543210' } },
      });
    });

    it('allows authenticated users to access /checkout', async () => {
      const request = createMockRequest('/checkout');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(mockUpdateSession).toHaveBeenCalledWith(request);
      expect(mockGetUser).toHaveBeenCalled();
      expect(result).toBe(sessionResponse);
    });

    it('allows authenticated users to access /orders', async () => {
      const request = createMockRequest('/orders');
      const sessionResponse = createMockResponse();
      mockUpdateSession.mockResolvedValue(sessionResponse);

      const result = await middleware(request);

      expect(mockGetUser).toHaveBeenCalled();
      expect(result).toBe(sessionResponse);
    });
  });

  describe('updateSession is always called', () => {
    it('calls updateSession even for protected routes', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      const request = createMockRequest('/checkout');

      await middleware(request);

      expect(mockUpdateSession).toHaveBeenCalledWith(request);
    });
  });
});
