# QA Automation - Turinng Shop

## Resumen

Repositorio con pruebas automatizadas (UI + API) usando Cucumber (Gherkin), Playwright y Node.js.

## Estructura principal

- `features/` - archivos Gherkin y `step_definitions`.
  - `ui/` - pruebas de interfaz (Playwright + Page Objects)
  - `api/` - pruebas de API (cliente simple para FakeStore)
  - `support/` - hooks y World para inicialización
- `pages/` - Page Objects (`pages/ui`, `pages/api`)
- `reports/` - capturas y bug reports (generados por hooks)

## Requisitos

- Node.recomendado 20
- npm (incluido con Node)
- Conexión a internet (para Playwright descargar navegadores y para llamadas API)

## Instalación

Desde la raíz del repositorio:

```powershell
npm install
# (opcional) instalar navegadores de Playwright si no están presentes
npx playwright install
```

## Variables de entorno útiles

- `TEST_PASSWORD` - contraseña por defecto usada en pasos de UI (por defecto `secret_sauce`).
- `ALWAYS_REPORT_BUGS` - si se establece a `true`, el hook automático generará informes aun para escenarios etiquetados `@bug`.
- `HEADLESS` - si `true`, Playwright correrá en modo headless.
- `SLOW_MO` - tiempo en ms para `slowMo` de Playwright (útil para debugging).

## Ejecutar pruebas

- Ejecutar todas las pruebas UI y API:

# QA Automation — Turinng Shop

Este repositorio contiene pruebas automatizadas de UI y API para la tienda de ejemplo (FakeStore). Está orientado a evidenciar regresiones, documentar fallos y facilitar reproducciones manuales.

Principales objetivos:

- Probar flujos de interfaz (login, carrito, compra) con Page Objects.
- Validar endpoints críticos de la API (productos, autenticación, carritos).
- Generar evidencia (screenshots + .md) automáticamente en fallos.

## Estructura relevante

- `features/` — escenarios Gherkin y `step_definitions` (UI y API).
- `pages/ui/` y `pages/api/` — Page Objects y cliente API.
- `features/ui/support/` — `World` y `hooks` (capturas y generación de bug reports).
- `reports/` — `screenshots/` y `bugs/`.

## Requisitos

- Node.js (recomendado v18+ o v20).
- npm (incluido con Node).
- Acceso a Internet (descarga de navegadores Playwright y llamadas a la API FakeStore).

## Instalación rápida

```powershell
npm install
npx playwright install
```

## Variables de entorno útiles

- `HEADLESS` (true/false) — controla modo headless de Playwright.
- `SLOW_MO` (ms) — ralentiza Playwright para depuración.
- `ALWAYS_REPORT_BUGS` (true/false) — fuerza creación automática de reportes aun para escenarios `@bug`.
- `FAKESTORE_AUTH_USER` / `FAKESTORE_AUTH_PASS` — credenciales opcionales para los tests de autenticación API.

## Comandos frecuentes

- Ejecutar toda la suite (UI + API):

```powershell
npx cucumber-js
```

- Ejecutar un único feature (recomendado usar ruta explícita):

```powershell
npx cucumber-js ./features/ui/cart.feature
```

- Ejecutar solo UI (cargar pasos/hooks de UI explícitamente):

```powershell
npx cucumber-js --require "features/ui/support/**/*.js" --require "features/ui/step_definitions/**/*.js" ./features/ui/cart.feature
```

- Excluir escenarios etiquetados `@bug` (útil para CI o al publicar en GitHub):

```powershell
npx cucumber-js --tags "not @bug"
```

- Forzar generación de evidencia aun para `@bug`:

```powershell
$env:ALWAYS_REPORT_BUGS='true'; npx cucumber-js ./features/ui/cart.feature
```

### Ejemplo corto — test de autenticación (API)

```powershell
# $env:FAKESTORE_AUTH_USER='mi_usuario'; $env:FAKESTORE_AUTH_PASS='mi_pass'; npx cucumber-js ./features/api/auth.feature
```

## Informes y evidencias

- Capturas: `reports/screenshots/`.
- Reportes breves (markdown): `reports/bugs/` — contienen resumen del fallo y enlace a la captura.

## Generación automática de reportes

- En `features/ui/support/hooks.js` un `After` hook guarda screenshot y crea un `.md` en `reports/bugs/` cuando un escenario falla.
- Para evitar duplicados, el hook genera un `safeName` desde el título del escenario; si ya existe un archivo con ese nombre no crea otro.
- Escenarios etiquetados con `@bug` NO generan reportes por defecto (evita ruido). Usar `ALWAYS_REPORT_BUGS=true` para forzar.

## Manejo de pasos `skipped`

- Si un step falla, los siguientes aparecen como `skipped`. Revisa el primer fallo real para entender la causa.
- Estrategias recomendadas:
  - Etiquetar escenarios como `@bug` para documentar defectos conocidos.
  - Parametrizar credenciales con `FAKESTORE_AUTH_USER/FAKESTORE_AUTH_PASS` y omitir el escenario cuando no estén definidas.
  - Hacer aserciones más tolerantes cuando la API pueda devolver variantes legítimas (ej. aceptar `2xx`).

## Opciones de mejora que puedo aplicar

1. Parametrizar el test de autenticación (`FAKESTORE_AUTH_USER`/`FAKESTORE_AUTH_PASS`) y hacer que el escenario se salte si faltan las variables.
2. Añadir scripts npm útiles en `package.json`: `test:ui`, `test:api`, `test:cart`.

## Archivos clave

- `cucumber.mjs` — configuración de Cucumber (rutas/formatos).
- `features/ui/support/hooks.js` — lógica de screenshots y generación de reportes.
- `pages/api/fakestore.api.js` — cliente API utilizado por los steps.
