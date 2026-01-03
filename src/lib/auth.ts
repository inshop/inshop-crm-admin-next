import { NextResponse } from "next/server";

export type TokenType = {
  exp: number;
};

export function parseToken(token: string): TokenType | undefined {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return undefined;
  }

  return JSON.parse(Buffer.from(parts[1], "base64").toString());
}

export function getTokenExpiration(token: string): number | undefined {
  const payload = parseToken(token);

  if (payload && payload.exp) {
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
