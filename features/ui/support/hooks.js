import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';

// Evita que BeforeAll se ejecute más de una vez en ejecuciones paralelas
let suiteInitialized = false;

BeforeAll(async function () {
    // Inicialización de la suite: crear carpetas de reportes si no existen
    if (!suiteInitialized) {
        console.log('\nIniciando suite de pruebas...\n');

        if (!existsSync('reports')) mkdirSync('reports', { recursive: true });
        if (!existsSync('reports/screenshots')) mkdirSync('reports/screenshots', { recursive: true });

        suiteInitialized = true;
    }
});

AfterAll(async function () {
    console.log('\nSuite de pruebas completada\n');
});

// Hook Before por escenario: inicializa el navegador/contexto
Before(async function ({ pickle }) {
    console.log(`Ejecutando: ${pickle.name}`);
    await this.init();
});

// Hook After por escenario: captura evidencia y genera un informe breve si procede
After(async function ({ pickle, result }) {
    // Captura de pantalla en caso de fallo
    if (result?.status === Status.FAILED && this.page) {
        const screenshotName = `${pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        const screenshotPath = `reports/screenshots/${screenshotName}`;

        const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
        this.attach(screenshot, 'image/png');
        this._last_screenshot = screenshotPath; // almacena la ruta en el World
        console.log(`Screenshot guardado: ${screenshotName}`);
    }

    // Genera un informe breve cuando el escenario falla.
    if (result?.status === Status.FAILED) {
        try {
            // Si el escenario está marcado @bug, no crear informe salvo que se fuerce via env
            const hasBugTag = (pickle.tags || []).some(t => t.name === '@bug');
            const forceBugReports = process.env.ALWAYS_REPORT_BUGS === 'true';
            if (hasBugTag && !forceBugReports) {
                console.log('Escenario etiquetado @bug: omitiendo informe automático.');
            } else {
                const bugsDir = path.join(process.cwd(), 'reports', 'bugs');
                if (!existsSync(bugsDir)) mkdirSync(bugsDir, { recursive: true });

                const safeName = pickle.name.replace(/[^a-z0-9-_]/gi, '_').slice(0, 200);

                // Evitar duplicados: si ya existe un informe para este escenario, no crear otro
                const existing = (existsSync(bugsDir) && readdirSync(bugsDir).find(f => f.startsWith(safeName + '_')));
                if (existing) {
                    console.log(`Ya existe informe para este escenario: ${existing} — se omite creación.`);
                } else {
                    const filePath = path.join(bugsDir, `${safeName}_${Date.now()}.md`);
                    const lines = [];
                    lines.push(`# Bug: ${pickle.name}`);
                    lines.push(`- Fecha: ${new Date().toISOString()}`);
                    lines.push(`- Feature: ${pickle.uri || 'unknown'}`);
                    lines.push(`- Tags: ${(pickle.tags || []).map(t => t.name).join(', ') || '-'}`);
                    lines.push(`- Estado: FAILED`);

                    if (this._api_last) {
                        try {
                            const bodyStr = typeof this._api_last.body === 'string' ? this._api_last.body : JSON.stringify(this._api_last.body);
                            const snippet = bodyStr.length > 300 ? bodyStr.slice(0, 300) + '... (truncado)' : bodyStr;
                            lines.push(`- API status: ${this._api_last.status}`);
                            lines.push('');
                            lines.push('```json');
                            lines.push(snippet);
                            lines.push('```');
                        } catch (e) {
                            lines.push(`- API body: ${String(this._api_last.body)}`);
                        }
                    }

                    if (this._last_screenshot) {
                        lines.push('');
                        lines.push(`- Screenshot: ${this._last_screenshot}`);
                    }

                    lines.push('');
                    lines.push('- Nota: informe breve generado automáticamente.');

                    writeFileSync(filePath, lines.join('\n'), 'utf8');
                    console.log(`Bug report creado: ${filePath}`);
                }
            }
        } catch (err) {
            console.error('Error generando bug report automático:', err);
        }
    }

    await this.destroy(); // cierra navegador/contexto

    // Registro del resultado del escenario
    const statusIcon = result?.status === Status.PASSED ? 'PASSED' : 'FAILED';
    console.log(`${statusIcon} ${pickle.name} - ${result?.status || 'UNKNOWN'}\n`);
});

// Hooks por tags: mensajes informativos al iniciar escenarios por tipo
Before({ tags: '@ui' }, async function () {
    console.log('Test de UI');
});

Before({ tags: '@api' }, async function () {
    console.log('Test de API');
});

// Ajuste del timeout por defecto para pasos
setDefaultTimeout(30 * 1000);