import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");
  const isApi = req.nextUrl.pathname.startsWith("/api");

  if (isApiAuth) return NextResponse.next();

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token && !isApi) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
