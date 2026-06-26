import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/admin/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === "admin@example.com" && body.password === "password") {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const payload = Buffer.from(
        JSON.stringify({
          id: 1,
          name: "Admin",
          email: "admin@example.com",
          roles: ["ROLE_PROJECT_LIST"],
          exp,
        }),
      )
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const token = `header.${payload}.signature`;

      return HttpResponse.json({
        success: true,
        user: {
          id: 1,
          name: "Admin",
          email: "admin@example.com",
          roles: ["ROLE_PROJECT_LIST"],
        },
        token,
        refreshToken: token,
      });
    }

    return HttpResponse.json({ message: "Login failed" }, { status: 401 });
  }),

  http.get("/api/admin/modules", () => {
    return HttpResponse.json([[{ id: 1, name: "projects" }], 1]);
  }),

  http.get("/api/admin/modules/:moduleId/roles", () => {
    return HttpResponse.json([
      { id: 10, name: "ROLE_PROJECT_LIST" },
      { id: 11, name: "ROLE_PROJECT_CREATE" },
    ]);
  }),

  http.get("/api/admin/projects", () => {
    return HttpResponse.json([[], 0]);
  }),

  http.post("/api/admin/auth/change-password", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
