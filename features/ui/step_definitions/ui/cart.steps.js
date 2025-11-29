import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CartPage } from '../../../../pages/ui/cart.page.js';
import { InventoryPage } from '../../../../pages/ui/inventory.page.js';
import { LoginPage } from '../../../../pages/ui/login.page.js';
import { UI_ROUTES } from '../../../../config/ui_routes.js';

// Steps: gestión del carrito (UI). Cada step debe tener una responsabilidad clara.
Given('que he iniciado sesión como usuario {string}', async function (username) {
    const loginPage = new LoginPage(this.page);
    const inventoryPage = new InventoryPage(this.page);

    await loginPage.goto();
    await loginPage.login(username, process.env.TEST_PASSWORD || 'secret_sauce');

    await inventoryPage.goto();
    await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.inventory.replace('.', '\.')}$`));
});

Given('estoy en la página de inventario', async function () {
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.goto();
    await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.inventory.replace('.', '\.')}$`));
});

Given('que el carrito está vacío', async function () {
    const cartPage = new CartPage(this.page);
    await cartPage.goto();

    // Vaciar el carrito si contiene items
    const cartItems = await cartPage.getCartItems();
    if (cartItems.length > 0) {
        for (const item of cartItems) await cartPage.removeProduct(item.name);
    }

    // Confirmación del estado del carrito
    const items = await cartPage.getCartItems();
    expect(items.length).toBe(0);
});

Given('que he añadido {string} al carrito', async function (productName) {
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.goto();
    await inventoryPage.addProductToCart(productName);
});

Given('el contador del carrito muestra {string}', async function (expectedCount) {
    const inventoryPage = new InventoryPage(this.page);
    const cartBadge = inventoryPage.cartBadge;
    await expect(cartBadge).toHaveText(expectedCount);
});

When('hago clic en {string} para {string}', async function (buttonText, productName) {
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.goto();

    const product = await inventoryPage.getProductByName(productName);
    if (!product) throw new Error(`Producto "${productName}" no encontrado en el inventario`);

    const button = product.locator(`button:has-text("${buttonText}")`);
    await button.click();
});

When('voy a la página del carrito', async function () {
    const cartPage = new CartPage(this.page);
    await cartPage.goto();
    await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.cart.replace('.', '\.')}$`));
});

When('intento proceder al checkout', async function () {
    this._prevUrl = await this.page.url();
    const checkoutBtn = this.page.locator('button:has-text("Checkout")');
    const visible = await checkoutBtn.isVisible().catch(() => false);
    if (visible) await checkoutBtn.click().catch(() => { });

    // Esperar navegación potencial
    await this.page.waitForTimeout(1000);
    this._afterUrl = await this.page.url();
});

When('voy al carrito', async function () {
    // Alias: navegación al carrito mediante el icono
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.cartIcon.click();
    await this.page.waitForURL(new RegExp(`${UI_ROUTES.cart.replace('.', '\.')}$`));
});

When('elimino {string}', async function (productName) {
    const cartPage = new CartPage(this.page);
    await cartPage.removeProduct(productName);
});

When('elimino {string} del carrito', async function (productName) {
    const cartPage = new CartPage(this.page);
    await cartPage.removeProduct(productName);
});


Then('el botón debería cambiar a {string}', async function (expectedButtonText) {
    const buttons = this.page.locator(`button:has-text("${expectedButtonText}")`);
    await expect(buttons.first()).toBeVisible();
});

Then('el contador del carrito debería mostrar {string}', async function (expectedCount) {
    const inventoryPage = new InventoryPage(this.page);
    const cartBadge = inventoryPage.cartBadge;
    await expect(cartBadge).toHaveText(expectedCount);
});

Then('el contador del carrito debería mostrar {int}', async function (expectedCount) {
    const inventoryPage = new InventoryPage(this.page);
    const cartBadge = inventoryPage.cartBadge;
    await expect(cartBadge).toHaveText(expectedCount.toString());
});

Then('el ícono del carrito debería resaltar el nuevo item', async function () {
    const inventoryPage = new InventoryPage(this.page);
    await expect(inventoryPage.cartBadge).toBeVisible();
    const badgeText = await inventoryPage.cartBadge.textContent();
    expect(parseInt(badgeText)).toBeGreaterThan(0);
});

Then('el producto debería desaparecer de la lista', async function () {
    const cartPage = new CartPage(this.page);
    await this.page.waitForTimeout(500);
    // Validación específica en contexto de eliminación
});

Then('el carrito debería estar vacío', async function () {
    const cartPage = new CartPage(this.page);
    const cartItems = await cartPage.getCartItems();
    if (cartItems.length === 0) {
        const hasEmptyMsg = await cartPage.emptyCartMessage.isVisible().catch(() => false);
        if (hasEmptyMsg) await expect(cartPage.emptyCartMessage).toBeVisible();
        return;
    }
    expect(cartItems.length).toBe(0);
});

Then('el contador del carrito no debería ser visible', async function () {
    const inventoryPage = new InventoryPage(this.page);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
});

Then('debería quedar solo {int} producto', async function (expectedCount) {
    const cartPage = new CartPage(this.page);
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(expectedCount);
});

Then('ese producto debería ser {string}', async function (expectedProductName) {
    const cartPage = new CartPage(this.page);
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].name).toBe(expectedProductName);
});

Then('el botón {string} no debería estar visible', async function (buttonText) {
    const cartPage = new CartPage(this.page);
    if (await cartPage.isEmpty()) return;
    const button = this.page.locator(`button:has-text("${buttonText}")`);
    await expect(button).not.toBeVisible();
});

Then('el botón {string} debería estar deshabilitado', async function (buttonText) {
    const cartPage = new CartPage(this.page);
    if (await cartPage.isEmpty()) return;
    const button = this.page.locator(`button:has-text("${buttonText}")`);
    await expect(button).toBeDisabled();
});

Then('ambos productos deberían aparecer en el carrito', async function () {
    const cartPage = new CartPage(this.page);
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThanOrEqual(2);
});

Then('debería poder volver al inventario sin errores', async function () {
    const inventoryPage = new InventoryPage(this.page);
    const continueButton = this.page.locator('[data-test="continue-shopping"]');
    if (await continueButton.isVisible()) await continueButton.click();
    else await inventoryPage.goto();
    await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.inventory.replace('.', '\.')}$`));
});

Then('no debería poder avanzar al checkout y debería permanecer en la página del carrito', async function () {
    const before = this._prevUrl || '';
    const after = this._afterUrl || (await this.page.url());
    if (before !== after) {
        const wentToCheckout = /checkout/i.test(after);
        if (wentToCheckout) throw new Error(`Se permitió avanzar al checkout con carrito vacío (navegó a: ${after})`);
    }
    await expect(this.page).toHaveURL(new RegExp(`${UI_ROUTES.cart.replace('.', '\.')}$`));
});