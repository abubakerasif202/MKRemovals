const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("@playwright/test");
fs.mkdirSync("docs/audit/cinematic", { recursive: true });
const results = [];
for (const mode of ["mobile", "desktop"]) {
  const output = path.resolve(`docs/audit/cinematic/lighthouse-${mode}.json`);
  const args = [
    "--yes",
    "lighthouse",
    "http://127.0.0.1:4173/",
    "--output=json",
    `--output-path=${output}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless=new --no-sandbox",
    "--quiet",
  ];
  if (mode === "desktop") args.push("--preset=desktop");
  const result = spawnSync("npx.cmd", args, {
    shell: true,
    encoding: "utf8",
    env: { ...process.env, CHROME_PATH: chromium.executablePath() },
  });
  if (result.status !== 0) {
    console.error(result.stderr);
    process.exitCode = 1;
    continue;
  }
  const report = JSON.parse(fs.readFileSync(output, "utf8"));
  results.push({
    mode,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([k, v]) => [
        k,
        Math.round(v.score * 100),
      ]),
    ),
    lcp: report.audits["largest-contentful-paint"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
    tbt: report.audits["total-blocking-time"].numericValue,
    failed: Object.entries(report.audits)
      .filter(
        ([k, a]) =>
          a.score !== null && a.score < 1 && a.details?.type === "table",
      )
      .map(([key, a]) => ({ key, title: a.title, items: a.details.items })),
  });
}
fs.writeFileSync(
  "docs/audit/cinematic/lighthouse-summary.json",
  JSON.stringify(results, null, 2),
);
console.log(
  JSON.stringify(
    results.map(({ failed, ...row }) => row),
    null,
    2,
  ),
);
