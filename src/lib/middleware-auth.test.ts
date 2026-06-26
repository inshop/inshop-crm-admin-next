import { describe, expect, it } from "vitest";
import { isPublicPath, shouldRedirectToLogin } from "@/lib/middleware-auth";

describe("middleware auth", () => {
  it("treats root as public", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(shouldRedirectToLogin("/", undefined)).toBe(false);
  });

  it("redirects protected paths without token", () => {
    expect(shouldRedirectToLogin("/feature-flags", undefined)).toBe(true);
  });

  it("allows protected paths with token", () => {
    expect(shouldRedirectToLogin("/feature-flags", "token-value")).toBe(false);
  });
});
