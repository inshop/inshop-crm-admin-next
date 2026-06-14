import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { renderWithProviders } from "@/test/render";

describe("ChangePasswordDialog", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows mismatch error", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordDialog open onClose={() => undefined} />);

    await user.type(screen.getByLabelText(/new password/i), "secret-one");
    await user.type(screen.getByLabelText(/confirm password/i), "secret-two");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("submits successfully and closes", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<ChangePasswordDialog open onClose={onClose} />);

    await user.type(screen.getByLabelText(/new password/i), "new-password");
    await user.type(screen.getByLabelText(/confirm password/i), "new-password");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
