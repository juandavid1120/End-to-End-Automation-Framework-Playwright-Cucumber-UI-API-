import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FakestoreAPI } from '../../../../pages/api/fakestore.api.js';

const api = new FakestoreAPI();

When('hago una petición POST a {string} con usuario {string} y contraseña {string}', async function (path, username, password) {
    if (!path.startsWith('/')) path = '/' + path;
    const res = await api.login({ username, password });
    this._api_last = res;
});

Then('la respuesta debería contener un token', async function () {
    const res = this._api_last;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
});

Then('la respuesta debería contener un mensaje de error', async function () {
    const res = this._api_last;
    // Esperamos que el status no sea 2xx y que el body contenga alguna indicación de error
    expect(res.status).not.toBe(200);

    const body = res.body;
    if (!body) {
        throw new Error('Respuesta sin body, se esperaba mensaje de error');
    }

    // Cuando el body es objeto buscar keys comunes, si es string validar no vacío
    if (typeof body === 'string') {
        expect(body.length).toBeGreaterThan(0);
    } else if (typeof body === 'object') {
        const hasError = 'error' in body || 'message' in body || 'msg' in body;
        expect(hasError).toBeTruthy();
    } else {
        // Fallback: aceptar cualquier tipo no vacío
        expect(Boolean(body)).toBeTruthy();
    }
});
