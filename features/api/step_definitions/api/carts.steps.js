import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FakestoreAPI } from '../../../../pages/api/fakestore.api.js';

const api = new FakestoreAPI();

When('creo un carrito con payload válido', async function () {
    const payload = {
        userId: 1,
        date: new Date().toISOString(),
        products: [
            { productId: 1, quantity: 1 }
        ]
    };

    const res = await api.createCart(payload);
    this._api_last = { res, payload };
});

Given('que creo un carrito con payload válido', async function () {
    // helper used by update scenario
    const payload = {
        userId: 1,
        date: new Date().toISOString(),
        products: [
            { productId: 1, quantity: 1 }
        ]
    };
    const res = await api.createCart(payload);
    this._api_last = { res, payload };
});

When('actualizo el carrito con el id devuelto por la creación con un nuevo payload', async function () {
    const entry = this._api_last;
    const cartId = entry?.res?.body?.id;
    if (!cartId) throw new Error('No cart id found from previous step');

    const newPayload = {
        userId: 1,
        date: new Date().toISOString(),
        products: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ]
    };

    const res = await api.updateCart(cartId, newPayload);
    this._api_last = { res, payload: newPayload };
});

Then('la respuesta debería contener un id de carrito y los productos enviados', async function () {
    const entry = this._api_last;
    const res = entry.res;
    const payload = entry.payload;
    // Accept any 2xx success status (201 is expected for creation)
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    const sentIds = payload.products.map(p => p.productId);
    const returnedIds = res.body.products.map(p => p.productId);
    const intersection = returnedIds.filter(id => sentIds.includes(id));
    expect(intersection.length).toBeGreaterThan(0);
});

Then('la respuesta debería reflejar los cambios en los productos del carrito', async function () {
    const entry = this._api_last;
    const res = entry.res;
    const payload = entry.payload;

    // Accept any 2xx success status for update
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.body).toHaveProperty('products');
    const returned = res.body.products;
    const sentIds = payload.products.map(p => p.productId);
    for (const p of returned) {
        expect(sentIds.includes(p.productId)).toBeTruthy();
    }
});
