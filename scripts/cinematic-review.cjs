const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const sharp = require("sharp");
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const rows = [];
    const browserErrors = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    fs.mkdirSync("docs/screenshots/cinematic", { recursive: true });
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.goto("http://127.0.0.1:4173/");
      await page.waitForLoadState("networkidle");
      await page.locator(".hero-art img").evaluate((element) => {
        const animation = element.getAnimations()[0];
        animation.pause();
        animation.currentTime = 100;
        animation.play();
      });
      const before = await page
        .locator(".hero-art img")
        .evaluate((e) => getComputedStyle(e).transform);
      await page.waitForTimeout(180);
      const after = await page
        .locator(".hero-art img")
        .evaluate((e) => getComputedStyle(e).transform);
      rows.push({
        width,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        truck: await page.locator(".hero-art img").evaluate((e) => ({
          loaded: e.naturalWidth > 0,
          source: e.currentSrc,
        })),
        motion: before !== after,
      });
      for (
        let y = 0;
        y < (await page.evaluate(() => document.body.scrollHeight));
        y += 650
      ) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(90);
      }
      // Decode lazy imagery before capturing the entire document.
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => element.decode());
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(850);
      await sharp(await page.screenshot({ fullPage: true }))
        .webp({ quality: 88 })
        .toFile(`docs/screenshots/cinematic/home-${width}.webp`);
      if ([390, 1440].includes(width))
        await sharp(await page.screenshot())
          .webp({ quality: 90 })
          .toFile(`docs/screenshots/cinematic/hero-${width}.webp`);
    }
    fs.writeFileSync(
      "docs/screenshots/cinematic/viewports.json",
      JSON.stringify(rows, null, 2),
    );
    fs.writeFileSync(
      "docs/screenshots/cinematic/browser-errors.json",
      JSON.stringify(browserErrors, null, 2),
    );
    console.log(JSON.stringify({ rows, browserErrors }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
