// features/ui/support/world.js
import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

/**
 * CustomWorld - Integración de Playwright con Cucumber
 */
class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Inicializa el navegador y contexto de Playwright
   */
  async init() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS === 'true',
      slowMo: Number(process.env.SLOW_MO) || 0
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await this.context.newPage();
  }


  //Cierra el navegador y limpia recursos
  async destroy() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);