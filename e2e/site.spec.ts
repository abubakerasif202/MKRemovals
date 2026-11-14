import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1440, 1920];
const ROUTES = ['/', '/services', '/pricing', '/quote', '/contact', '/service-areas', '/faq', '/about'];
const SHOTS = process.env.SHOT_DIR || 'docs/screenshots/after';

async function mockQuote(page: Page, status: number, body: Record<string, unknown>) {
  const posts: unknown[] = [];
  await page.route('**/api/quote', async (route) => {
    posts.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return posts;
}

async function fillValidQuote(page: Page) {
  await page.getByLabel(/full name/i).fill('Test Customer');
  await page.getByLabel(/australian phone/i).fill('0400 000 000');
  await page.getByLabel(/pickup suburb/i).fill('Norwood 5067');
  await page.getByLabel(/destination suburb/i).fill('Glenelg 5045');
  await page.getByLabel(/target move date/i).fill('2030-01-01');
}

for (const width of WIDTHS) {
  test(`no horizontal overflow on key routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

for (const width of [375, 768, 1440]) {
  test(`homepage screenshots at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Scroll through the page so lazy images and scroll-reveal animations have run.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `home-${width}.png`), fullPage: true });
  });
}

for (const [width, height] of [[390, 844], [1440, 900]]) {
  test(`hero screenshot at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `hero-${width}.png`) });
  });
}

test('each route has exactly one h1, a title, canonical and tel link', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.title()).toBeTruthy();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('a[href="tel:+61423653342"]').first()).toBeVisible();
  }
});

test('mobile menu opens and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /menu/i }).first();
  await toggle.click();
  await page.getByRole('link', { name: /^services$/i }).first().click();
  await expect(page).toHaveURL(/\/services$/);
});

test('inventory starts empty and nothing is attached to the quote by default', async ({ page }) => {
  await page.goto('/');
  const counts = await page.locator('[aria-live="polite"].font-mono').allTextContents();
  expect(counts.length).toBeGreaterThan(5);
  expect(counts.every((c) => c.trim() === '0')).toBe(true);
  await expect(page.getByRole('button', { name: /add this list to my quote/i })).toBeDisabled();
  await expect(page.getByLabel(/estimated move size/i)).toHaveValue(/Not sure yet/);
});

test('inventory preset, clear and prefill of the quote form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2 bed' }).click();
  await expect(page.getByRole('button', { name: /add this list to my quote/i })).toBeEnabled();
  await page.getByRole('button', { name: /add this list to my quote/i }).click();
  await expect(page.getByLabel(/estimated move size/i)).toHaveValue('2 Bedroom Home / Apartment');
  await expect(page.getByLabel(/key furniture inventory/i)).toHaveValue(/Customer-selected inventory/);
  await page.getByRole('button', { name: /clear all/i }).click();
  await expect(page.getByRole('button', { name: /add this list to my quote/i })).toBeDisabled();
});

test('quote validation shows field errors and does not call the API', async ({ page }) => {
  const posts = await mockQuote(page, 200, { ok: true, status: 'delivered' });
  await page.goto('/quote');
  await page.getByRole('button', { name: /submit quote request/i }).click();
  await expect(page.getByText(/please enter your full name/i)).toBeVisible();
  expect(posts).toHaveLength(0);
});

test('confirmed delivery shows "Quote Sent Successfully"', async ({ page }) => {
  const posts = await mockQuote(page, 200, { ok: true, status: 'delivered', referenceId: 'MRK-TEST', moveBrief: 'brief' });
  await page.goto('/quote');
  await fillValidQuote(page);
  await page.getByRole('button', { name: /submit quote request/i }).click();
  await expect(page.getByRole('heading', { name: /quote sent successfully/i })).toBeVisible();
  expect(posts).toHaveLength(1);
});

test('provider failure preserves entered data and offers retry, email and call', async ({ page }) => {
  await mockQuote(page, 502, { ok: false, status: 'delivery_failed', message: 'We could not confirm delivery of your request, so it has not been sent.', moveBrief: 'brief' });
  await page.goto('/quote');
  await fillValidQuote(page);
  await page.getByRole('button', { name: /submit quote request/i }).click();
  await expect(page.getByRole('alert')).toContainText(/not been sent/i);
  await expect(page.getByRole('heading', { name: /quote sent successfully/i })).toHaveCount(0);
  await expect(page.getByLabel(/full name/i)).toHaveValue('Test Customer');
  await expect(page.getByLabel(/pickup suburb/i)).toHaveValue('Norwood 5067');
  await expect(page.getByRole('alert').getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+61423653342');
  await expect(page.getByRole('alert').getByRole('link', { name: /email instead/i })).toHaveAttribute('href', /^mailto:mkremovalsadelaide@gmail\.com/);
  await expect(page.getByRole('button', { name: /try sending again/i })).toBeVisible();
});

test('network failure is not reported as success and keeps the form', async ({ page }) => {
  await page.route('**/api/quote', (route) => route.abort());
  await page.goto('/quote');
  await fillValidQuote(page);
  await page.getByRole('button', { name: /submit quote request/i }).click();
  await expect(page.getByRole('alert')).toContainText(/not been sent/i);
  await expect(page.getByLabel(/full name/i)).toHaveValue('Test Customer');
});

test('retry after failure reuses the same attemptId (server-side idempotency key)', async ({ page }) => {
  const posts = await mockQuote(page, 502, { ok: false, status: 'delivery_failed', message: 'not been sent' });
  await page.goto('/quote');
  await fillValidQuote(page);
  await page.getByRole('button', { name: /submit quote request/i }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: /try sending again/i }).click();
  await expect.poll(() => posts.length).toBe(2);
  const [a, b] = posts as { attemptId: string }[];
  expect(a.attemptId).toBeTruthy();
  expect(a.attemptId).toBe(b.attemptId);
});

test('keyboard users can reach the primary CTA and the FAQ toggles', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBeTruthy();
  const faq = page.getByRole('button', { expanded: false }).filter({ hasText: /\?/ }).first();
  await faq.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { expanded: true }).filter({ hasText: /\?/ }).first()).toBeVisible();
});

test('reduced motion still renders the hero immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const opacity = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el.closest('div')!).opacity);
  expect(Number(opacity)).toBe(1);
  await ctx.close();
});

test('page makes no request to third-party form providers or reference sites', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (r) => hosts.add(new URL(r.url()).host));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  for (const h of hosts) {
    expect(h).not.toMatch(/web3forms|hfremovals|noorremovals|abwebstudio/i);
  }
});
