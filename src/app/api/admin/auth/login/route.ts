import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

function getTokenExpiration(token: string): number | undefined {
  const parts = token.split(".");
  if (parts.length !== 3) return undefined;

  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
  if (payload.exp && typeof payload.exp === "number") {
    return Math.floor((payload.exp * 1000 - Date.now()) / 1000);
  }
}

function setCookie(res: NextResponse, name: string, value: string) {
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

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Invalid credentials payload" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${BACKEND_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: "Login failed" },
        { status: backendRes.status },
      );
    }

    const token = data?.token;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Invalid response: no token provided" },
        { status: 500 },
      );
    }

    const refreshToken = data?.refreshToken;
    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { message: "Invalid response: no refreshToken provided" },
        { status: 500 },
      );
    }

    const res = NextResponse.json({ success: true });

    setCookie(res, "token", token);
    setCookie(res, "refreshToken", refreshToken);

    return res;
  } catch {
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
