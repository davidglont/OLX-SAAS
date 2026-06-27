import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PATHS = ["/admin"];
const AUTH_PATHS = ["/dashboard", "/tool", "/account", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to get the real path
  const pathnameWithoutLocale = pathname.replace(/^\/(ro|en)/, "") || "/";

  // Block API admin routes from non-admins
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acces interzis" }, { status: 403 });
    }
  }

  // Block /[locale]/admin from non-admins
  if (ADMIN_PATHS.some((p) => pathnameWithoutLocale.startsWith(p))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      const locale = pathname.split("/")[1] === "en" ? "en" : "ro";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Redirect unauthenticated users away from protected pages
  if (AUTH_PATHS.some((p) => pathnameWithoutLocale.startsWith(p))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const locale = pathname.split("/")[1] === "en" ? "en" : "ro";
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api/auth|_next|_vercel|.*\\..*).*)"],
};
