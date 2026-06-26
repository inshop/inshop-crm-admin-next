import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormField from "@/components/FormField";
import { renderWithProviders } from "@/test/render";

describe("FormField", () => {
  it("renders text field by default", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <FormField config={{ name: "name" }} value="" onChange={onChange} />,
    );

    const input = screen.getByLabelText("Name");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "Acme");
    expect(onChange).toHaveBeenCalled();
  });

  it("marks required text fields", () => {
    renderWithProviders(
      <FormField
        config={{ name: "name", required: true }}
        value=""
        onChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText(/Name/)).toBeRequired();
  });

  it("renders password field", () => {
    renderWithProviders(
      <FormField
        config={{ name: "password", type: "password" }}
        value=""
        onChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("renders boolean checkbox", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <FormField
        config={{ name: "isActive", type: "boolean" }}
        value={false}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("isActive", true);
  });
});
