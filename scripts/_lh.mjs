import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runs = [
  ['mobile', '/'],
  ['desktop', '/'],
  ['mobile', '/pricing'],
  ['mobile', '/quote'],
  ['mobile', '/about'],
];
const rows = [];
for (const [preset, route] of runs) {
  const out = path.join(os.tmpdir(), `lh-${preset}-${route.replace(/\//g, '_') || 'home'}.json`);
  const args = ['-y', 'lighthouse', `http://127.0.0.1:4173${route}`, '--output=json', `--output-path=${out}`,
    '--only-categories=performance,accessibility,best-practices', '--chrome-flags=--headless=new --no-sandbox', '--quiet'];
  if (preset === 'desktop') args.push('--preset=desktop');
  spawnSync('npx', args, { shell: true, stdio: 'ignore', env: { ...process.env, CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' } });
  const j = JSON.parse(fs.readFileSync(out, 'utf8'));
  const c = j.categories;
  const a = j.audits;
  const row = {
    page: `${preset} ${route}`,
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c['best-practices'].score * 100),
    FCP: a['first-contentful-paint'].displayValue,
    LCP: a['largest-contentful-paint'].displayValue,
    TBT: a['total-blocking-time'].displayValue,
    CLS: a['cumulative-layout-shift'].displayValue,
  };
  rows.push(row);
  console.log(JSON.stringify(row));
}
