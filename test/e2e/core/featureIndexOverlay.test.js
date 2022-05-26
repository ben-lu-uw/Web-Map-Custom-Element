describe("Feature Index Overlay test", ()=> {
    beforeAll(async () => {
        await page.goto(PATH + "featureIndexOverlay.html");
    });

    afterAll(async function () {
        await context.close();
    });

    test("Feature index overlay and reticle shows on focus", async () => {
        const hiddenOverlay = await page.$eval(
            "div > output.mapml-feature-index",
            (output) => output.classList.contains("mapml-screen-reader-output")
        );
        const hiddenReticle = await page.$eval(
            "div > div.mapml-feature-index-box",
            (div) => div.hasAttribute("hidden")
        );

        await page.keyboard.press("Tab");
        await page.waitForTimeout(500);
        const afterTabOverlay = await page.$eval(
            "div > output.mapml-feature-index",
            (output) => output.classList.contains("mapml-screen-reader-output")
        );
        const afterTabReticle = await page.$eval(
            "div > div.mapml-feature-index-box",
            (div) => div.hasAttribute("hidden")
        );

        await expect(hiddenOverlay).toEqual(true);
        await expect(hiddenReticle).toEqual(true);
        await expect(afterTabOverlay).toEqual(false);
        await expect(afterTabReticle).toEqual(false);
    });

    test("Feature index content is correct", async () => {
        const spanCount = await page.$eval(
            "div > output.mapml-feature-index > span",
            (span) => span.childElementCount
        );
        const firstFeature = await page.$eval(
            "div > output.mapml-feature-index > span > span:nth-child(1)",
            (span) => span.innerText
        );
        const moreResults = await page.$eval(
            "div > output.mapml-feature-index > span > span:nth-child(8)",
            (span) => span.innerText
        );

        await expect(spanCount).toEqual(8);
        await expect(firstFeature).toContain("1 Vermont");
        await expect(moreResults).toContain("9 More results");
    });

    test("Feature index more results are correct", async () => {
        await page.keyboard.press("9");
        await page.waitForTimeout(500);

        const spanCount = await page.$eval(
            "div > output.mapml-feature-index > span",
            (span) => span.childElementCount
        );
        const firstFeature = await page.$eval(
            "div > output.mapml-feature-index > span > span:nth-child(1)",
            (span) => span.innerText
        );
        const prevResults = await page.$eval(
            "div > output.mapml-feature-index > span > span:nth-child(5)",
            (span) => span.innerText
        );

        await expect(spanCount).toEqual(5);
        await expect(firstFeature).toContain("1 Pennsylvania");
        await expect(prevResults).toContain("8 Previous results");
    });

    test("Feature index previous results are correct", async () => {
        await page.keyboard.press("8");
        const spanCount = await page.$eval(
            "div > output.mapml-feature-index > span",
            (span) => span.childElementCount
        );

        await expect(spanCount).toEqual(8);
    });

    test("Feature index content is correct on moveend", async () => {
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(1000);
        const spanCount = await page.$eval(
            "div > output.mapml-feature-index > span",
            (span) => span.childElementCount
        );
        const firstFeature = await page.$eval(
            "div > output.mapml-feature-index > span > span:nth-child(1)",
            (span) => span.innerText
        );

        await expect(spanCount).toEqual(2);
        await expect(firstFeature).toContain("1 Maine");
    });

    test("Feature index overlay is hidden when empty, reticle still visible", async () => {
        await page.keyboard.press("ArrowUp");
        await page.waitForTimeout(1000);

        const overlay = await page.$eval(
            "div > output.mapml-feature-index",
            (output) => output.classList.contains("mapml-screen-reader-output")
        );
        const reticle = await page.$eval(
            "div > div.mapml-feature-index-box",
            (div) => div.hasAttribute("hidden")
        );

        await expect(overlay).toEqual(true);
        await expect(reticle).toEqual(false);
    });

    test("Popup test with templated features", async () => {
        await page.mouse.click(10, 600);
        await page.waitForTimeout(500);
        await page.focus('#map2 > div');
        await page.waitForTimeout(500);

        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(1000);
        await page.keyboard.press("Control+ArrowUp");
        await page.waitForTimeout(1000);

        await page.keyboard.press("1");
        await page.waitForTimeout(500);

        const popupCount = await page.$eval(
            "#map2 > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane",
            (popup) => popup.childElementCount
        );
        const popupName = await page.$eval(
            "#map2 > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane",
            (popup) => popup.children[0].innerText
        );

        await expect(popupCount).toEqual(1);
        await expect(popupName).toContain("Hareg Cafe & Variety");
    });

    test("Opening another popup with index keys closes already open popup", async () => {
        await page.keyboard.press("2");
        await page.waitForTimeout(500);

        const popupCount = await page.$eval(
            "#map2 > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane",
            (popup) => popup.childElementCount
        );
        const popupName = await page.$eval(
            "#map2 > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane",
            (popup) => popup.children[0].innerText
        );
        const overlay = await page.$eval(
            "#map2 > div > output.mapml-feature-index",
            (output) => output.classList.contains("mapml-screen-reader-output")
        );

        await expect(popupCount).toEqual(1);
        await expect(popupName).toContain("Banditos");
        await expect(overlay).toEqual(false);
    });

});