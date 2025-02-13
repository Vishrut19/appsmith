/// <reference types="Cypress" />

const commonlocators = require("../../../../locators/commonlocators.json");
const dsl = require("../../../../fixtures/tableInputDsl.json");
const widgetsPage = require("../../../../locators/Widgets.json");
const publish = require("../../../../locators/publishWidgetspage.json");
const testdata = require("../../../../fixtures/testdata.json");
const dsl2 = require("../../../../fixtures/displayWidgetDsl.json");
const pageid = "MyPage";
import {
  agHelper,
  propPane,
  entityExplorer,
} from "../../../../support/Objects/ObjectsCore";

describe("Binding the multiple Widgets and validating NavigateTo Page", function () {
  afterEach(() => {
    agHelper.SaveLocalStorageCache();
  });

  beforeEach(() => {
    agHelper.RestoreLocalStorageCache();
  });

  before(() => {
    cy.addDsl(dsl);
    cy.wait(5000); //dsl to settle!
  });

  it("1. Create MyPage and valdiate if its successfully created", function () {
    cy.Createpage(pageid);
    cy.addDsl(dsl2);
    cy.wait(5000); //dsl to settle!
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.CheckAndUnfoldEntityItem("Pages");
    cy.get(`.t--entity-name:contains("${pageid}")`).should("be.visible");
  });

  it("2. Input widget test with default value from table widget", function () {
    cy.get(`.t--entity-name:contains("Page1")`)
      .should("be.visible")
      .click({ force: true });
    entityExplorer.SelectEntityByName("Input1");
    cy.get(widgetsPage.defaultInput).type(testdata.defaultInputWidget);
    propPane.SelectPlatformFunction("onTextChanged", "Navigate to");
    cy.get(".t--open-dropdown-Select-page").click();
    cy.get(commonlocators.singleSelectMenuItem)
      .contains(pageid)
      .click({ force: true });
    cy.assertPageSave();
  });

  it("3. Validate NavigateTo Page functionality ", function () {
    cy.wait(4000);
    cy.isSelectRow(1);
    cy.readTabledataPublish("1", "0").then((tabData) => {
      const tabValue = tabData;
      expect(tabValue).to.be.equal("2736212");
      cy.wait(2000);
      cy.get(publish.inputWidget + " " + "input")
        .first()
        .invoke("attr", "value")
        .should("contain", tabValue);
      cy.get(widgetsPage.chartWidget).should("not.exist");
      cy.get(publish.inputGrp).first().type("123").wait(2000);
      cy.waitUntil(() => cy.get(widgetsPage.chartWidget).should("be.visible"), {
        errorMsg: "Execute call did not complete evn after 20 secs",
        timeout: 20000,
        interval: 1000,
      });
    });
  });
});
