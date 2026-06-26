import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DialogCreate from "@/components/DialogCreate";
import { renderWithProviders } from "@/test/render";

const triggerMock = vi.fn();

vi.mock("@/lib/redux/features/apiTokens", () => ({
  useApiTokensControllerCreateMutation: () => [
    triggerMock,
    { isLoading: false },
  ],
}));

describe("DialogCreate plainToken", () => {
  beforeEach(() => {
    triggerMock.mockReset();
  });

  it("shows one-time token alert when create response includes plainToken", async () => {
    triggerMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          id: 1,
          name: "CI token",
          plainToken: "ff_test_secret_token",
          project: { code: "my-app" },
          environment: { code: "staging" },
        }),
    });

    const handleClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <DialogCreate
        entity="apiToken"
        fields={[{ name: "name", required: true }]}
        open
        handleClose={handleClose}
      />,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "CI token");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/copy this token now/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("ff_test_secret_token")).toBeInTheDocument();
    expect(screen.getByText(/example usage/i)).toBeInTheDocument();
    expect(
      screen.getByText(/feature-flags\/bootstrap\?project=my-app&environment=staging/),
    ).toBeInTheDocument();
    expect(handleClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /done/i }));
    expect(handleClose).toHaveBeenCalled();
  });
});
