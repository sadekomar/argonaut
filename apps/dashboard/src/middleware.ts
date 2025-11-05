import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/"];
const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const sessionCookie = getSessionCookie(request);

  // if user isn't logged in don't show them protected routes
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // if the user is logged in, don't show them login and signup pages
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}
