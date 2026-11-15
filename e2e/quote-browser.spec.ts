import { test, expect, type Page } from "@playwright/test";
const referenceId = "MRK-2026-BTEST";
const delivery = {
  ticket: "signed-test-ticket",
  referenceId,
  payload: {
    access_key: "00000000-0000-4000-8000-000000000001",
    subject: "Mocked quote",
    name: "Test Customer",
    message: "Mocked move brief",
  },
};
async function fill(page: Page) {
  await page.getByLabel(/full name/i).fill("Test Customer");
  await page.getByLabel(/australian phone/i).fill("0400 000 000");
  await page.getByLabel(/pickup suburb/i).fill("Norwood 5067");
  await page.getByLabel(/destination suburb/i).fill("Glenelg 5045");
  await page.getByLabel(/target move date/i).fill("2030-01-01");
}
async function setup(
  page: Page,
  provider: "accept" | "reject" | "network",
  receiptFailure = false,
) {
  const starts: { attemptId: string }[] = [];
  const reports: { accepted: boolean }[] = [];
  const sends: unknown[] = [];
  await page.route("**/api/quote", async (route) => {
    const body = route.request().postDataJSON();
    if (body.action === "browser-result") {
      reports.push(body);
      await route.fulfill({
        status: receiptFailure ? 503 : 200,
        json: { ok: !receiptFailure, status: "browser_report_recorded" },
      });
    } else {
      starts.push(body);
      await route.fulfill({
        json: {
          ok: false,
          status: "browser_delivery_required",
          referenceId,
          moveBrief: "Move brief",
          browserDelivery: delivery,
        },
      });
    }
  });
  await page.route("https://api.web3forms.com/**", async (route) => {
    sends.push(route.request().postDataJSON());
    if (provider === "network") await route.abort();
    else
      await route.fulfill({
        headers: { "access-control-allow-origin": "*" },
        json: { success: provider === "accept" },
      });
  });
  return { starts, reports, sends };
}
for (const route of ["/", "/contact", "/quote"]) {
  test(`browser-only Web3Forms accepts exactly one quote on ${route}`, async ({
    page,
  }) => {
    const observed = await setup(page, "accept");
    await page.goto(route);
    await fill(page);
    await page.getByRole("button", { name: /submit quote request/i }).click();
    await expect(
      page.getByRole("heading", { name: /quote sent successfully/i }),
    ).toBeVisible();
    expect(observed.sends).toHaveLength(1);
    expect(observed.starts).toHaveLength(1);
    expect(observed.reports).toHaveLength(1);
    expect(observed.reports[0].accepted).toBe(true);
    expect(observed.starts[0].attemptId).toBeTruthy();
  });
}

test("browser rejection preserves fields and reuses the attempt on an explicit retry", async ({
  page,
}) => {
  const observed = await setup(page, "reject");
  await page.goto("/contact");
  await fill(page);
  await page.getByRole("button", { name: /submit quote request/i }).click();
  await expect(page.getByRole("alert")).toContainText("not accepted");
  await expect(page.getByLabel(/full name/i)).toHaveValue("Test Customer");
  await expect(
    page.getByRole("heading", { name: /quote sent successfully/i }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /try sending again/i }).click();
  await expect.poll(() => observed.reports.length).toBe(2);
  expect(observed.starts[0].attemptId).toBe(observed.starts[1].attemptId);
  expect(observed.sends).toHaveLength(2);
  expect(observed.reports.every((report) => !report.accepted)).toBe(true);
});

test("browser network ambiguity warns about duplicate risk and never automatically resends", async ({
  page,
}) => {
  const observed = await setup(page, "network");
  await page.goto("/quote");
  await fill(page);
  await page.getByRole("button", { name: /submit quote request/i }).click();
  await expect(page.getByRole("alert")).toContainText("before retrying");
  await expect(page.getByLabel(/full name/i)).toHaveValue("Test Customer");
  expect(observed.sends).toHaveLength(1);
  expect(observed.reports[0].accepted).toBe(false);
});

test("provider acceptance survives receipt bookkeeping failure without another email", async ({
  page,
}) => {
  const observed = await setup(page, "accept", true);
  await page.goto("/quote");
  await fill(page);
  await page.getByRole("button", { name: /submit quote request/i }).click();
  await expect(
    page.getByRole("heading", { name: /quote sent successfully/i }),
  ).toBeVisible();
  expect(observed.sends).toHaveLength(1);
});
