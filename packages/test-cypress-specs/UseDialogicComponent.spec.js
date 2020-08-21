/* global cy, describe, before, it */

import { useDialogicTests } from './UseDialogicCommon';

describe('UseDialogicComponent', () => {
  const path = '/UseDialogComponentTest';
  before(() => {
    cy.visit(path);
  });

  useDialogicTests(path);
});
