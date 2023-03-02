const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000/#',
    specPattern: '../test-cypress-specs/**/*.spec.js',
    excludeSpecPattern: ['**/UseDialogicComponent.spec.js'],
    defaultCommandTimeout: 10000,
  },
});
