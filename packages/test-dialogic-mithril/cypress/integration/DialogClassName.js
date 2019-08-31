/* global cy, describe, before, it */

describe("Dialog: className", () => {

  before(() => {
    cy.visit("/DialogClassName");
  });

  it("should show and hide the dialog", () => {
    cy.get("[data-test-id=content-default]").should("not.exist");
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

  it("clicking show twice should keep the dialog with fresh content", () => {
    let textBefore, textAfter;
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default] h2").should(($header) => {
      textBefore = $header.text();
    }).then(() => {
      cy.get("[data-test-id=button-show-default]").click();
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
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=button-hide-content]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("not.exist");
  });

  it("should have style set via the className", () => {
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist")
      .parent()
      .should("have.css", "opacity", "1")
      .should("have.css", "transition", "opacity 0.3s ease 0s");
  });

});
