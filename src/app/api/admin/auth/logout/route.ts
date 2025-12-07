import { NextResponse } from 'next/server'

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

export async function POST() {
  try {
    await fetch(`${BACKEND_BASE_URL}/api/admin/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    // Ignore errors from backend logout
  }

  const res = NextResponse.json({ success: true }, { status: 200 })

  // remove cookie
  res.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return res
}
