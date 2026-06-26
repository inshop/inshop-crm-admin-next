import { describe, expect, it } from "vitest";
import { buildApiTokenCurlExamples } from "@/lib/api-token-curl-examples";

describe("buildApiTokenCurlExamples", () => {
  it("builds bootstrap and single-flag curls with environment code", () => {
    const result = buildApiTokenCurlExamples(
      "ff_test_token",
      "staging",
      "http://localhost:4000",
    );

    expect(result).toContain(
      'curl -s "http://localhost:4000/api/feature-flags/bootstrap?project=YOUR_PROJECT_CODE&environment=staging"',
    );
    expect(result).toContain('Authorization: Bearer ff_test_token');
    expect(result).toContain(
      'curl -s "http://localhost:4000/api/feature-flags/checkout?project=YOUR_PROJECT_CODE&environment=staging"',
    );
  });
});
