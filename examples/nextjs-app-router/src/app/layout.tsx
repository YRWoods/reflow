import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { ResponsiveProvider } from "fluidity-ts/react";
import { clientHintsResponseHeaders, resolveServerBreakpoint } from "fluidity-ts/server";
import { breakpointSystem } from "../breakpoints";
import "./globals.css";

export const metadata: Metadata = {
  title: "fluidity-ts • Next.js App Router",
  description: "SSR-safe breakpoints with Client Hints in the Next.js App Router.",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const serverSnapshot = resolveServerBreakpoint(
    {
      headers: requestHeaders,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
    },
    breakpointSystem,
  );
  const clientHintMeta = Object.entries(clientHintsResponseHeaders).filter(([key]) => key !== "Vary");

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {clientHintMeta.map(([key, value]) => (
          <meta key={key} name={`fluidity-${key.toLowerCase()}`} content={value} />
        ))}
      </head>
      <body>
        <ResponsiveProvider system={breakpointSystem} serverWidth={serverSnapshot?.width}>
          {children}
        </ResponsiveProvider>
      </body>
    </html>
  );
}
