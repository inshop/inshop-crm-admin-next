import { describe, expect, it } from "vitest";
import { getTokenExpiration, parseToken, setCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

function makeToken(payload: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${encoded}.signature`;
}

describe("auth utils", () => {
  describe("parseToken", () => {
    it("parses a valid jwt payload", () => {
      const token = makeToken({ id: 1, email: "user@example.com" });
      expect(parseToken(token)).toEqual({
        id: 1,
        email: "user@example.com",
      });
    });

    it("returns undefined for malformed token", () => {
      expect(parseToken("not-a-jwt")).toBeUndefined();
    });

    it("returns undefined for invalid base64 payload", () => {
      expect(parseToken("a.!!!.c")).toBeUndefined();
    });
  });

  describe("getTokenExpiration", () => {
    it("returns seconds until expiration", () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = makeToken({ exp });

      const remaining = getTokenExpiration(token);
      expect(remaining).toBeGreaterThan(3590);
      expect(remaining).toBeLessThanOrEqual(3600);
    });

    it("returns undefined when exp is missing", () => {
      expect(getTokenExpiration(makeToken({ id: 1 }))).toBeUndefined();
    });
  });

  describe("setCookie", () => {
    it("sets maxAge from token exp", () => {
      const exp = Math.floor(Date.now() / 1000) + 1800;
      const token = makeToken({ exp });
      const response = NextResponse.json({ ok: true });

      setCookie(response, "token", token);

      const cookie = response.cookies.get("token");
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.maxAge).toBeGreaterThan(1790);
    });
  });
});
