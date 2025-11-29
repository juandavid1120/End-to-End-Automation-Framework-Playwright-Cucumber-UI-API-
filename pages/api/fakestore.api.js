/**
 * Simple API client for FakeStore (https://fakestoreapi.com)
 * Provides a small set of methods used by API tests.
 * Uses the global `fetch` available in recent Node.js versions.
 */
export class FakestoreAPI {
    constructor(baseUrl = process.env.FAKESTORE_BASE || 'https://fakestoreapi.com') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    async request(path, options = {}) {
        const url = this.baseUrl + path;
        const res = await fetch(url, options);
        const text = await res.text();
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
        return { status: res.status, headers: res.headers, body };
    }

    // GET /products
    async getProducts() {
        return this.request('/products');
    }

    // GET /products/:id
    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // GET /products/categories
    async getCategories() {
        return this.request('/products/categories');
    }

    // GET /products/category/:category
    async getProductsByCategory(category) {
        return this.request(`/products/category/${encodeURIComponent(category)}`);
    }

    // POST /carts - simple cart creation
    async createCart(payload) {
        return this.request('/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    }

    // PUT /carts/:id - update cart
    async updateCart(id, payload) {
        return this.request(`/carts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    }

    // POST /auth/login - simple auth (returns token on fakestore)
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
    }
}

export default FakestoreAPI;
