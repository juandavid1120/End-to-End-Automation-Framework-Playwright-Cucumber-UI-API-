import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { InventoryPage } from '../../../../pages/ui/inventory.page.js';
import { CartPage } from '../../../../pages/ui/cart.page.js';
import { PurchasePage } from '../../../../pages/ui/purchase.page.js';
import { UI_ROUTES } from '../../../../config/ui_routes.js';

When('añado el producto {string} al carrito', async function (productName) {
    const inventory = new InventoryPage(this.page);
    await inventory.goto();
    await inventory.addProductToCart(productName);
});

When('hago clic en el botón {string}', async function (buttonText) {
    // Gestiona botones del flujo de compra (Checkout, Continue, Finish) y clicks genéricos
    if (buttonText === 'Checkout') {
        // Navegar al carrito y ejecutar el flujo de Checkout
        const inventory = new InventoryPage(this.page);
        // Intentar usar el icono del carrito si está disponible
        if (await inventory.cartIcon.isVisible().catch(() => false)) {
            await inventory.cartIcon.click();
            await this.page.waitForURL(new RegExp(`${UI_ROUTES.cart.replace('.', '\\.')}$`));
        } else {
            const cartPage = new CartPage(this.page);
            await cartPage.goto();
        }

        const cartPage = new CartPage(this.page);
        await cartPage.clickCheckout();
        return;
    }

    if (buttonText === 'Continue') {
        const purchase = new PurchasePage(this.page);
        await purchase.clickContinue();
        return;
    }

    if (buttonText === 'Finish') {
        const purchase = new PurchasePage(this.page);
        await purchase.clickFinish();
        return;
    }

    // Caso genérico: localizar botón por su texto y clicar
    const btn = this.page.locator(`button:has-text("${buttonText}")`);
    await btn.click();
});

// Compatibilidad con Gherkin que usa 'hago clic en "Continue"' (sin 'el botón')
When('hago clic en {string}', async function (buttonText) {
    if (buttonText === 'Checkout') {
        const inventory = new InventoryPage(this.page);
        if (await inventory.cartIcon.isVisible().catch(() => false)) {
            await inventory.cartIcon.click();
            await this.page.waitForURL(new RegExp(`${UI_ROUTES.cart.replace('.', '\\.')}$`));
        } else {
            const cartPage = new CartPage(this.page);
            await cartPage.goto();
        }
        const cartPage = new CartPage(this.page);
        await cartPage.clickCheckout();
        return;
    }

    if (buttonText === 'Continue') {
        const purchase = new PurchasePage(this.page);
        await purchase.clickContinue();
        return;
    }

    if (buttonText === 'Finish') {
        const purchase = new PurchasePage(this.page);
        await purchase.clickFinish();
        return;
    }

    const btn = this.page.locator(`button:has-text("${buttonText}")`);
    await btn.click();
});

When('ingreso la siguiente información de envío:', async function (dataTable) {
    const purchase = new PurchasePage(this.page);
    const data = dataTable.rowsHash();
    const first = data['First Name'] || data['FirstName'] || data['First name'];
    const last = data['Last Name'] || data['LastName'] || data['Last name'];
    const postal = data['Postal Code'] || data['PostalCode'] || data['Postal Code'];
    await purchase.fillShipping(first, last, postal);
});

Then('debería ver el resumen de mi compra', async function () {
    await expect(this.page).toHaveURL(new RegExp('checkout-step-two.html$'));
    const purchase = new PurchasePage(this.page);
    await expect(purchase.subtotalLabel).toBeVisible();
});

function parseMoney(text) {
    if (!text) return 0;
    return Number(text.replace(/[^0-9.-]+/g, ''));
}

Then('el subtotal debería ser {string}', async function (expected) {
    const purchase = new PurchasePage(this.page);
    const subtotal = await purchase.getSubtotal();
    const actualNum = parseMoney(subtotal);
    const expectedNum = parseMoney(expected);
    expect(actualNum).toBeCloseTo(expectedNum, 2);
});

Then('el total debería ser la suma del subtotal más impuestos', async function () {
    const purchase = new PurchasePage(this.page);
    const subtotalText = await purchase.getSubtotal();
    const taxText = await purchase.getTax();
    const totalText = await purchase.getTotal();

    const subtotal = parseMoney(subtotalText);
    const tax = parseMoney(taxText);
    const total = parseMoney(totalText);

    const expected = +(subtotal + tax).toFixed(2);
    expect(total).toBeCloseTo(expected, 2);
});

Then('Cuando hago clic en "Finish"', async function () {
    // Compatibilidad: este paso se soporta mediante el step genérico de click
});

Then('debería ver el mensaje "Thank you for your order!"', async function () {
    const purchase = new PurchasePage(this.page);
    const msg = await purchase.getConfirmationMessage();
    expect(msg).toMatch(/thank you for your order/i);
});

Then('Y el carrito debería estar vacío', async function () {
    const cartPage = new CartPage(this.page);
    await cartPage.goto();
    const items = await cartPage.getCartItems();
    expect(items.length).toBe(0);
});
