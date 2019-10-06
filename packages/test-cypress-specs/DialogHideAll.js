/* global cy, describe, before, it */

const showAll = () => {
  cy.get("[data-test-id=button-show-default]").should("exist").click();
  cy.get("[data-test-id=button-show-id1]").should("exist").click();
  cy.get("[data-test-id=button-show-spawn1]").should("exist").click();
  cy.get("[data-test-id=button-show-id1spawn1]").should("exist").click();

  cy.get("[data-test-id=content-default]").should("exist");
  cy.get("[data-test-id=content-default-id1]").should("exist");
  cy.get("[data-test-id=content-default-spawn1]").should("exist");
  cy.get("[data-test-id=content-default-id1spawn1]").should("exist");
  
  cy.get("[data-test-id=count-all]").should("contain", "Count all: 4");
  cy.get("[data-test-id=count-id]").should("contain", "Count id: 2");
  cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 2");
  cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 1");
};

describe("Dialog: hide all", () => {

  before(() => {
    cy.visit("/DialogHideAll");
  });

  it("with default settings, should hide all dialogs", () => {
    showAll();
    cy.get("[data-test-id=button-hide-all]").should("exist").click();
    cy.clock().then((clock) => {
      clock.tick(1000);

      cy.get("[data-test-id=content-default]").should("not.exist");
      cy.get("[data-test-id=content-default-id1]").should("not.exist");
      cy.get("[data-test-id=content-default-spawn1]").should("not.exist");
      cy.get("[data-test-id=content-default-id1spawn1]").should("not.exist");

      cy.get("[data-test-id=count-all]").should("contain", "Count all: 0");
      cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
      cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
      cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    });
  });

  it("with id settings, should hide some dialogs", () => {
    showAll();
    cy.get("[data-test-id=button-hide-all-id]").should("exist").click();
    cy.clock().then((clock) => {
      clock.tick(1000);

      cy.get("[data-test-id=content-default]").should("exist");
      cy.get("[data-test-id=content-default-id1]").should("not.exist");
      cy.get("[data-test-id=content-default-spawn1]").should("exist");
      cy.get("[data-test-id=content-default-id1spawn1]").should("not.exist");

      cy.get("[data-test-id=count-all]").should("contain", "Count all: 2");
      cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
      cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 1");
      cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    });
  });

  it("with spawn settings, should hide some dialogs", () => {
    showAll();
    cy.get("[data-test-id=button-hide-all-spawn]").should("exist").click();
    cy.clock().then((clock) => {
      clock.tick(1000);

      cy.get("[data-test-id=content-default]").should("exist");
      cy.get("[data-test-id=content-default-id1]").should("exist");
      cy.get("[data-test-id=content-default-spawn1]").should("not.exist");
      cy.get("[data-test-id=content-default-id1spawn1]").should("not.exist");

      cy.get("[data-test-id=count-all]").should("contain", "Count all: 2");
      cy.get("[data-test-id=count-id]").should("contain", "Count id: 1");
      cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
      cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    });
  });

  it("with spawn and id settings, should hide some dialogs", () => {
    showAll();
    cy.get("[data-test-id=button-hide-all-spawn-id]").should("exist").click();
    cy.clock().then((clock) => {
      clock.tick(1000);

      cy.get("[data-test-id=content-default]").should("exist");
      cy.get("[data-test-id=content-default-id1]").should("exist");
      cy.get("[data-test-id=content-default-spawn1]").should("exist");
      cy.get("[data-test-id=content-default-id1spawn1]").should("not.exist");

      cy.get("[data-test-id=count-all]").should("contain", "Count all: 3");
      cy.get("[data-test-id=count-id]").should("contain", "Count id: 1");
      cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 1");
      cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    });
  });

});
