import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const widths = [320, 360, 375, 390, 414, 430, 768, 1024, 1440, 1920];
const outDir = path.resolve('docs/screenshots/after');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  // Wait for server to be ready
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('http://127.0.0.1:4173')) resolve();
    });
    server.stderr.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('error')) console.error(msg);
    });
    setTimeout(resolve, 3000);
  });

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const w of widths) {
    const h = w < 768 ? 844 : 900;
    await page.setViewportSize({ width: w, height: h });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

    // Check horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const overflow = scrollWidth > clientWidth;
    console.log(`Viewport ${w}x${h} - scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${overflow}`);

    // Take full page screenshot
    const homePath = path.join(outDir, `home-${w}.png`);
    await page.screenshot({ path: homePath, fullPage: true });

    // Take hero screenshot
    const heroEl = await page.$('section[aria-labelledby="hero-heading"]');
    if (heroEl) {
      const heroPath = path.join(outDir, `hero-${w}.png`);
      await heroEl.screenshot({ path: heroPath });
    }
  }

  await browser.close();
  server.kill();
  console.log('All screenshots captured successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
