/* global cy, describe, before, it */

import { useDialogicTests } from './useDialogicTests';

describe('UseDialogicComponent', () => {
  const path = '/UseDialogComponentTest';
  before(() => {
    cy.visit(path);
  });

  useDialogicTests(path);
});