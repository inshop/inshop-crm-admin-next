import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ message: 'Invalid credentials payload' }, { status: 400 })
    }

    const resp = await fetch(`${BACKEND_BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return NextResponse.json({ message: 'Login failed' }, { status: resp.status })
    }

    const token = data?.token
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ message: 'Invalid response: no token provided' }, { status: 500 })
    }

    const res = NextResponse.json({ success: true })

    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })

    return res
  } catch {
    return NextResponse.json({ message: 'Unexpected error' }, { status: 500 })
  }
}

