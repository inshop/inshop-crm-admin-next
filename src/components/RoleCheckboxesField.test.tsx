import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import RoleCheckboxesField from "@/components/RoleCheckboxesField";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/mocks/server";

describe("RoleCheckboxesField", () => {
  it("loads modules and roles", async () => {
    renderWithProviders(
      <RoleCheckboxesField
        label="Roles"
        modulesUrl="/api/admin/modules?take=100&skip=0"
        value={[]}
        onChange={() => undefined}
      />,
    );

    expect(await screen.findByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Project List")).toBeInTheDocument();
  });

  it("calls onChange when role is toggled", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <RoleCheckboxesField
        label="Roles"
        modulesUrl="/api/admin/modules?take=100&skip=0"
        value={[]}
        onChange={onChange}
      />,
    );

    const checkbox = await screen.findByRole("checkbox", { name: /project list/i });
    await user.click(checkbox);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([{ id: 10 }]);
    });
  });

  it("does not fetch when disabled", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    renderWithProviders(
      <RoleCheckboxesField
        label="Roles"
        modulesUrl="/api/admin/modules?take=100&skip=0"
        value={[]}
        onChange={() => undefined}
        enabled={false}
      />,
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });

  it("shows error alert when modules fetch fails", async () => {
    server.use(
      http.get("/api/admin/modules", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithProviders(
      <RoleCheckboxesField
        label="Roles"
        modulesUrl="/api/admin/modules?take=100&skip=0"
        value={[]}
        onChange={() => undefined}
      />,
    );

    expect(await screen.findByText("Failed to load roles")).toBeInTheDocument();
  });

  it("formats camelCase module names as title case", async () => {
    server.use(
      http.get("/api/admin/modules", () => {
        return HttpResponse.json([[{ id: 1, name: "featureFlags" }], 1]);
      }),
    );

    renderWithProviders(
      <RoleCheckboxesField
        label="Roles"
        modulesUrl="/api/admin/modules?take=100&skip=0"
        value={[]}
        onChange={() => undefined}
      />,
    );

    expect(await screen.findByText("Feature Flags")).toBeInTheDocument();
  });
});
