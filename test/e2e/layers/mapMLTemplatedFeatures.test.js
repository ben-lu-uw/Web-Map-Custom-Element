import { test, expect, chromium } from '@playwright/test';

const isVisible = require("./general/isVisible");
const zoomLimit = require("./general/zoomLimit");
const extentProperty = require("./general/extentProperty");

let expectedPCRS = {
  topLeft: {
    horizontal: 1501645.2210838948,
    vertical: -66110.70639331453,
  },
  bottomRight: {
    horizontal: 1617642.4028044068,
    vertical: -222452.18449031282,
  },
}, expectedGCRS = {
  topLeft: {
    horizontal: -76,
    vertical: 45.999999999999936,
  },
  bottomRight: {
    horizontal: -74,
    vertical: 44.99999999999991,
  },
};



test.describe("Playwright mapMLTemplatedFeatures Layer Tests", () => {
  isVisible.test("mapMLTemplatedFeatures.html", 3, 2);
  zoomLimit.test("mapMLTemplatedFeatures.html", 2, 1);
  extentProperty.test("mapMLTemplatedFeatures.html", expectedPCRS, expectedGCRS);

  let page;
  let context;
  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext('');
    page = context.pages().find((page) => page.url() === 'about:blank') || await context.newPage();
    await page.goto("mapMLTemplatedFeatures.html");
  });

  test.afterAll(async function () {
    await context.close();
  });
  
  test.describe("Templated Features Zoom To Extent Tests", () => {
    test("Zoom to layer applies meta extent", async () => {
      const startTopLeft = await page.evaluate(`document.querySelector('#map2').extent.topLeft.pcrs`);
      const startBottomRight = await page.evaluate(`document.querySelector('#map2').extent.bottomRight.pcrs`);
      expect(startTopLeft.horizontal).toBe(1509616.5079163536);
      expect(startTopLeft.vertical).toBe(-170323.5596054569);
      expect(startBottomRight.horizontal).toBe(1511931.6167132407);
      expect(startBottomRight.vertical).toBe(-172638.668402344);
      await page.evaluate(`document.querySelector('#map2 > layer-').focus()`);
      const endTopLeft = await page.evaluate(`document.querySelector('#map2').extent.topLeft.pcrs`);
      const endBottomRight = await page.evaluate(`document.querySelector('#map2').extent.bottomRight.pcrs`);
      expect(endTopLeft.horizontal).toBe(1508601.8288036585);
      expect(endTopLeft.vertical).toBe(-169068.77063754946);
      expect(endBottomRight.horizontal).toBe(1512570.5867411792);
      expect(endBottomRight.vertical).toBe(-173037.52857506275);
    });
  });
  
  test.describe("Retreived Features Loading Tests", () => {

    test("Loading in tilematrix feature", async () => {
      await page.waitForTimeout(200);
      const feature = await page.$eval(
        "xpath=//html/body/map/div >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > div:nth-child(1) > div.leaflet-layer.mapml-templatedlayer-container > div > div > svg > g > g:nth-child(3) > path.leaflet-interactive",
        (tile) => tile.getAttribute("d")
      );
      expect(feature).toEqual("M382 -28L809 -28L809 399L382 399z");
    });

    test("Loading in pcrs feature", async () => {
      const feature = await page.$eval(
        "xpath=//html/body/map/div >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > div:nth-child(1) > div.leaflet-layer.mapml-templatedlayer-container > div > div > svg > g > g:nth-child(1) > path.leaflet-interactive",
        (tile) => tile.getAttribute("d")
      );
      expect(feature).toEqual("M88 681L21 78L-436 201L-346 561z");
    });

    test("Loading in tcrs feature", async () => {
      const feature = await page.$eval(
        "xpath=//html/body/map/div >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > div:nth-child(1) > div.leaflet-layer.mapml-templatedlayer-container > div > div > svg > g > g:nth-child(2) > path.leaflet-interactive",
        (tile) => tile.getAttribute("d")
      );
      expect(feature).toEqual("M307 456L599 467L612 629L381 599z");
    });
  });
});
