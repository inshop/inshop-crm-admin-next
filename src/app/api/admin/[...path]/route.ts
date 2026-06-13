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
  } catch {
    // refresh failed
  }

  return null;
}

async function handle(req: NextRequest) {
  try {
    const incomingUrl = new URL(req.url);
    const backendUrl = `${BACKEND_BASE_URL.replace(/\/$/, "")}${incomingUrl.pathname}${incomingUrl.search}`;
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const contentType = req.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

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
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (!refreshToken) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
      }

      const refreshed = await attemptRefresh(refreshToken);

      if (refreshed && refreshed.token && refreshed.refreshToken) {
        headers["Authorization"] = `Bearer ${refreshed.token}`;

        const retryRes = await fetch(backendUrl, {method, headers, body});
        const resBody = await retryRes.arrayBuffer();
        const response = new NextResponse(resBody, {
          status: retryRes.status,
          headers: {"Content-Type": retryRes.headers.get("Content-Type") || "application/json"},
        });

        setCookie(response, "token", refreshed.token);
        setCookie(response, "refreshToken", refreshed.refreshToken);

        return response;
      }

      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const resBody = await backendRes.arrayBuffer();

    return new NextResponse(resBody, {
      status: backendRes.status,
      headers: {"Content-Type": backendRes.headers.get("Content-Type") || "application/json"},
    });
  } catch {
    return NextResponse.json({message: "Backend fetch error"}, {status: 502});
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function PUT(req: NextRequest) {
  return handle(req);
}

export async function PATCH(req: NextRequest) {
  return handle(req);
}

export async function DELETE(req: NextRequest) {
  return handle(req);
}

export async function OPTIONS(req: NextRequest) {
  return handle(req);
}
