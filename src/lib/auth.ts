import { NextResponse } from "next/server";

export function parseToken(token: string): Record<string, unknown> | undefined {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return undefined;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString());
  } catch {
    return undefined;
  }
}

export function getTokenExpiration(token: string): number | undefined {
  const payload = parseToken(token);

  if (payload && typeof payload.exp === "number") {
    return Math.floor((payload.exp * 1000 - Date.now()) / 1000);
  }
}

export function setCookie(res: NextResponse, name: string, value: string) {
  const maxAge = getTokenExpiration(value);

  res.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}
