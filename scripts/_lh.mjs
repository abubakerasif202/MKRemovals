import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runs = [
  ['mobile', '/'],
  ['desktop', '/'],
  ['mobile', '/services'],
  ['mobile', '/quote'],
];

async function main() {
  console.log('Starting preview server for Lighthouse...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      if (d.toString().includes('http://127.0.0.1:4173')) resolve();
    });
    setTimeout(resolve, 3000);
  });

  const rows = [];
  for (const [preset, route] of runs) {
    const out = path.join(os.tmpdir(), `lh-${preset}-${route.replace(/\//g, '_') || 'home'}.json`);
    const args = ['-y', 'lighthouse', `http://127.0.0.1:4173${route}`, '--output=json', `--output-path=${out}`,
      '--only-categories=performance,accessibility,best-practices', '--chrome-flags=--headless=new --no-sandbox', '--quiet'];
    if (preset === 'desktop') args.push('--preset=desktop');
    console.log(`Running Lighthouse for ${preset} ${route}...`);
    const res = spawnSync('npx', args, { shell: true, stdio: 'pipe', env: { ...process.env, CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' } });
    if (res.error || !fs.existsSync(out)) {
      console.error(`Error running lighthouse for ${preset} ${route}`);
      continue;
    }
    try {
      const j = JSON.parse(fs.readFileSync(out, 'utf8'));
      const c = j.categories;
      const a = j.audits;
      const row = {
        page: `${preset} ${route}`,
        perf: Math.round(c.performance.score * 100),
        a11y: Math.round(c.accessibility.score * 100),
        bp: Math.round(c['best-practices'].score * 100),
        FCP: a['first-contentful-paint']?.displayValue,
        LCP: a['largest-contentful-paint']?.displayValue,
        TBT: a['total-blocking-time']?.displayValue,
        CLS: a['cumulative-layout-shift']?.displayValue,
      };
      rows.push(row);
      console.log(JSON.stringify(row, null, 2));
    } catch (e) {
      console.error('Failed to parse LH output:', e);
    }
  }

  server.kill();
  console.log('\n--- FINAL LIGHTHOUSE REPORT ---');
  console.table(rows);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
