import { test, expect } from "@playwright/test";

test("cinematic composition retains all major sections and approved offerings", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinema-hero h1")).toContainText(
    "planned with precision.",
  );
  await expect(page.locator(".trust-tile")).toHaveCount(4);
  await expect(page.locator(".cinema-editorial")).toHaveCount(3);
  await expect(page.locator(".specialist-card")).toHaveCount(3);
  await expect(page.locator(".process-step")).toHaveCount(4);
  await expect(page.locator(".cinema-rate")).toContainText("$130–$135");
  await expect(page.locator(".pricing-section")).toContainText(
    "3-hour minimum",
  );
  await expect(page.locator(".pricing-section")).toContainText(
    "1-hour call-out",
  );
  await expect(page.locator(".specialist-grid")).not.toContainText(
    "Interstate",
  );
  await expect
    .poll(() =>
      page
        .locator(".hero-art img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
});

test("coverage tabs support keyboard navigation and update the area link", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  const firstHref = await page.locator("#area-panel a").getAttribute("href");
  await page.keyboard.press("End");
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  expect(await page.locator("#area-panel a").getAttribute("href")).not.toBe(
    firstHref,
  );
});

test("homepage quote preserves confirmed delivery and failure retry semantics", async ({
  page,
}) => {
  const attempts: { attemptId: string }[] = [];
  await page.route("**/api/quote", async (route) => {
    attempts.push(route.request().postDataJSON());
    await route.fulfill({
      status: attempts.length === 1 ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        attempts.length === 1
          ? {
              ok: false,
              status: "delivery_failed",
              message: "Delivery has not been confirmed.",
            }
          : { ok: true, status: "delivered", referenceId: "MRK-QA" },
      ),
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Get a Free Quote", exact: true })
    .click();
  await page.getByLabel(/full name/i).fill("QA Customer");
  await page.getByLabel(/australian phone/i).fill("0400 000 000");
  await page.getByLabel(/pickup suburb/i).fill("Norwood 5067");
  await page.getByLabel(/destination suburb/i).fill("Glenelg 5045");
  await page.getByLabel(/target move date/i).fill("2030-01-01");
  await page.getByRole("button", { name: /submit quote request/i }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel(/full name/i)).toHaveValue("QA Customer");
  await page.getByRole("button", { name: /try sending again/i }).click();
  await expect(
    page.getByRole("heading", { name: /quote sent successfully/i }),
  ).toBeVisible();
  expect(attempts).toHaveLength(2);
  expect(attempts[0].attemptId).toBe(attempts[1].attemptId);
});

test("motion runs on desktop and mobile and is disabled by reduced motion", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.bringToFront();
    const art = page.locator(".hero-art img");
    await art.evaluate((el) => {
      const animation = el.getAnimations()[0];
      if (!animation) throw new Error("Truck entrance animation is missing");
      animation.pause();
      animation.currentTime = 100;
    });
    const before = await art.evaluate((el) => getComputedStyle(el).transform);
    await art.evaluate((el) => el.getAnimations()[0].play());
    await expect
      .poll(() => art.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(before);
    await page.locator(".editorial-2").scrollIntoViewIfNeeded();
    await expect(
      page.locator(".editorial-2 [data-reveal]").first(),
    ).toHaveClass(/cinema-enter/);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(art).toHaveCSS("animation-name", "none");
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("mobile actions follow client navigation and never cover the quote form", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto("/");
  await expect(page.locator(".trust-tile").first()).toHaveClass(/cinema-enter/);
  await page.locator(".header-quote").click();
  await expect(page).toHaveURL(/\/quote$/);
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: "instant" }));
  await expect(
    page.getByRole("form", { name: "Request a Moving Quote Form" }),
  ).toBeInViewport();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(
    page.locator('[aria-label="Mobile Quick Conversion Actions"]'),
  ).not.toBeVisible();
});
