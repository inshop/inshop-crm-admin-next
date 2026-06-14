// @vitest-environment node

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const makeToken = (exp: number) => {
  const payload = Buffer.from(JSON.stringify({ id: 1, exp }))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `header.${payload}.signature`;
};

describe("login route", () => {
  beforeEach(() => {
    process.env.BACKEND_BASE_URL = "http://backend.test";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 400 for invalid payload", async () => {
    const { POST } = await import("@/app/api/admin/auth/login/route");
    const req = new NextRequest("http://localhost/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: 1, password: true }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("proxies backend errors", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }),
    );

    const { POST } = await import("@/app/api/admin/auth/login/route");
    const req = new NextRequest("http://localhost/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "x" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("sets auth cookies on success", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = makeToken(exp);

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ token, refreshToken: token }), {
        status: 200,
      }),
    );

    const { POST } = await import("@/app/api/admin/auth/login/route");
    const req = new NextRequest("http://localhost/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "x" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.cookies.get("token")?.value).toBe(token);
    expect(res.cookies.get("refreshToken")?.value).toBe(token);
  });
});
