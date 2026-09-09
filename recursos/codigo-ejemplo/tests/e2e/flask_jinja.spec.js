import { test, expect } from "@playwright/test";

test.describe("Inventario Flask y Jinja", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/productos");
  });

  test("renderiza la lista inicial desde una plantilla Jinja", async ({ page }) => {
    await expect(page).toHaveTitle(/Productos \| Inventario/);
    await expect(page.getByRole("heading", { name: "Productos" })).toBeVisible();
    await expect(page.getByTestId("lista-productos")).toContainText("No hay productos");
  });

  test("crea un producto y sigue el redirect de Flask", async ({ page }) => {
    await page.getByLabel("Nombre").fill("Teclado");
    await page.getByLabel("Precio").fill("45");
    await page.getByRole("button", { name: "Guardar producto" }).click();

    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.getByRole("status")).toContainText("Producto creado");
    await expect(page.getByTestId("producto-row")).toContainText("Teclado");
  });

  test("muestra el error del servidor para un precio invalido", async ({ page }) => {
    await page.getByLabel("Nombre").fill("Producto de prueba");
    await page.getByLabel("Precio").fill("-5");
    await page.getByRole("button", { name: "Guardar producto" }).click();

    await expect(page.getByRole("alert")).toContainText(/mayor que cero/i);
    await expect(page.getByTestId("lista-productos")).toContainText("No hay productos");
  });
});
