import { describe, expect, it } from "vitest";
import { buildApiTokenCurlExamples } from "@/lib/api-token-curl-examples";

describe("buildApiTokenCurlExamples", () => {
  it("builds bootstrap and single-flag curls with project and environment codes", () => {
    const result = buildApiTokenCurlExamples(
      "ff_test_token",
      "my-app",
      "staging",
      "http://localhost:4000",
    );

    expect(result).toContain(
      'curl -s "http://localhost:4000/api/feature-flags/bootstrap?project=my-app&environment=staging"',
    );
    expect(result).toContain('Authorization: Bearer ff_test_token');
    expect(result).toContain(
      'curl -s "http://localhost:4000/api/feature-flags/checkout?project=my-app&environment=staging"',
    );
  });
});
