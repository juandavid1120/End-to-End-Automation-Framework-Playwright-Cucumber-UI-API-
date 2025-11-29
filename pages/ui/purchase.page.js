import { UI_ROUTES } from '../../config/ui_routes.js';

export class PurchasePage {
    constructor(page) {
        this.page = page;

        // Checkout: information
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');

        // Overview
        this.finishButton = page.locator('[data-test="finish"]');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');

        // Confirmation
        this.confirmationHeader = page.locator('.complete-header');
    }

    async fillShipping(first, last, postal) {
        await this.firstName.fill(first);
        await this.lastName.fill(last);
        await this.postalCode.fill(postal);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }

    async getSubtotal() {
        return (await this.subtotalLabel.textContent())?.trim();
    }

    async getTax() {
        return (await this.taxLabel.textContent())?.trim();
    }

    async getTotal() {
        return (await this.totalLabel.textContent())?.trim();
    }

    async getConfirmationMessage() {
        return (await this.confirmationHeader.textContent())?.trim();
    }
}
