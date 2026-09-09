import { test, expect } from "@playwright/test";

test.describe("Flujo de Inventario", () => {
  const testEmail = process.env.E2E_TEST_EMAIL || "<CORREO_DE_PRUEBA>";
  const testPassword = process.env.E2E_TEST_PASSWORD || "<CONTRASEÑA_DE_PRUEBA>";

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("login y crear producto", async ({ page }) => {
    await page.fill("[data-testid=email]", testEmail);
    await page.fill("[data-testid=password]", testPassword);
    await page.click("[data-testid=login-btn]");
    await expect(page).toHaveURL(/dashboard/);
    await page.click("text=Productos");
    await expect(page.locator("h1")).toContainText("Lista de Productos");
  });

  test("validacion de precio negativo", async ({ page }) => {
    await page.click("[data-testid=new-product]");
    await page.fill("[data-testid=nombre]", "Test");
    await page.fill("[data-testid=precio]", "-50");
    await page.click("[data-testid=save]");
    await expect(page.locator(".error")).toContainText(/precio/i);
  });

  test("screenshot del dashboard", async ({ page }) => {
    await page.screenshot({ path: "screenshots/dashboard.png", fullPage: true });
  });
});
