import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    await fetch(`${BACKEND_BASE_URL}/api/admin/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {}

  const res = NextResponse.json({ success: true }, { status: 200 });

  res.cookies.delete("token");
  res.cookies.delete("refreshToken");

  return res;
}
