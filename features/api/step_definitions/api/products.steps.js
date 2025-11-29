import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FakestoreAPI } from '../../../../pages/api/fakestore.api.js';

const api = new FakestoreAPI();

// Product-related steps only
Given('que existe el producto con id {int}', async function (id) {
    const res = await api.getProduct(id);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(id);
    this._api_last = res;
});

When('hago una petición GET a {string}', async function (path) {
    if (!path.startsWith('/')) path = '/' + path;
    const res = await api.request(path);
    this._api_last = res;
});

Then('el código HTTP debería ser {int}', async function (expectedStatus) {
    const entry = this._api_last;
    const status = entry?.status ?? entry?.res?.status;
    expect(status).toBe(expectedStatus);
});

Then('la respuesta debería contener una lista no vacía de productos con campos básicos', async function () {
    const res = this._api_last;
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const sample = res.body[0];
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('title');
    expect(sample).toHaveProperty('price');
});

Then('la respuesta debería contener los campos {string}, {string} y {string}', async function (f1, f2, f3) {
    const res = this._api_last;
    expect(res.body).toHaveProperty(f1);
    expect(res.body).toHaveProperty(f2);
    expect(res.body).toHaveProperty(f3);
});

Then('la respuesta debería contener al menos una categoría', async function () {
    const res = this._api_last;
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
});

Then('todos los productos de la respuesta deberían pertenecer a la categoría {string}', async function (expectedCategory) {
    const res = this._api_last;
    expect(Array.isArray(res.body)).toBe(true);
    for (const p of res.body) {
        expect(p).toHaveProperty('category');
        expect(String(p.category).toLowerCase()).toBe(expectedCategory.toLowerCase());
    }
});
