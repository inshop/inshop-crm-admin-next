import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const userAgent = req.headers.get("user-agent");
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  try {
    await fetch(`${BACKEND_BASE_URL}/api/admin/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userAgent ? { "User-Agent": userAgent } : {}),
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {}

  const res = NextResponse.json({ success: true }, { status: 200 });

  res.cookies.delete("token");
  res.cookies.delete("refreshToken");

  return res;
}
