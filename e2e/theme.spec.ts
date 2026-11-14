import { test, expect } from '@playwright/test';

/**
 * Guards the bright theme: the client rejected the dark theme, so a dark page canvas or large
 * dark panel must not creep back in, and text on solid colour fills must stay readable.
 */
const ROUTES = [
  '/', '/services', '/pricing', '/quote', '/contact', '/service-areas', '/faq', '/about', '/privacy', '/terms',
  '/services/house-removals', '/nonexistent-page',
];

test('page canvas is bright on every route', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ROUTES) {
    await page.goto(route);
    const lum = await page.evaluate(() => {
      const m = getComputedStyle(document.body).backgroundColor.match(/\d+(\.\d+)?/g)?.map(Number) ?? [255, 255, 255];
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
    });
    expect(lum, `${route} body background luminance`).toBeGreaterThan(0.85);
  }
});

test('no large dark panels on any route (logo badges and selected chips excepted)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const offenders: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const found = await page.evaluate(() => {
      const lum = (c: string) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return 1;
        const [R, G, B, A = 1] = m[1].split(',').map(Number);
        if (A < 0.5) return 1;
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(R) + 0.7152 * f(G) + 0.0722 * f(B);
      };
      const out: string[] = [];
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.display === 'none' || r.width * r.height < 20000) continue;
        if (el.closest('.mrk-logo-badge, button, [role="tab"]')) continue;
        if (lum(cs.backgroundColor) < 0.12) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')}`);
      }
      return out;
    });
    for (const o of found) offenders.push(`${route}: ${o}`);
  }
  expect(offenders).toEqual([]);
});

test('closing call-to-action keeps white text on its ruby fill', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { name: 'Ready to plan your move?' });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)');
  const call = heading.locator('xpath=..').getByRole('link', { name: /call 0423 653 342/i });
  await expect(call).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('primary buttons are glossy ruby with white text', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByRole('button', { name: 'Get a Free Quote' }).first();
  await expect(cta).toHaveCSS('color', 'rgb(255, 255, 255)');
  const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg).toContain('gradient');
});
