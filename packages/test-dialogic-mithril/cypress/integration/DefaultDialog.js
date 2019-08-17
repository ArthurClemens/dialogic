/* global cy, describe, before, it */

describe("Dialog: default options", () => {

  before(() => {
    cy.visit("/DefaultDialog");
  });

  it("should show and hide the dialog", () => {
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=button-show]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

  it("clicking show twice should keep the dialog with fresh content", () => {
    let textBefore, textAfter;
    cy.get("[data-test-id=button-show]").should("exist").click();
    cy.get("[data-test-id=content-default] h2").should(($header) => {
      textBefore = $header.text();
    }).then(() => {
      cy.get("[data-test-id=button-show]").click();
      cy.wait(500);
    }).then(() => {
      cy.get("[data-test-id=content-default] h2").should(($header) => {
        textAfter = $header.text();
      }).then(() => {
        expect(textAfter).to.not.eq(textBefore);
      })
    });
  });

  it("should hide from the content", () => {
    cy.get("[data-test-id=button-show]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

});
