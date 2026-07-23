import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Only set cookie on first visit; manual overrides live in localStorage
  if (request.cookies.has("cmmn_country")) {
    return NextResponse.next();
  }
  const ipCountry = request.headers.get("x-vercel-ip-country") ?? "JP";
  const country = ipCountry === "US" ? "US" : "JP";
  const response = NextResponse.next();
  response.cookies.set("cmmn_country", country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)"],
};
