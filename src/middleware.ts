/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  console.log("Token from cookies: ", token);
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
