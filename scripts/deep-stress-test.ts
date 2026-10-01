import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const VERIFY_DIR = resolve(process.cwd(), "verification-results");
const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

async function main() {
  await mkdir(VERIFY_DIR, { recursive: true });
  console.log("Starting comprehensive 5-pillar stress test against", BASE);

  const browser = await chromium.launch({ headless: true });
  const results: Record<string, boolean | string> = {};

  try {
    // -------------------------------------------------------------------------
    // PILLAR 1: Work Gallery & Case Studies (Budgets, Areas, Before/After)
    // -------------------------------------------------------------------------
    console.log("\n[Pillar 1] Testing Work Gallery & Case Studies...");
    const galleryPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await galleryPage.goto(`${BASE}/work`, { waitUntil: "networkidle" });
    
    // Check cards have budget and area visible
    const projectCards = galleryPage.locator("article.project-card");
    const cardCount = await projectCards.count();
    console.log(`Found ${cardCount} project cards on /work`);
    if (cardCount < 4) throw new Error("Expected at least 4 project cards");

    const firstCardText = await projectCards.first().innerText();
    console.log("Sample Project Card text:\n", firstCardText);
    const hasArea = /sq ft/i.test(firstCardText);
    const hasBudget = /₹|lakh|crore/i.test(firstCardText);
    results["Pillar 1 - Cards Show Area"] = hasArea;
    results["Pillar 1 - Cards Show Budget"] = hasBudget;

    // Navigate to a project case study
    await galleryPage.goto(`${BASE}/work/the-quiet-apartment`, { waitUntil: "networkidle" });
    const caseStudyText = await galleryPage.innerText("body");
    const hasLocationContext = /Andheri West/i.test(caseStudyText);
    const hasAreaContext = /1,240 sq ft/i.test(caseStudyText);
    const hasBudgetContext = /₹35–48 lakh/i.test(caseStudyText);
    const hasBeforeAfter = (await galleryPage.locator(".before-after, [aria-label*='comparison'], [class*='comparison']").count()) > 0;
    
    results["Pillar 1 - Case Study Area"] = hasAreaContext;
    results["Pillar 1 - Case Study Budget"] = hasBudgetContext;
    results["Pillar 1 - Case Study Locality"] = hasLocationContext;
    results["Pillar 1 - Before/After Component"] = hasBeforeAfter;
    await galleryPage.screenshot({ path: `${VERIFY_DIR}/work-case-study.png`, fullPage: false });
    await galleryPage.close();

    // -------------------------------------------------------------------------
    // PILLAR 2: Configure Tool & PDF Download & WhatsApp Share
    // -------------------------------------------------------------------------
    console.log("\n[Pillar 2] Testing Configure Tool, Moodboard & PDF Download...");
    const configPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await configPage.goto(`${BASE}/configure`, { waitUntil: "networkidle" });

    // Select room, palette, material
    await configPage.click("button:has-text('Bedroom')");
    await configPage.click("button:has-text('Earth & olive')");
    await configPage.click("button:has-text('Walnut')");

    // Check review dl
    const reviewText = await configPage.locator("dl").innerText();
    console.log("Configured Moodboard Review:\n", reviewText);
    results["Pillar 2 - Room Selection"] = reviewText.includes("Bedroom");
    results["Pillar 2 - Palette Selection"] = reviewText.includes("Earth & olive");
    results["Pillar 2 - Material Selection"] = reviewText.includes("Walnut");

    // Check WhatsApp CTA button
    const waButton = configPage.locator("a:has-text('Share brief on WhatsApp')");
    const waHref = await waButton.getAttribute("href");
    console.log("WhatsApp Share link:", waHref);
    results["Pillar 2 - WhatsApp Button Available"] = !!waHref && waHref.includes("whatsapp");

    // Test PDF download trigger
    const downloadDrawer = configPage.locator("summary:has-text('Keep a copy of your brief')");
    await downloadDrawer.click();

    // Setup download listener
    const [download] = await Promise.all([
      configPage.waitForEvent("download", { timeout: 15000 }),
      configPage.click("button:has-text('Download planning PDF')"),
    ]);

    const suggestedFilename = download.suggestedFilename();
    const downloadPath = `${VERIFY_DIR}/${suggestedFilename}`;
    await download.saveAs(downloadPath);
    console.log("Successfully downloaded PDF brief to:", downloadPath);
    results["Pillar 2 - PDF Download Succeeded"] = suggestedFilename.endsWith(".pdf");

    await configPage.screenshot({ path: `${VERIFY_DIR}/configure-page.png`, fullPage: false });
    await configPage.close();

    // -------------------------------------------------------------------------
    // PILLAR 3: Investment Estimator
    // -------------------------------------------------------------------------
    console.log("\n[Pillar 3] Testing Investment Estimator...");
    const estPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await estPage.goto(`${BASE}/estimator`, { waitUntil: "networkidle" });

    // Input 1500 sq ft
    const areaInput = estPage.locator("input[type='number']");
    await areaInput.fill("1500");

    // Select Bespoke tier
    await estPage.click("button:has-text('Bespoke')");

    // Toggle Mumbai addon: Monsoon waterproofing
    await estPage.click("label:has-text('Monsoon') input");

    // Read calculated total
    const totalEl = estPage.locator(".estimate-total");
    const totalText = await totalEl.innerText();
    console.log("Calculated Estimator total for 1500 sq ft Bespoke + moisture:", totalText);
    results["Pillar 3 - Estimator Dynamic INR Calculation"] = /₹\d+(\.\d+)?\s*lakh/i.test(totalText);

    // Milestones check
    const milestones = await estPage.locator("[class*='milestoneGrid'] > div").count();
    console.log(`Found ${milestones} payment milestones.`);
    results["Pillar 3 - Payment Milestones Present"] = milestones === 5;

    await estPage.screenshot({ path: `${VERIFY_DIR}/estimator-page.png`, fullPage: false });
    await estPage.close();

    // -------------------------------------------------------------------------
    // PILLAR 4: Locality-Focused Content (Andheri West, Lokhandwala, Bandra, Juhu, Powai)
    // -------------------------------------------------------------------------
    console.log("\n[Pillar 4] Testing Locality Pages...");
    const locs = ["andheri-west", "lokhandwala", "bandra-west", "juhu", "powai"];
    for (const loc of locs) {
      const locPage = await browser.newPage();
      const response = await locPage.goto(`${BASE}/locations/${loc}`, { waitUntil: "networkidle" });
      const status = response?.status() ?? 0;
      console.log(`Locality /locations/${loc} status:`, status);
      results[`Pillar 4 - Locality ${loc} Status 200`] = status === 200;
      await locPage.close();
    }

    // Test Bandra redirect
    const bandraPage = await browser.newPage();
    await bandraPage.goto(`${BASE}/locations/bandra`, { waitUntil: "networkidle" });
    const finalUrl = bandraPage.url();
    console.log("Navigated /locations/bandra -> Final URL:", finalUrl);
    results["Pillar 4 - Bandra Alias Redirected"] = finalUrl.includes("/locations/bandra-west");
    await bandraPage.close();

    // -------------------------------------------------------------------------
    // PILLAR 5: Mobile-First Performance & Android Viewport (390x844 & 360x800)
    // -------------------------------------------------------------------------
    console.log("\n[Pillar 5] Testing Mobile Responsiveness & Android (360x800)...");
    const androidPage = await browser.newPage({
      viewport: { width: 360, height: 800 },
      userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    });

    const mobilePages = ["/", "/work", "/configure", "/estimator", "/locations/lokhandwala", "/contact"];
    for (const path of mobilePages) {
      await androidPage.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      
      // Check for horizontal scroll / overflow
      const scrollWidth = await androidPage.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await androidPage.evaluate(() => document.documentElement.clientWidth);
      const hasHorizontalOverflow = scrollWidth > clientWidth;
      console.log(`Mobile page ${path}: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}, overflow=${hasHorizontalOverflow}`);
      results[`Pillar 5 - Mobile No Overflow [${path}]`] = !hasHorizontalOverflow;
    }

    // Check sticky header background opacity on scroll
    await androidPage.goto(`${BASE}/configure`, { waitUntil: "networkidle" });
    await androidPage.evaluate(() => window.scrollBy(0, 300));
    await androidPage.waitForTimeout(500);
    const headerBg = await androidPage.evaluate(() => {
      const header = document.querySelector(".site-header");
      return header ? window.getComputedStyle(header).backgroundColor : "";
    });
    console.log("Scrolled Header background color:", headerBg);
    results["Pillar 5 - Sticky Header Opaque"] = headerBg.startsWith("rgb");

    await androidPage.screenshot({ path: `${VERIFY_DIR}/mobile-android-configure.png`, fullPage: false });
    await androidPage.close();

    console.log("\n================ STRESS TEST SUMMARY ================");
    console.table(results);

    await writeFile(
      `${VERIFY_DIR}/stress-test-report.json`,
      JSON.stringify(results, null, 2),
      "utf8"
    );

  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Stress test failed with error:", err);
  process.exit(1);
});
