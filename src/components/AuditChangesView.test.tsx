import { render, screen } from "@testing-library/react";
import { AuditChangesView } from "@/components/AuditChangesView";

describe("AuditChangesView", () => {
  it("renders partial update diffs when only old or new is stored", () => {
    render(
      <AuditChangesView
        action="update"
        changes={{
          tokenHash: { old: "abc123" },
          plainToken: { new: "ff_secret" },
        }}
      />,
    );

    expect(screen.getByText("TokenHash")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
    expect(screen.getByText("PlainToken")).toBeInTheDocument();
    expect(screen.getByText("ff_secret")).toBeInTheDocument();
    expect(screen.queryByText("[object Object]")).not.toBeInTheDocument();
  });
});
