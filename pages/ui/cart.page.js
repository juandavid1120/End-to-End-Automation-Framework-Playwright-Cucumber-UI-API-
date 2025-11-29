// pages/ui/cart.page.js
import { UI_ROUTES } from '../../config/ui_routes.js';

export class CartPage {
    constructor(page) {
        this.page = page;

        // Locators principales
        this.cartItemsContainer = page.locator('.cart_contents');
        this.cartItems = page.locator('.cart_item');
        this.emptyCartMessage = page.locator('.empty_message');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    /**
     * Navega a la página del carrito
     */
    async goto() {
        await this.page.goto(UI_ROUTES.baseUrl + UI_ROUTES.cart);
    }

    /**
     * Obtiene la lista de items del carrito como array
     * @returns {Array} Array de objetos con {name, price, quantity}
     */
    async getCartItems() {
        const items = await this.cartItems.all();
        const cartItems = [];

        for (const item of items) {
            const nameElement = item.locator('.inventory_item_name');
            const priceElement = item.locator('.inventory_item_price');
            const quantityElement = item.locator('.cart_quantity');

            const name = await nameElement.textContent();
            const price = await priceElement.textContent();
            const quantity = await quantityElement.textContent();

            cartItems.push({
                name: name.trim(),
                price: price.trim(),
                quantity: quantity.trim(),
                element: item,
            });
        }

        return cartItems;
    }

    /**
     * Elimina un producto del carrito por nombre
     * @param {string} productName - Nombre del producto a eliminar
     */
    async removeProduct(productName) {
        // Buscar el item que contiene el nombre del producto
        const cartItem = this.page.locator(
            `.cart_item:has(.inventory_item_name:has-text("${productName}"))`
        );

        // Esperar a que el item aparezca en la lista
        await cartItem.waitFor({ state: 'visible', timeout: 10000 });

        // Buscar el botón de remove dentro del item y asegurarse que es visible
        const removeButton = cartItem.locator('button:has-text("Remove")');
        await removeButton.waitFor({ state: 'visible', timeout: 10000 });

        // Hacer clic en el botón
        await removeButton.click();
    }

    /**
     * Verifica si el carrito está vacío
     * @returns {boolean} True si está vacío
     */
    async isEmpty() {
        const items = await this.getCartItems();
        return items.length === 0;
    }

    /**
     * Obtiene el total del carrito
     * @returns {string} Texto del total (ej: "$123.45")
     */
    async getTotal() {
        const totalElement = this.page.locator('.summary_total_label');
        return await totalElement.textContent();
    }

    /**
     * Hace clic en el botón de checkout
     */
    async clickCheckout() {
        await this.checkoutButton.click();
    }

    /**
     * Hace clic en "Continue Shopping"
     */
    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }
}