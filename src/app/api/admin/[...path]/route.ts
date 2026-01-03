import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {setCookie} from "@/lib/auth";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || '';

async function attemptRefresh(refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
  const refreshUrl = `${BACKEND_BASE_URL.replace(/\/$/, "")}/api/admin/auth/refresh`;

  try {
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({refreshToken}),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return null;
}

async function handle(req: NextRequest, params?: { path?: string[] }) {
  try {
    const incomingUrl = new URL(req.url);
    const backendUrl = `${BACKEND_BASE_URL.replace(/\/$/, "")}${incomingUrl.pathname}${incomingUrl.search}`;
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value || undefined;
    const headers: Record<string, string> = {};

    headers["Authorization"] = `Bearer ${token}`;

    let body: BodyInit | undefined = undefined;
    const method = req.method.toUpperCase();

    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer && arrayBuffer.byteLength > 0) {
        body = arrayBuffer;
      }
    }

    const backendRes = await fetch(backendUrl, {method, headers, body});

    if (backendRes.status === 401) {
      const refreshToken = cookieStore.get("refreshToken")?.value || undefined;

      if (!refreshToken) {
        return NextResponse.json({message: "Can't refresh token"}, {status: 502});
      }

      const refreshed = await attemptRefresh(refreshToken);

      if (refreshed && refreshed.token && refreshed.refreshToken) {
        headers["Authorization"] = `Bearer ${refreshed.token}`;

        const backendRes = await fetch(backendUrl, {method, headers, body});
        const resBody = await backendRes.arrayBuffer();
        const response = new NextResponse(resBody, {status: backendRes.status});

        setCookie(response, "token", refreshed.token);
        setCookie(response, "refreshToken", refreshed.refreshToken);

        return response;
      }

      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const resBody = await backendRes.arrayBuffer();

    return new NextResponse(resBody, {status: backendRes.status});
  } catch (err) {
    return NextResponse.json({message: "Backend fetch error"}, {status: 502});
  }
}

export async function GET(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}

export async function POST(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}

export async function OPTIONS(req: NextRequest, context: { params: { path: string[] } }) {
  return handle(req, context.params);
}
