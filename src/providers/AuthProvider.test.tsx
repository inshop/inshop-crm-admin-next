import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes role helpers from stored user", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        roles: ["ROLE_CLIENT_CREATE", "ROLE_USER_LIST"],
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.user?.email).toBe("admin@example.com");
    });

    expect(result.current.hasRole("ROLE_CLIENT_CREATE")).toBe(true);
    expect(result.current.canCreate("client")).toBe(true);
    expect(result.current.canList("user")).toBe(true);
    expect(result.current.canDelete("client")).toBe(false);
  });

  it("returns false for permissions when user is missing", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.canCreate("client")).toBe(false);
  });
});
