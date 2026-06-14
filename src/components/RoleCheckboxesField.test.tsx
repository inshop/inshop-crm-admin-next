import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoleCheckboxesField from "@/components/RoleCheckboxesField";
import { renderWithProviders } from "@/test/render";

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

    expect(await screen.findByText("clients")).toBeInTheDocument();
    expect(screen.getByText("Client List")).toBeInTheDocument();
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

    const checkbox = await screen.findByRole("checkbox", { name: /client list/i });
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
});
