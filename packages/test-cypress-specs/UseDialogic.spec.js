/* global cy, describe, before, it */

import { useDialogicTests } from './UseDialogicCommon';

describe('UseDialogic', () => {
  const path = '/UseDialogTest';
  before(() => {
    cy.visit(path);
  });

  useDialogicTests(path);
});
