export function getPublicApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:4000";
}

export function buildApiTokenCurlExamples(
  token: string,
  projectCode: string,
  environmentCode: string,
  baseUrl = getPublicApiBaseUrl(),
): string {
  const authHeader = `Authorization: Bearer ${token}`;
  const query = `project=${encodeURIComponent(projectCode)}&environment=${encodeURIComponent(environmentCode)}`;

  return `# Bootstrap all active flags
curl -s "${baseUrl}/api/feature-flags/bootstrap?${query}" \\
  -H "${authHeader}"

# Single flag (replace checkout with your flag code)
curl -s "${baseUrl}/api/feature-flags/checkout?${query}" \\
  -H "${authHeader}"`;
}
