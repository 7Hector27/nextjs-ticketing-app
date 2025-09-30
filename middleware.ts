import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const pathname = req.nextUrl.pathname;

    // Admin/Staff can access /dash/*
    if (
      (payload.role === "admin" || payload.role === "staff") &&
      pathname.startsWith("/dash")
    ) {
      return NextResponse.next();
    }

    // Customer can access /orders/*
    if (payload.role === "customer" && pathname.startsWith("/orders")) {
      return NextResponse.next();
    }

    // Otherwise redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dash/:path*", "/orders/:path*"], // ✅ now watching both
};
