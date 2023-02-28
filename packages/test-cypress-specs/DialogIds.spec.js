describe('Dialog: ids', () => {
  beforeEach(() => {
    cy.visit('/DialogIds');
  });

  it('should show and hide different dialogs', () => {
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get('[data-test-id=button-show-id1]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=content-default-id1]').should('exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get('[data-test-id=button-show-id2]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=content-default-id1]').should('exist');
    cy.get('[data-test-id=content-default-id2]').should('exist');

    cy.get('[data-test-id=button-hide-default]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('exist');
    cy.get('[data-test-id=content-default-id2]').should('exist');

    cy.get('[data-test-id=button-hide-id1]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('exist');

    cy.get('[data-test-id=button-hide-id2]').should('exist').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');
  });

  it('should hide from the content', () => {
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=button-show-id1]').should('exist').click();
    cy.get('[data-test-id=button-show-id2]').should('exist').click();

    cy.get(
      '[data-test-id=content-default-id2] [data-test-id=button-hide-content]',
    )
      .should('exist')
      .click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=content-default-id1]').should('exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get(
      '[data-test-id=content-default-id1] [data-test-id=button-hide-content]',
    )
      .should('exist')
      .click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');

    cy.get('[data-test-id=content-default] [data-test-id=button-hide-content]')
      .should('exist')
      .click();
    cy.get('[data-test-id=content-default]').should('not.exist');
    cy.get('[data-test-id=content-default-id1]').should('not.exist');
    cy.get('[data-test-id=content-default-id2]').should('not.exist');
  });
});
