import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_SEGMENTS = ["/tool", "/dashboard", "/account", "/profile"];
const ADMIN_SEGMENTS = ["/admin"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_SEGMENTS.some((seg) =>
    pathname.match(new RegExp(`^/[a-z]{2}${seg}(/|$)`))
  );
  const isAdmin = ADMIN_SEGMENTS.some((seg) =>
    pathname.match(new RegExp(`^/[a-z]{2}${seg}(/|$)`))
  );

  if (isProtected || isAdmin) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const locale = pathname.split("/")[1] || "ro";

    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && token.role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};