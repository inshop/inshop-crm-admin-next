import { beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FeatureFlagsFilters from "@/app/(dashboard)/feature-flags/FeatureFlagsFilters";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/mocks/server";

const environments = [
  { id: 1, name: "Dev", code: "dev" },
  { id: 2, name: "Prod", code: "prod" },
];

function ControlledFilters({
  initialFilters = {},
}: {
  initialFilters?: Record<string, string>;
}) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <FeatureFlagsFilters
      filters={filters}
      onChange={setFilters}
      environments={environments}
    />
  );
}

function renderFilters(
  props: Partial<React.ComponentProps<typeof FeatureFlagsFilters>> = {},
) {
  const onChange = props.onChange ?? vi.fn();

  return {
    onChange,
    ...renderWithProviders(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FeatureFlagsFilters
          filters={props.filters ?? {}}
          onChange={onChange}
          environments={props.environments ?? environments}
        />
      </LocalizationProvider>,
    ),
  };
}

describe("FeatureFlagsFilters", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/admin/users", () => {
        return HttpResponse.json([[{ id: 1, name: "Admin" }], 1]);
      }),
    );
  });

  it("renders text, date, and autocomplete fields", () => {
    renderFilters();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose date" })).toBeInTheDocument();
    expect(screen.getByLabelText("Created by")).toBeInTheDocument();
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.getByText("Prod")).toBeInTheDocument();
  });

  it("updates name filter on input", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ControlledFilters />
      </LocalizationProvider>,
    );

    const nameInput = screen.getByLabelText("Name");
    await user.type(nameInput, "checkout");

    expect(nameInput).toHaveValue("checkout");
  });

  it("updates env filter when enabled toggle is selected", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilters();

    await user.click(
      screen.getByRole("button", { name: "Dev enabled" }),
    );

    expect(onChange).toHaveBeenCalledWith({ env_1: "true" });
  });

  it("clears env filter when the same toggle is clicked again", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilters({
      filters: { env_1: "true" },
    });

    await user.click(screen.getByRole("button", { name: "Dev enabled" }));

    expect(onChange).toHaveBeenCalledWith({ env_1: "" });
  });

  it("clears all filters", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderFilters({
      onChange,
      filters: { name: "foo", env_1: "true" },
    });

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(onChange).toHaveBeenCalledWith({});
  });
});
