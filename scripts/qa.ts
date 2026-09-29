import { chromium, type BrowserContext, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { projects, services, localities, articles } from "../src/lib/content";
const routes = [
  "/",
  "/work",
  "/services",
  "/studio",
  "/process",
  "/journal",
  "/locations",
  "/contact",
  "/configure",
  "/estimator",
  "/thank-you?demo=1",
  "/privacy",
  "/terms",
  "/accessibility",
  "/admin",
  "/this-page-does-not-exist",
  ...projects.map((p) => "/work/" + p.slug),
  ...services.map((p) => "/services/" + p.slug),
  ...localities.map((p) => "/locations/" + p.slug),
  ...articles.map((p) => "/journal/" + p.slug),
];
async function proxy(context: BrowserContext, base: string) {
  if (process.env.QA_PROXY !== "true") return;
  await context.route(base + "/**", async (route) => {
    const req = route.request();
    const headers = req.headers();
    delete headers.host;
    const body = req.postDataBuffer();
    const response = await fetch(req.url(), {
      method: req.method(),
      headers,
      body: ["GET", "HEAD"].includes(req.method())
        ? undefined
        : body
          ? new Uint8Array(body).buffer
          : undefined,
    });
    const h = Object.fromEntries(response.headers);
    delete h["content-encoding"];
    delete h["content-length"];
    await route.fulfill({
      status: response.status,
      headers: h,
      body: Buffer.from(await response.arrayBuffer()),
    });
  });
}
async function render(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    images.forEach((i) => (i.loading = "eager"));
    await Promise.all(images.map((i) => i.decode().catch(() => {})));
  });
}
async function run() {
  await mkdir("qa-results", { recursive: true });
  const base = process.env.QA_BASE_URL || "http://localhost:3200";
  const server = process.env.QA_BASE_URL
    ? null
    : spawn(
        process.execPath,
        [require.resolve("next/dist/bin/next"), "start", "--port", "3200"],
        { stdio: "ignore" },
      );
  const contexts: BrowserContext[] = [];
  const browser = process.env.AGENT_BROWSER_CDP
    ? await chromium.connectOverCDP(process.env.AGENT_BROWSER_CDP)
    : await chromium.launch({ headless: true });
  try {
    let ready = false;
    for (let i = 0; i < 90; i++) {
      try {
        if ((await fetch(base)).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }
    if (!ready) throw new Error("Production preview did not start.");
    const states = [1440, 390].flatMap((width) =>
      routes.map((path) => ({ width, path })),
    );
    const results: unknown[] = Array(states.length);
    let next = 0;
    let failed = 0;
    const worker = async () => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      contexts.push(context);
      await proxy(context, base);
      const page = await context.newPage();
      for (;;) {
        const index = next++;
        if (index >= states.length) break;
        const { width, path } = states[index];
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 1000,
        });
        const errors: string[] = [];
        const onError = (e: Error) => errors.push(e.message);
        page.on("pageerror", onError);
        const response = await page.goto(base + path, {
          waitUntil: "networkidle",
          timeout: 90000,
        });
        await render(page);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        const audit = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        const violations = audit.violations.filter((v) =>
          ["critical", "serious"].includes(v.impact || ""),
        );
        const title = await page.title();
        const description = await page
          .locator("meta[name=description]")
          .getAttribute("content");
        const brokenImages = await page.evaluate(() =>
          Array.from(document.images)
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
        );
        await page.screenshot({
          path: `qa-results/${path.replace(/\W/g, "-") || "home"}-${width}.png`,
          fullPage: true,
        });
        const row = {
          path,
          width,
          status: response?.status(),
          overflow,
          errors,
          violations: violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
          title,
          titleLength: title.length,
          descriptionLength: description?.length,
          brokenImages,
        };
        results[index] = row;
        if (
          overflow ||
          errors.length ||
          violations.length ||
          brokenImages.length ||
          (response?.status() || 500) >= 500 ||
          title.length > 60 ||
          (description?.length || 0) > 155
        )
          failed++;
        console.log(
          path,
          width,
          "status",
          row.status,
          "serious",
          violations.length,
          "overflow",
          overflow,
        );
        page.off("pageerror", onError);
      }
    };
    await Promise.all(
      Array.from({ length: Number(process.env.QA_WORKERS || 3) }, worker),
    );
    await writeFile(
      "qa-results/report.json",
      JSON.stringify(
        {
          routes: routes.length,
          viewports: [1440, 390],
          failingStates: failed,
          results,
        },
        null,
        2,
      ),
    );
    const page = await contexts[0].newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("button", { name: "Close navigation menu" }).click();
    await page.goto(base + "/work");
    await page
      .getByRole("button", { name: "Open image preview:", exact: false })
      .first()
      .click();
    await page.keyboard.press("Escape");
    await page.getByLabel("Search projects").fill("definitely-no-match");
    await page
      .getByRole("button", { name: "Show all projects", exact: true })
      .click();
    if (failed) throw new Error(`${failed} states failed quality gates`);
    console.log("All route accessibility/layout/SEO gates passed.");
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    if (!process.env.AGENT_BROWSER_CDP) await browser.close();
    server?.kill("SIGTERM");
  }
}
run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
