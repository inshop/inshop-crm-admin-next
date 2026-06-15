// @vitest-environment node

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookiesMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

describe("logout route", () => {
  beforeEach(() => {
    process.env.BACKEND_BASE_URL = "http://backend.test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })));
    cookiesMock.mockResolvedValue({
      get: (name: string) =>
        name === "refreshToken" ? { value: "refresh-token" } : undefined,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("clears auth cookies", async () => {
    const { POST } = await import("@/app/api/admin/auth/logout/route");
    const req = new NextRequest("http://localhost/api/admin/auth/logout", {
      method: "POST",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.cookies.get("token")?.value).toBe("");
    expect(res.cookies.get("refreshToken")?.value).toBe("");
  });
});
