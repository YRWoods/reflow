import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clientHintsResponseHeaders } from "fluidity-ts/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(clientHintsResponseHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
