import { NextResponse } from "next/server";
import {
  acquirerRoutes,
  adminRoutes,
  merchantRoutes,
} from "./app/services/routes";
import {
  acquirerRole,
  adminRole,
  merchantRole,
} from "./app/services/storageData";

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("user_role")?.value;
  const email = req.cookies.get("email")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) return handleUnauthenticated(pathname, req.url);
  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  const roleHandlers = [
    { checkRole: adminRole, routes: adminRoutes },
    { checkRole: merchantRole, routes: merchantRoutes },
    { checkRole: acquirerRole, routes: acquirerRoutes },
  ];

  for (const { checkRole, routes } of roleHandlers) {
    if (checkRole()) {
      return handleRoleBasedAccess(routes, pathname, req.url, role, email);
    }
  }
}

function handleUnauthenticated(pathname, url) {
  if (pathname !== "/login" && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", url));
  }
  return NextResponse.next();
}

function handleRoleBasedAccess(routes, pathname, url, role, email) {
  const isRouteAllowed = routes.some((route) =>
    new RegExp(`^${route.replace(":id", ".*")}$`).test(pathname)
  );
  if (!isRouteAllowed && pathname !== "/home/permission-denied") {
    return NextResponse.redirect(new URL("/home/permission-denied", url));
  }
  const response = NextResponse.next();
  response.headers.set("role", role);
  response.headers.set("email", email);
  return response;
}

export const config = {
  matcher: ["/", "/login", "/home/:path*"],
};
