import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
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
        roles: ["ROLE_PROJECT_CREATE", "ROLE_USER_LIST"],
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.user?.email).toBe("admin@example.com");
    });

    expect(result.current.hasRole("ROLE_PROJECT_CREATE")).toBe(true);
    expect(result.current.canCreate("project")).toBe(true);
    expect(result.current.canList("user")).toBe(true);
    expect(result.current.canDelete("project")).toBe(false);
  });

  it("returns false for permissions when user is missing", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.canCreate("project")).toBe(false);
  });

  it("maps apiToken entity to API_TOKEN roles", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        roles: ["ROLE_API_TOKEN_LIST", "ROLE_API_TOKEN_CREATE"],
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.user?.email).toBe("admin@example.com");
    });

    expect(result.current.canList("apiToken")).toBe(true);
    expect(result.current.canCreate("apiToken")).toBe(true);
    expect(result.current.canDelete("apiToken")).toBe(false);
  });

  it("login() updates user immediately and persists to localStorage", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    expect(result.current.user).toBeNull();

    const userData = {
      id: 2,
      name: "Test User",
      email: "test@example.com",
      roles: ["ROLE_PROJECT_LIST"],
    };

    act(() => {
      result.current.login(userData);
    });

    expect(result.current.user).toEqual(userData);
    expect(result.current.canList("project")).toBe(true);
    expect(JSON.parse(localStorage.getItem("auth_user")!)).toEqual(userData);
  });

  it("logout() clears user immediately and removes from localStorage", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        roles: ["ROLE_PROJECT_CREATE"],
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });
});
