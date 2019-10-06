/* global cy, describe, before, it */

describe("Dialog: className delay", () => {

  before(() => {
    cy.visit("/DialogClassNameDelay");
  });

  it("should have style set via the className", () => {
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist")
      .parent()
      .should("not.have.css", "opacity", "1")
      .should("not.have.css", "transition", "opacity 0.3s ease 0s");
    cy.clock().then((clock) => {
      clock.tick(1000);
      cy.get("[data-test-id=content-default]").should("exist")
        .parent()
        .should("have.css", "opacity", "1")
        .should("not.have.css", "transition", "opacity 0.3s ease 1000s");
      
      cy.get("[data-test-id=button-hide-default]").should("exist").click();
      cy.get("[data-test-id=content-default]").should("exist")
        .parent()
        .should("not.have.css", "opacity", "0");
      cy.clock().then((clock) => {
        clock.tick(1500);
        cy.get("[data-test-id=content-default]").should("exist")
          .parent()
          .should("have.css", "opacity", "0");
      });
    });
  });

});
