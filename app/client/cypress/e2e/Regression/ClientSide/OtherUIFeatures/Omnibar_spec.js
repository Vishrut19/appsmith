const omnibar = require("../../../../locators/Omnibar.json");
const dsl = require("../../../../fixtures/omnibarDsl.json");
const commonlocators = require("../../../../locators/commonlocators.json");
import * as _ from "../../../../support/Objects/ObjectsCore";

describe("Omnibar functionality test cases", () => {
  const apiName = "Omnibar1";
  const jsObjectName = "Omnibar2";

  before(() => {
    cy.addDsl(dsl);
  });

  it("1. Bug #15104  Docs tab opens after clicking on learn more link from property pane", function () {
    cy.dragAndDropToCanvas("audiowidget", { x: 300, y: 500 });
    _.agHelper.AssertNewTabOpened(() => {
      cy.xpath('//span[text()="Learn more"]').click();
    });
  });

  it("2.Verify omnibar is present across all pages and validate its fields", function () {
    cy.get(omnibar.globalSearch)
      .trigger("mouseover")
      .should("have.css", "background-color", "rgb(255, 255, 255)");
    cy.get(omnibar.globalSearch).click({ force: true });
    // verifying all sections are present in omnibar
    cy.get(omnibar.categoryTitle)
      .eq(0)
      .should("have.text", "Navigate")
      .next()
      .should(
        "have.text",
        "Navigate to any page, widget or file across this project.",
      );
    cy.get(omnibar.categoryTitle)
      .eq(1)
      .should("have.text", "Create new")
      .next()
      .should("have.text", "Create a new query, API or JS Object");
    cy.get(omnibar.categoryTitle)
      .eq(2)
      .should("have.text", "Use snippets")
      .next()
      .should(
        "have.text",
        "Search and insert code snippets to perform complex actions quickly.",
      );
    cy.get(omnibar.categoryTitle)
      .eq(3)
      .should("have.text", "Search documentation")
      .next()
      .should("have.text", "Find answers through Appsmith documentation.");
    cy.get("body").type("{esc}");
  });

  it("3. Verify when user clicks on a debugging error, related documentation should open in omnibar", function () {
    // click on debugger icon
    cy.get(commonlocators.debugger).should("be.visible").click({ force: true });
    cy.get(commonlocators.errorTab).should("be.visible").click({ force: true });
    cy.wait(1000);
    // click on open documention from error tab
    cy.get(commonlocators.debuggerDescription).next().first().click();
    cy.xpath(commonlocators.openDocumentationfromErrorTab)
      .first()
      .click({ force: true });
    // Commenting this as in epic 16804
    // Decided not to have any default text in documentation.
    // verify omnibar is opened with relevant documentation
    // cy.get(omnibar.globalSearchInput).should(
    //   "have.value",
    //   "This value does not evaluate to type string",
    // );
    // cy.get(omnibar.globalSearchClose).click();
  });

  it("4. Verify Create new section and its data, also create a new api, new js object and new cURL import from omnibar ", function () {
    cy.intercept("POST", "/api/v1/actions").as("createNewApi");
    cy.intercept("POST", "/api/v1/collections/actions").as(
      "createNewJSCollection",
    );
    cy.get(omnibar.categoryTitle).contains("Create new").click();

    // create new api, js object and cURL import from omnibar
    cy.get(omnibar.createNew).contains("New JS Object").click();
    cy.wait(1000);
    cy.wait("@createNewJSCollection");
    cy.wait(1000);
    cy.get(".t--js-action-name-edit-field").type(jsObjectName).wait(1000);

    cy.get(omnibar.globalSearch).click({ force: true });
    cy.get(omnibar.categoryTitle).contains("Create new").click();
    cy.wait(1000);
    cy.get(omnibar.createNew).contains("New blank API").click();
    cy.wait(1000);
    cy.wait("@createNewApi");
    cy.renameWithInPane(apiName);

    cy.get(omnibar.globalSearch).click({ force: true });
    cy.get(omnibar.categoryTitle).contains("Create new").click();
    cy.wait(1000);
    cy.get(omnibar.createNew).contains("New cURL import").click();
    cy.wait(1000);
    cy.url().should("include", "curl-import?");
    cy.get('p:contains("Import from CURL")').should("be.visible");
  });

  it(
    "excludeForAirgap",
    "5. On an invalid search, discord link should be displayed and on clicking that link, should open discord in new tab",
    function () {
      // typing a random string in search bar
      cy.get(omnibar.globalSearch).click({ force: true });
      cy.wait(1000);
      cy.get(omnibar.globalSearchInput).type("vnjkv");
      cy.wait(2000);
      cy.get(omnibar.globalSearchInput).should("have.value", "vnjkv");
      // discord link should be visible
      cy.get(omnibar.discordLink).should("be.visible");
      cy.window().then((win) => {
        cy.stub(win, "open", (url) => {
          win.location.href = "https://discord.com/invite/rBTTVJp";
        }).as("discordLink");
      });
      // clicking on discord link should open discord
      cy.get(omnibar.discordLink).click();
      cy.get("@discordLink").should("be.called");
      cy.wait(500);
      cy.go(-1);
      cy.wait(2000);
    },
  );

  it("6. Verify Navigate section shows recently opened widgets and datasources", function () {
    _.entityExplorer.SelectEntityByName("Button1", "Widgets");
    cy.get(omnibar.globalSearch).click({ force: true });
    cy.get(omnibar.categoryTitle).contains("Navigate").click();
    // verify recently opened items with their subtext i.e page name
    cy.xpath(omnibar.recentlyopenItem)
      .eq(0)
      .should("have.text", "Button1")
      .next()
      .should("have.text", "Page1");

    cy.xpath(omnibar.recentlyopenItem)
      .eq(1)
      .should("have.text", "Omnibar1")
      .next()
      .should("have.text", "Page1");

    cy.xpath(omnibar.recentlyopenItem)
      .eq(2)
      .should("have.text", "Omnibar2")
      .next()
      .should("have.text", "Page1");

    cy.xpath(omnibar.recentlyopenItem)
      .eq(3)
      .should("have.text", "Audio1")
      .next()
      .should("have.text", "Page1");

    cy.xpath(omnibar.recentlyopenItem).eq(4).should("have.text", "Page1");
  });

  it(
    "excludeForAirgap",
    "7. Verify documentation should open in new tab, on clicking open documentation",
    function () {
      //cy.get(omnibar.category).click()
      cy.get(omnibar.globalSearch).click({ force: true });
      cy.get(omnibar.categoryTitle)
        .contains("Search documentation")
        .click({ force: true });
      cy.get(omnibar.openDocumentationLink)
        .invoke("removeAttr", "target")
        .click()
        .wait(2000);
      cy.url().should(
        "contain",
        "https://docs.appsmith.com/core-concepts/connecting-to-data-sources",
      ); // => true
      cy.go(-1);
    },
  );
});
