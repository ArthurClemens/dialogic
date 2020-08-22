/* global cy, describe, before, it */

import { useDialogicTests } from './useDialogicTests';

describe('UseDialogic', () => {
  const path = '/UseDialogTest';
  before(() => {
    cy.visit(path);
  });

  useDialogicTests(path);
});
