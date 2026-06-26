import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "@/app/(auth)/(signin)/form";
import { renderWithProviders } from "@/test/render";

const replaceMock = vi.fn();
const loginMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/lib/redux/features/auth", () => ({
  useAuthControllerLoginMutation: () => [
    (args: { loginAuthDto: { email: string; password: string } }) => ({
      unwrap: () => loginMock(args),
    }),
  ],
}));

describe("Sign-in form", () => {
  beforeEach(() => {
    localStorage.clear();
    replaceMock.mockReset();
    loginMock.mockImplementation(({ loginAuthDto }) => {
      if (loginAuthDto.password === "password") {
        return Promise.resolve({
          user: {
            id: 1,
            name: "Admin",
            email: "admin@example.com",
            roles: ["ROLE_FEATURE_FLAG_LIST"],
          },
        });
      }

      return Promise.reject({ data: { message: "Login failed" } });
    });
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Form />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Password cannot be empty."),
    ).toBeInTheDocument();
  });

  it("stores user and redirects on successful login", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/feature-flags");
    });

    const stored = JSON.parse(localStorage.getItem("auth_user") || "{}");
    expect(stored.email).toBe("admin@example.com");
  });

  it("shows API error message", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Form />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Login failed")).toBeInTheDocument();
  });
});
