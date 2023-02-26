describe('Notification: count', () => {
  beforeEach(() => {
    cy.visit('/NotificationCount');
  });

  it('should hide the notification automatically', () => {
    cy.get('[data-test-id=button-reset]').should('exist').click();

    cy.get('[data-test-id=count-all]').should('exist');
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 0');

    cy.get('[data-test-id=count-id]').should('exist');
    cy.get('[data-test-id=count-id]').should('contain', 'Count id: 0');

    cy.get('[data-test-id=count-spawn]').should('exist');
    cy.get('[data-test-id=count-spawn]').should('contain', 'Count spawn: 0');
    cy.get('[data-test-id=count-spawn-id]').should(
      'contain',
      'Count spawn, id: 0',
    );

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');

    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 1');
    cy.get('[data-test-id=count-id]').should('contain', 'Count id: 0');
    cy.get('[data-test-id=count-spawn]').should('contain', 'Count spawn: 0');
    cy.get('[data-test-id=count-spawn-id]').should(
      'contain',
      'Count spawn, id: 0',
    );

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);

    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 0');
    cy.get('[data-test-id=count-id]').should('contain', 'Count id: 0');
    cy.get('[data-test-id=count-spawn]').should('contain', 'Count spawn: 0');
    cy.get('[data-test-id=count-spawn-id]').should(
      'contain',
      'Count spawn, id: 0',
    );
  });

  it('should queue subsequent notifications', () => {
    cy.get('[data-test-id=button-reset]').should('exist').click();

    cy.get('[data-test-id=count-all]').should('exist');
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 0');

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=content-default]').should('exist');

    cy.get('[data-test-id=count-all]').should('exist');
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
                cy.wait(5000);
                cy.get('[data-test-id=count-all]').should(
                  'contain',
                  'Count all: 0',
                );
              });
          });
      });
  });

  it('should count notifications per id/spawn', () => {
    cy.get('[data-test-id=button-reset]').should('exist').click();

    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=button-show-default]').should('exist').click();
    cy.get('[data-test-id=button-show-default]').should('exist').click();

    cy.get('[data-test-id=count-all]').should('exist');
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 4');

    cy.get('[data-test-id=count-id]').should('exist');
    cy.get('[data-test-id=count-id]').should('contain', 'Count id: 0');

    cy.get('[data-test-id=count-spawn]').should('exist');
    cy.get('[data-test-id=count-spawn]').should('contain', 'Count spawn: 0');

    cy.get('[data-test-id=count-spawn-id]').should('exist');
    cy.get('[data-test-id=count-spawn-id]').should(
      'contain',
      'Count spawn, id: 0',
    );

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[data-test-id=content-default]').should('exist');

    cy.get('[data-test-id=button-show-id1]').should('exist').click();
    cy.get('[data-test-id=button-show-id1]').should('exist').click();
    cy.get('[data-test-id=button-show-id1]').should('exist').click();

    cy.get('[data-test-id=button-show-spawn1]').should('exist').click();
    cy.get('[data-test-id=button-show-spawn1]').should('exist').click();

    cy.get('[data-test-id=button-show-id1spawn1]').should('exist').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
    cy.get('[data-test-id=count-all]').should('contain', 'Count all: 10');
    cy.get('[data-test-id=count-id]').should('contain', 'Count id: 4');
    cy.get('[data-test-id=count-spawn]').should('contain', 'Count spawn: 3');
    cy.get('[data-test-id=count-spawn-id]').should(
      'contain',
      'Count spawn, id: 1',
    );
  });
});
