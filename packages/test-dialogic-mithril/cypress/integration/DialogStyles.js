/* global cy, describe, before, it */

describe("Dialog: styles", () => {

  before(() => {
    cy.visit("/DialogStyles");
  });

  it("should show and hide the dialog", () => {
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

  it("should hide from the content", () => {
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

});