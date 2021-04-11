/* global cy, describe, beforeEach, it, expect */

describe('Notification: timeout', () => {
  beforeEach(() => {
    cy.visit('/NotificationTimeout');
  });

  it('With timeout > 0, the notification will hide', () => {
    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.wait(500);
    cy.get('[data-test-id=content-default]').should('exist');
    cy.wait(1500);
    cy.get('[data-test-id=content-default]').should('not.exist');
  });

  it('With timeout 0, the notification will stay visible', () => {
    cy.get('[data-test-id=button-show-zero-timeout]').should('exist').click();
    cy.wait(500);
    cy.get('[data-test-id=content-default]').should('exist');
    cy.wait(1500);
    cy.get('[data-test-id=content-default]').should('exist');
  });

  it('With timeout 0, getRemaining should show 0', () => {
    cy.get('[data-test-id=remaining-value]').should('contain', 'undefined');
    cy.get('[data-test-id=button-show-zero-timeout]').should('exist').click();
    cy.wait(500);
    cy.clock().then(clock => {
      clock.tick(1500);

      cy.get('[data-test-id=remaining-value]').should('exist');
      cy.get('[data-test-id=remaining-value]').should($remainingValue => {
        const text = $remainingValue.text();
        expect(text).to.eq('undefined');
      });
    });
  });
});
