export default {
  // Rutas donde están los archivos .feature
  paths: ['features/**/*.feature'],

  // Archivos a importar (IMPORTANTE: rutas específicas a TU estructura)
  import: [
    'features/ui/support/world.js',                      // ← World en ui/support/
    'features/ui/support/hooks.js',                      // ← Hooks en ui/support/
    'features/ui/step_definitions/**/*.steps.js',        // ← Steps de UI
    'features/api/step_definitions/**/*.steps.js'        // ← Steps de API
  ],

  // Formatos de reporte
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/cucumber-report.xml',
    'summary'
  ],

  formatOptions: {
    snippetInterface: 'async-await',
    colorsEnabled: true
  },

  parallel: 1,
  retry: 0,
  strict: true,
  failFast: false,
  publishQuiet: true,
};