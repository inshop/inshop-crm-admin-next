import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/lib/auth";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

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
