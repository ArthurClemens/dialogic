describe('Dialog: queued', () => {
  beforeEach(() => {
    cy.visit('/DialogQueued');
  });

  it('should queue dialogs', () => {
    cy.get('[data-test-id=count-all]').should('exist');
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 0');

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 1');

    // The show dialog should not change when invoking another one
    let textOne;
    let textOneAfter;
    let textTwo;
    cy.get('[data-test-id=content-default] h2')
      .should($header => {
        textOne = $header.text();
      })
      .then(() => {
        cy.get('[data-test-id=button-show-default]').click();
        cy.get('[data-test-id=count-all]').should('contain', 'Count all: 2');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
      })
      .then(() => {
        cy.get('[data-test-id=content-default] h2')
          .should($header => {
            textOneAfter = $header.text();
          })
          .then(() => {
            expect(textOneAfter).to.eq(textOne);

            // Hiding the current dialog should reveal the next one
            cy.get('[data-test-id=button-hide-default]')
              .should('exist')
              .click();
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
            cy.get('[data-test-id=count-all]').should(
              'contain',
              'Count all: 1',
            );

            cy.get('[data-test-id=content-default] h2')
              .should($header => {
                textTwo = $header.text();
              })
              .then(() => {
                expect(textTwo).to.not.eq(textOneAfter);

                // Hiding the current dialog should result in an empty queue
                cy.get('[data-test-id=button-hide-default]')
                  .should('exist')
                  .click();
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(500);
                cy.get('[data-test-id=count-all]').should(
                  'contain',
                  'Count all: 0',
                );
              });
          });
      });
  });
});
