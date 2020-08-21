/* global cy, describe, before, it */

describe("Dialog: count", () => {

  beforeEach(() => {
    cy.visit("/DialogCount");
  });

  it("should count dialogs per id/spawn", () => {

    cy.get("[data-test-id=count-all]").should("contain", "Count all: 0");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");

    cy.get("[data-test-id=button-show-default]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    
    cy.get("[data-test-id=count-all]").should("contain", "Count all: 1");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");

    cy.get("[data-test-id=button-show-id1]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-id1]").should("exist");
    
    cy.get("[data-test-id=count-all]").should("contain", "Count all: 2");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 1");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");

    cy.get("[data-test-id=button-show-spawn1]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-id1]").should("exist");
    cy.get("[data-test-id=content-default-spawn1]").should("exist");
    
    cy.get("[data-test-id=count-all]").should("contain", "Count all: 3");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 1");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 1");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");

    cy.get("[data-test-id=button-show-id1spawn1]").should("exist").click();
    cy.get("[data-test-id=content-default]").should("exist");
    cy.get("[data-test-id=content-default-id1]").should("exist");
    cy.get("[data-test-id=content-default-spawn1]").should("exist");
    cy.get("[data-test-id=content-default-id1spawn1]").should("exist");
    
    cy.get("[data-test-id=count-all]").should("contain", "Count all: 4");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 2");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 2");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 1");

  });

  it("should count queued items", () => {
    cy.get("[data-test-id=count-spawn-queued]").should("contain", "Count spawn, queued: 0");

    cy.get("[data-test-id=button-show-queued]").should("exist").click();
    cy.get("[data-test-id=content-default-spawn2]").should("exist");

    cy.get("[data-test-id=count-all]").should("contain", "Count all: 1");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    cy.get("[data-test-id=count-spawn-queued]").should("contain", "Count spawn, queued: 1");

    cy.get("[data-test-id=button-show-queued]").should("exist").click();
    cy.wait(100);
    cy.get("[data-test-id=button-show-queued]").should("exist").click();
    cy.wait(100);

    cy.get("[data-test-id=count-all]").should("contain", "Count all: 3");
    cy.get("[data-test-id=count-id]").should("contain", "Count id: 0");
    cy.get("[data-test-id=count-spawn]").should("contain", "Count spawn: 0");
    cy.get("[data-test-id=count-spawn-id]").should("contain", "Count spawn, id: 0");
    cy.get("[data-test-id=count-spawn-queued]").should("contain", "Count spawn, queued: 3");

  });

});
