// @vitest-environment node

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookiesMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

describe("admin proxy route", () => {
  beforeEach(() => {
    process.env.BACKEND_BASE_URL = "http://backend.test";
    vi.stubGlobal("fetch", vi.fn());
    cookiesMock.mockResolvedValue({
      get: (name: string) => {
        if (name === "token") return { value: "access-token" };
        if (name === "refreshToken") return { value: "refresh-token" };
        return undefined;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("attaches bearer token from cookie", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const { GET } = await import("@/app/api/admin/[...path]/route");
    const req = new NextRequest("http://localhost/api/admin/clients");

    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "http://backend.test/api/admin/clients",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      }),
    );
  });

  it("refreshes token and retries on 401", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response("{}", { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: "new-token", refreshToken: "new-refresh" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify([[], 0]), { status: 200 }));

    const { GET } = await import("@/app/api/admin/[...path]/route");
    const req = new NextRequest("http://localhost/api/admin/clients");

    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(res.cookies.get("token")?.value).toBe("new-token");
  });

  it("returns 401 when refresh fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response("{}", { status: 401 }))
      .mockResolvedValueOnce(new Response("{}", { status: 401 }));

    const { GET } = await import("@/app/api/admin/[...path]/route");
    const req = new NextRequest("http://localhost/api/admin/clients");

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
