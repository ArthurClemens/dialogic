const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000/#',
    specPattern: '../test-cypress-specs/**/*.spec.js',
    excludeSpecPattern: ['**/UseDialogicComponent.spec.js'],
    defaultCommandTimeout: 10000,
  },
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
});
