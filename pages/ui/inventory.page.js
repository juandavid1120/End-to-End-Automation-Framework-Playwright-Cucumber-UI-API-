// pages/ui/inventory.page.js
import { UI_ROUTES } from '../../config/ui_routes.js';

export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.inventoryItems = page.locator('.inventory_item');
        this.inventoryList = page.locator('.inventory_list');
    }

    async goto() {
        await this.page.goto(UI_ROUTES.baseUrl + UI_ROUTES.inventory);
    }

    /**
     * Obtiene un producto por nombre
     * @param {string} productName - Nombre del producto
     * @returns {Locator} Locator del item del producto
     */
    async getProductByName(productName) {
        // Esperar que el elemento del producto aparezca (evita depender de una lista global)
        const nameLocator = this.page.locator(`.inventory_item .inventory_item_name:has-text("${productName}")`);
        await nameLocator.first().waitFor({ state: 'visible', timeout: 15000 });

        const product = this.page.locator(`.inventory_item:has(.inventory_item_name:has-text("${productName}"))`);

        // Verificar que existe
        const count = await product.count();
        return count > 0 ? product : null;
    }

    /**
     * Añade un producto al carrito por nombre
     * @param {string} productName - Nombre del producto
     */
    async addProductToCart(productName) {
        const product = await this.getProductByName(productName);

        if (!product) {
            throw new Error(`Producto "${productName}" no encontrado`);
        }

        // Buscar el botón "Add to cart" dentro del producto y esperar a que sea clickeable
        const addButton = product.locator('button:has-text("Add to cart")');
        await addButton.waitFor({ state: 'visible', timeout: 10000 });
        await addButton.click();
    }

    /**
     * Obtiene todos los productos del inventario
     * @returns {Array} Array de nombres de productos
     */
    async getAllProducts() {
        const items = await this.inventoryItems.all();
        const products = [];

        for (const item of items) {
            const nameElement = item.locator('.inventory_item_name');
            const name = await nameElement.textContent();
            products.push(name.trim());
        }

        return products;
    }

    /**
     * Verifica si un producto está en el carrito (el botón dice "Remove")
     * @param {string} productName - Nombre del producto
     * @returns {boolean} True si el producto está en el carrito
     */
    async isProductInCart(productName) {
        const product = await this.getProductByName(productName);

        if (!product) {
            return false;
        }

        const removeButton = product.locator('[data-test="remove"]');
        return await removeButton.isVisible();
    }
}