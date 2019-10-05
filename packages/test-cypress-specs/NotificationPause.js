/* global cy, describe, before, it */

describe("Notification: pause", () => {

  before(() => {
    cy.visit("/NotificationPause");
  });

  it("pause button should pause the timer, resume should continue from where it left off", () => {
    cy.get("[data-test-id=remaining-value]").should("contain", "undefined");
    cy.get("[data-test-id=is-paused]").should("contain", "Is paused: undefined");
    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.wait(500);
    cy.get("[data-test-id=button-pause]").should("exist").click();
    cy.get("[data-test-id=is-paused]").should("contain", "Is paused: true");

    // Pressing pause again does not make it run
    cy.get("[data-test-id=button-pause]").should("exist").click();
    cy.get("[data-test-id=is-paused]").should("contain", "Is paused: true");

    // Resume
    cy.get("[data-test-id=button-resume]").should("exist").click();
    cy.get("[data-test-id=is-paused]").should("contain", "Is paused: false");

    cy.wait(500);

    cy.get("[data-test-id=remaining-value]").should("exist");
    cy.get("[data-test-id=remaining-value]").should(($remainingValue) => {
      const text = $remainingValue.text();
      const remainingValue = parseInt(text);
      expect(remainingValue).to.not.eq(undefined);
      expect(remainingValue).to.be.lessThan(2000);
      expect(remainingValue).to.be.greaterThan(0);
    });

    cy.wait(2000);
    cy.get("[data-test-id=is-paused]").should("contain", "Is paused: undefined");
    cy.get("[data-test-id=remaining-value]").should("contain", "undefined");
  });

});
