describe('Dialog: timeout', () => {
  beforeEach(() => {
    cy.visit('/DialogTimeout');
  });

  it('getRemaining should show the remaining time', () => {
    cy.get('[data-test-id=remaining-value]').should('contain', 'undefined');
    cy.get('[data-test-id=button-show-default]').should('exist').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-test-id=remaining-value]').should('not.contain', 'undefined');

    cy.clock().then(clock => {
      clock.tick(100);
      cy.get('[data-test-id=remaining-value]').should($remainingValue => {
        const text = $remainingValue.text();
        const remainingValue = parseInt(text, 10);
        expect(remainingValue).to.not.eq(0);
        expect(remainingValue).to.be.lessThan(2000);
        expect(remainingValue).to.be.greaterThan(0);
      });
    });
  });

  it('pause button should pause the timer, resume should continue from where it left off', () => {
    cy.get('[data-test-id=remaining-value]').should('contain', 'undefined');
    cy.get('[data-test-id=is-paused]').should('contain', 'Is paused: false');
    cy.get('[data-test-id=button-show-default]').should('exist').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[data-test-id=button-pause]').should('exist').click();
    cy.get('[data-test-id=is-paused]').should('contain', 'Is paused: true');

    // Pressing pause again does not make it run
    cy.get('[data-test-id=button-pause]').should('exist').click();
    cy.get('[data-test-id=is-paused]').should('contain', 'Is paused: true');

    // Resume
    cy.get('[data-test-id=button-resume]').should('exist').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    cy.get('[data-test-id=is-paused]').should('contain', 'Is paused: false');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[data-test-id=remaining-value]').should('exist');
    cy.get('[data-test-id=remaining-value]').should($remainingValue => {
      const text = $remainingValue.text();
      const remainingValue = parseInt(text, 10);
      expect(remainingValue).to.not.eq(0);
      expect(remainingValue).to.be.lessThan(2000);
      expect(remainingValue).to.be.greaterThan(0);
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('[data-test-id=is-paused]').should('contain', 'Is paused: false');
    cy.get('[data-test-id=remaining-value]').should('contain', 'undefined');
  });
});
