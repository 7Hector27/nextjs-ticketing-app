import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface MyJwtPayload {
  role?: string;
  email?: string;
  userId?: string;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === "admin" || payload.role === "staff") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/unauthorized", req.url));
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dash/:path*"],
};
