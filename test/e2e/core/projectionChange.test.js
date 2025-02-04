import { test, expect, chromium } from '@playwright/test';

test.describe("Playwright Projection Change Tests", () => {
  let page;
  let context;
  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext('');
    page = context.pages().find((page) => page.url() === 'about:blank') || await context.newPage();
    await page.goto("projectionChange.html");
  });

  test.afterAll(async function () {
    await context.close();
  });

  test.describe("Linked Feature Projection Change Tests", () => {
    test("_self Linked Feature Change To OSMTILE", async () => {
      for(let i = 0; i < 2; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(200);
      }
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      const isChecked = await page.$eval(
        "body > map:nth-child(1) > layer-",
        (layer) => layer.checked
      );
      const isDisabled = await page.$eval(
        "body > map:nth-child(1) > layer-",
        (layer) => layer.disabled
      );
      expect(isChecked).toBeTruthy();
      expect(isDisabled).toEqual(false);
    });

    test("_parent Linked Feature Change To OSMTILE", async () => {
      for(let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(200);
      }
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      const isChecked = await page.$eval(
        "body > map:nth-child(1) > layer-",
        (layer) => layer.checked
      );
      const isDisabled = await page.$eval(
        "body > map:nth-child(1) > layer-",
        (layer) => layer.disabled
      );
      expect(isChecked).toBeTruthy();
      expect(isDisabled).toEqual(false);
    });

    test("Debug components update with projection changes", async () => {
      await page.reload();
      await page.$eval(
        "body > map:nth-child(1)",
        (map) => map.toggleDebug()
      );

      const colBefore = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("col")
      );
      const rowBefore = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("row")
      );
      const zoomBefore = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("zoom")
      );

      const centerBefore = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)",
        (path) => path.getAttribute("d")
      );

      for(let i = 0; i < 2; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(200);
      }
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);

      const colAfter = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("col")
      );
      const rowAfter = await page.$eval(
        "xpath=//html/body/map[1] >> css=div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("row")
      );
      const zoomAfter = await page.$eval(
        "xpath=//html/body/map[1] >> css=div.leaflet-pane.leaflet-map-pane > div.leaflet-layer.mapml-debug-grid > div > div:nth-child(1)",
        (tile) => tile.getAttribute("zoom")
      );

      const centerAfter = await page.$eval(
        "xpath=//html/body/map[1] >> css=div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)",
        (path) => path.getAttribute("d")
      );

      expect(colBefore).toEqual("10");
      expect(rowBefore).toEqual("11");
      expect(zoomBefore).toEqual("2");
      expect(colAfter).toEqual("0");
      expect(rowAfter).toEqual("0");
      expect(zoomAfter).toEqual("0");
      expect(centerBefore).toEqual("M132.64578432000008,238.45862407874074a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0 ");
      expect(centerAfter).toEqual("M249,250a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0 ");
    });
  });
});