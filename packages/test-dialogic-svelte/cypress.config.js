import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000/#',
    specPattern: '../test-cypress-specs/**/*.spec.js',
    excludeSpecPattern: [
      '**/UseDialogic.spec.js',
      '**/UseDialogicComponent.spec.js',
      '**/UseRemaining.spec.js',
    ],
  },
});
