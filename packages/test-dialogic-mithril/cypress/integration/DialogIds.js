/* global cy, describe, before, it */

describe("Dialog: ids", () => {

  before(() => {
    cy.visit("/DialogIds");
  });

  it("should show and hide different dialogs", () => {
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=button-show]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=button-show-1]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-1]").should("exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=button-show-2]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-1]").should("exist");
    cy.get("[data-test-id=content-default-2]").should("exist");

    cy.get("[data-test-id=button-hide]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("exist");
    cy.get("[data-test-id=content-default-2]").should("exist");

    cy.get("[data-test-id=button-hide-1]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("exist");

    cy.get("[data-test-id=button-hide-2]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");
  });

  it("should hide from the content", () => {
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=button-show]").should("exist").click();
    cy.get("[data-test-id=button-show-1]").should("exist").click();
    cy.get("[data-test-id=button-show-2]").should("exist").click();

    cy.get("[data-test-id=content-default-2] [data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-1]").should("exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=content-default-1] [data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");

    cy.get("[data-test-id=content-default] [data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=content-default-1]").should("not.exist");
    cy.get("[data-test-id=content-default-2]").should("not.exist");
  });

});
