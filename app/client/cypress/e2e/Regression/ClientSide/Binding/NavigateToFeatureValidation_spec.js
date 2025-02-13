const widgetsPage = require("../../../../locators/Widgets.json");
const publish = require("../../../../locators/publishWidgetspage.json");
const dsl = require("../../../../fixtures/navigateTotabledsl.json");
const testdata = require("../../../../fixtures/testdata.json");
const dsl2 = require("../../../../fixtures/navigateToInputDsl.json");
const pageid = "MyPage";
import { entityExplorer } from "../../../../support/Objects/ObjectsCore";

describe("Table Widget with Input Widget and Navigate to functionality validation", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("1. Table Widget Functionality with multiple page", function () {
    entityExplorer.SelectEntityByName("Table1");
    cy.widgetText(
      "Table1",
      widgetsPage.tableWidget,
      widgetsPage.widgetNameSpan,
    );
    cy.testJsontext("tabledata", JSON.stringify(testdata.TablePagination));
    //Create MyPage and valdiate if its successfully created
    cy.Createpage(pageid);
    cy.addDsl(dsl2);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.CheckAndUnfoldEntityItem("Pages");
    cy.get(`.t--entity-name:contains("${pageid}")`).should("be.visible");
  });

  it("2. Validate NavigateTo Page functionality ", function () {
    cy.get(`.t--entity-name:contains("Page1")`)
      .should("be.visible")
      .click({ force: true });
    cy.wait(4000);
    cy.PublishtheApp();
    cy.readTabledataPublish("1", "0").then((tabDataP) => {
      const tabValueP = tabDataP;
      cy.log(tabValueP);
      cy.isSelectRow(1);
      cy.get("input").should("be.visible");
      cy.get(publish.inputWidget + " " + "input")
        .first()
        .invoke("attr", "value")
        .should("contain", tabValueP);
    });
  });
});
