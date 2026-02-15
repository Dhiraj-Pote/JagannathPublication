import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedRoutes = ["/checkout", "/orders"];

export async function middleware(request: NextRequest) {
  // 1. Refresh the auth session cookies
  const response = await updateSession(request);

  // 2. Check if the current route is protected
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return response;
  }

  // 3. For protected routes, check if the user has an active session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. If no session, redirect to login with redirectTo param
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. If session exists, allow the request through
  return response;
}

export const config = {
  matcher: ["/checkout", "/checkout/:path*", "/orders", "/orders/:path*"],
};
