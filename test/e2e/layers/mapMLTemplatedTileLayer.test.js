import { test, expect, chromium } from '@playwright/test';

const isVisible = require("./general/isVisible");
const zoomLimit = require("./general/zoomLimit");
const extentProperty = require("./general/extentProperty");

let expectedPCRS = {
  topLeft: {
    horizontal: -180,
    vertical: 90
  },
  bottomRight: {
    horizontal: 180,
    vertical: -270
  }
}, expectedGCRS = {
  topLeft: {
    horizontal: -180,
    vertical: 90
  },
  bottomRight: {
    horizontal: 180,
    vertical: -270
  }
};

test.describe("Playwright mapMLTemplatedTile Layer Tests", () => {
  isVisible.test("mapMLTemplatedTileLayer.html", 2, 2);
  zoomLimit.test("mapMLTemplatedTileLayer.html", 1, 0);
  extentProperty.test("mapMLTemplatedTileLayer.html", expectedPCRS, expectedGCRS);
  test.describe("General Tests ", () => {
    let page;
    let context;
    test.beforeAll(async () => {
      context = await chromium.launchPersistentContext('');
      page = context.pages().find((page) => page.url() === 'about:blank') || await context.newPage();
      await page.goto("mapMLTemplatedTileLayer.html");
    });

    test.afterAll(async function () {
      await context.close();
    });
  
    test("SVG tiles load in on default map zoom level", async () => {
      const tiles = await page.$eval(
        "xpath=//html/body/map/div >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > div:nth-child(1) > div.leaflet-layer.mapml-templatedlayer-container > div > div",
        (tileGroup) => tileGroup.getElementsByTagName("svg").length
      );
      expect(tiles).toEqual(2);
    });
  });

});