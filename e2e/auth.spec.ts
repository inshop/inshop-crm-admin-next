import { test, expect } from "@playwright/test";

test("redirects unauthenticated users from /clients to /", async ({ page }) => {
  await page.goto("/clients");
  await expect(page).toHaveURL("/");
});

test("logs in and reaches clients page", async ({ page }) => {
  await page.route("**/api/admin/auth/login", async (route) => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = Buffer.from(
      JSON.stringify({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        roles: ["ROLE_CLIENT_LIST"],
        exp,
      }),
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const token = `header.${payload}.signature`;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        user: {
          id: 1,
          name: "Admin",
          email: "admin@example.com",
          roles: ["ROLE_CLIENT_LIST"],
        },
        token,
        refreshToken: token,
      }),
      headers: {
        "Set-Cookie": `token=${token}; Path=/; HttpOnly, refreshToken=${token}; Path=/; HttpOnly`,
      },
    });
  });

  await page.route("**/api/admin/clients**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([[], 0]),
    });
  });

  await page.goto("/");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL("/clients");
});
