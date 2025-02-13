const commonlocators = require("../../../../locators/commonlocators.json");
const dsl = require("../../../../fixtures/tableV2WidgetDsl.json");
import apiPage from "../../../../locators/ApiEditor";
import { entityExplorer } from "../../../../support/Objects/ObjectsCore";

describe("Test Create Api and Bind to Table widget V2", function () {
  let apiData;
  before(() => {
    cy.addDsl(dsl);
  });
  it("1. Test_Add users api and execute api", function () {
    cy.createAndFillApi(this.data.userApi, "/mock-api?records=100");
    cy.RunAPI();
    cy.get(apiPage.jsonResponseTab).click();
    cy.get(apiPage.responseBody)
      .contains("name")
      .siblings("span")
      .invoke("text")
      .then((text) => {
        const value = text.match(/"(.*)"/)[0];
        cy.log(value);

        apiData = value;
        cy.log("val1:" + value);
      });
  });

  it("2. Test_Validate the Api data is updated on Table widget", function () {
    entityExplorer.ExpandCollapseEntity("Widgets");
    entityExplorer.SelectEntityByName("Table1", "Container3");
    cy.testJsontext("tabledata", "{{Api1.data}}");

    /**
     * readTabledata--> is to read the table contents
     * @param --> "row num" and "col num"
     */
    cy.readTableV2data("0", "5").then((tabData) => {
      expect(apiData).to.eq(`\"${tabData}\"`);
    });
    cy.PublishtheApp();
    cy.wait("@postExecute").then((interception) => {
      apiData = JSON.stringify(interception.response.body.data.body[0].name);
    });
    cy.readTableV2dataPublish("0", "5").then((tabData) => {
      expect(apiData).to.eq(`\"${tabData}\"`);
    });
    cy.get(commonlocators.backToEditor).click();

    cy.wait("@postExecute").then((interception) => {
      apiData = JSON.stringify(interception.response.body.data.body[0].name);
    });
    cy.readTableV2dataPublish("0", "5").then((tabData) => {
      expect(apiData).to.eq(`\"${tabData}\"`);
    });
  });

  it("3. Validate onSearchTextChanged function is called when configured for search text", function () {
    entityExplorer.ExpandCollapseEntity("Widgets");
    entityExplorer.SelectEntityByName("Table1", "Container3");
    cy.togglebarDisable(
      ".t--property-control-clientsidesearch input[type='checkbox']",
    );
    cy.get(".t--widget-tablewidgetv2 .t--search-input").first().type("Currey");
    cy.wait(3000);

    // Captures the API call made on search
    cy.wait("@postExecute").then((interception) => {
      apiData = JSON.stringify(interception.response.body.data.body[0].name);
    });
    cy.readTableV2dataPublish("0", "5").then((tabData) => {
      expect(apiData).to.eq(`\"${tabData}\"`);
    });
  });

  afterEach(() => {
    // put your clean up code if any
  });
});
