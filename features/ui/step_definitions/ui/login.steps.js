// features/ui/step_definitions/ui/login.steps.js
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/ui/login.page.js';
import { InventoryPage } from '../../../../pages/ui/inventory.page.js';
import { UI_ROUTES } from '../../../../config/ui_routes.js';

Given('que estoy en la página de login de SauceDemo', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await expect(this.page).toHaveURL(new RegExp(UI_ROUTES.baseUrl.replace('.', '\\.') + '/?$'));
});

Given('he iniciado sesión como {string} con contraseña {string}', async function (username, password) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(username, password);
  // Ensure we're on inventory page
  await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.inventory.replace('.', '\\.')}$`));
});

When('ingreso el usuario {string} y la contraseña {string}', async function (username, password) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);
});

Then('debería ser redirigido a la página de inventario', async function () {
  const inventoryPage = new InventoryPage(this.page);

  await expect(this.page).toHaveURL(
    new RegExp(`${UI_ROUTES.inventory.replace('.', '\\.')}$`),
  );

  await expect(inventoryPage.title).toHaveText('Products');
  await expect(inventoryPage.cartIcon).toBeVisible();
});

Then('debería ver un mensaje de error de credenciales incorrectas', async function () {
  const loginPage = new LoginPage(this.page);
  await expect(loginPage.errorMessage).toBeVisible();

  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain('Username and password do not match');
});

Then('debería ver un mensaje de error de usuario bloqueado', async function () {
  const loginPage = new LoginPage(this.page);
  await expect(loginPage.errorMessage).toBeVisible();

  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain('this user has been locked out');
});

Given('que NO he iniciado sesión en SauceDemo', async function () {
  // Asegurarnos de que no hay sesión activa
  await this.page.context().clearCookies();
  await this.page.goto('about:blank'); // Limpiar página actual
});

When('intento acceder directamente a la página de inventario', async function () {
  // Intentar acceder directamente sin pasar por login
  await this.page.goto(UI_ROUTES.baseUrl + UI_ROUTES.inventory);
});

Then('debería ser redirigido a la página de login', async function () {
  await expect(this.page).toHaveURL(
    new RegExp(`${UI_ROUTES.baseUrl.replace('.', '\\.')}/?$`),
  );
  await expect(this.page).not.toHaveURL(new RegExp(`${UI_ROUTES.inventory}$`));
});

Then('debería ver un mensaje indicando que debo iniciar sesión', async function () {
  const loginPage = new LoginPage(this.page);

  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();

  await expect(this.page).toHaveURL(
    new RegExp(`${UI_ROUTES.baseUrl.replace('.', '\\.')}/?$`),
  );
});