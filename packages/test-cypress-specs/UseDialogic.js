/* global cy, describe, before, it */

describe('UseDialogic', () => {
  before(() => {
    cy.visit('/UseDialogTest');
  });

  it('Should show the homepage', () => {
    cy.get('[data-test-id=home-page]').should('exist');
    cy.get('[data-test-id=current-path]').should('contain', '/UseDialogTest');
  });

  it('Should show the profile page', () => {
    cy.get('[data-test-id=btn-profile]').should('exist').click();
    cy.get('[data-test-id=profile-page]').should('exist');
    cy.get('[data-test-id=current-path]').should(
      'contain',
      '/UseDialogTest/profile',
    );
  });

  it('Should open the edit dialog', () => {
    cy.get('[data-test-id=btn-edit-profile]').should('exist').click();
    cy.get('[data-test-id=edit-profile-dialog]').should('exist');
    cy.get('[data-test-id=current-path]').should(
      'contain',
      '/UseDialogTest/profile/edit',
    );
  });

  it('Should close the edit dialog using Close', () => {
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=btn-close]')
      .should('exist')
      .click();
    cy.get('[data-test-id=current-path]').should(
      'contain',
      '/UseDialogTest/profile',
    );
    cy.get('[data-test-id=edit-profile-dialog]').should('not.exist');
    cy.get('[data-test-id=btn-edit-profile]').should('exist').click();
  });

  it('Should close the edit dialog using Cancel', () => {
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=btn-cancel]')
      .should('exist')
      .click();
    cy.get('[data-test-id=current-path]').should(
      'contain',
      '/UseDialogTest/profile',
    );
    cy.get('[data-test-id=edit-profile-dialog]').should('not.exist');
    cy.get('[data-test-id=btn-edit-profile]').should('exist').click();
  });

  it('Should show dynamic content', () => {
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=title]').should(
      'contain',
      'Update your e-mail 0',
    );
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=btn-add-count]')
      .should('exist')
      .click();
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=title]').should(
      'contain',
      'Update your e-mail 1',
    );
  });

  it('Should show a confirmation after saving', () => {
    cy.get('[data-test-id=edit-profile-dialog] [data-test-id=btn-save]')
      .should('exist')
      .click();
    cy.get('[data-test-id=current-path]').should(
      'contain',
      '/UseDialogTest/profile',
    );
    cy.get('[data-test-id=edit-profile-dialog]').should('not.exist');
    cy.get('[data-test-id=notification]').should('exist');
    cy.wait(1000);
    cy.get('[data-test-id=notification]').should('not.exist');
  });

  it('Should show the dialog using the browser history', () => {
    cy.go('back');
    cy.get('[data-test-id=edit-profile-dialog]').should('exist');
    cy.go('forward');
    cy.get('[data-test-id=edit-profile-dialog]').should('not.exist');
    cy.go('back');
    cy.get('[data-test-id=edit-profile-dialog]').should('exist');
  });
});
