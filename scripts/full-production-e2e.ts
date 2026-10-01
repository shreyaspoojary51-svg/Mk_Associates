import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = "https://mk-associates-omega.vercel.app";

async function verifyAll() {
  console.log("=================================================");
  console.log(`Starting Full Production E2E Verification on: ${BASE}`);
  console.log("=================================================");

  const browser = await chromium.launch({ headless: true });
  const report: Record<string, boolean> = {};

  try {
    // -------------------------------------------------------------------------
    // 1. CONFIGURE TOOL: Interactive Moodboard + PDF Download + WhatsApp Link
    // -------------------------------------------------------------------------
    console.log("\n[1] Verifying Configure Tool & PDF Download on Live Site...");
    const configureContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      acceptDownloads: true,
    });
    const confPage = await configureContext.newPage();
    await confPage.goto(`${BASE}/configure`, { waitUntil: "networkidle" });

    // Select Room: Bedroom
    const bedroomBtn = confPage.getByRole("button", { name: "Bedroom", exact: true });
    await bedroomBtn.click();
    console.log("Clicked 'Bedroom'");

    // Select Palette: Earth & olive
    const earthBtn = confPage.getByRole("button", { name: "Earth & olive", exact: true });
    await earthBtn.click();
    console.log("Clicked 'Earth & olive'");

    // Select Material: Walnut
    const walnutBtn = confPage.getByRole("button", { name: "Walnut", exact: true });
    await walnutBtn.click();
    console.log("Clicked 'Walnut'");

    // Verify WhatsApp button
    const whatsappBtn = confPage.locator("a[href*='whatsapp.com/send']").first();
    const waHref = await whatsappBtn.getAttribute("href");
    const waValid = !!(waHref?.includes("Bedroom") && waHref?.includes("Earth") && waHref?.includes("Walnut"));
    console.log(`WhatsApp Link Valid: ${waValid}`);
    report["configure_whatsapp_link"] = waValid;

    // Open the download drawer
    const downloadDrawer = confPage.locator("summary:has-text('Keep a copy of your brief')");
    await downloadDrawer.click();

    // Trigger PDF download via browser UI
    const [download] = await Promise.all([
      confPage.waitForEvent("download", { timeout: 25000 }),
      confPage.click("button:has-text('Download planning PDF')"),
    ]);
    console.log("Clicked 'Download planning PDF' button in UI...");
    const downloadPath = resolve(process.cwd(), "verification-results/live-configure-download.pdf");
    await download.saveAs(downloadPath);
    console.log(`Saved browser download to ${downloadPath}`);

    const pdfBuffer = await readFile(downloadPath);
    const magic = pdfBuffer.slice(0, 4).toString("utf8");
    const isRealPdf = magic === "%PDF" && pdfBuffer.byteLength > 5000;
    console.log(`Downloaded file check: Magic="${magic}", ByteLength=${pdfBuffer.byteLength}, Valid=${isRealPdf}`);
    report["configure_pdf_download"] = isRealPdf;

    await configureContext.close();

    // -------------------------------------------------------------------------
    // 2. INVESTMENT ESTIMATOR: Dynamic INR Calculation + Milestones + PDF
    // -------------------------------------------------------------------------
    console.log("\n[2] Verifying Investment Estimator on Live Site...");
    const estContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      acceptDownloads: true,
    });
    const estPage = await estContext.newPage();
    await estPage.goto(`${BASE}/estimator`, { waitUntil: "networkidle" });

    // Click Bespoke tier
    const bespokeBtn = estPage.getByRole("button", { name: /Bespoke/i });
    await bespokeBtn.click();

    // Select Monsoon waterproofing addon
    const monsoonCheckbox = estPage.locator("input[type='checkbox']").first();
    if (await monsoonCheckbox.isVisible()) {
      await monsoonCheckbox.check();
    }

    // Verify dynamic estimate output text
    const estimateText = await estPage.locator(".estimate-total, [data-estimate-total], h3, p").allInnerTexts();
    const hasInr = estimateText.some((t) => t.includes("₹") && (t.includes("lakh") || t.includes("crore")));
    console.log(`Estimator renders INR Budget band: ${hasInr}`);
    report["estimator_dynamic_inr"] = hasInr;

    // Verify milestones
    const milestoneCount = await estPage.locator("[class*='milestoneGrid'] > div, [class*='milestone']").count();
    console.log(`Found ${milestoneCount} milestone/breakdown elements`);
    report["estimator_milestones"] = milestoneCount > 0;

    await estContext.close();

    // -------------------------------------------------------------------------
    // 3. WORK GALLERY & CASE STUDIES: Budgets, Areas, Before/After Slider
    // -------------------------------------------------------------------------
    console.log("\n[3] Verifying Work Gallery & Case Studies on Live Site...");
    const workPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await workPage.goto(`${BASE}/work`, { waitUntil: "networkidle" });

    const cardTexts = await workPage.locator("article.project-card").allInnerTexts();
    const cardBudgets = cardTexts.filter((t) => t.includes("₹") && t.includes("lakh"));
    const cardAreas = cardTexts.filter((t) => t.includes("sq ft"));
    console.log(`Cards showing budgets: ${cardBudgets.length} / ${cardTexts.length}`);
    console.log(`Cards showing areas: ${cardAreas.length} / ${cardTexts.length}`);
    report["gallery_budgets"] = cardBudgets.length > 0;
    report["gallery_areas"] = cardAreas.length > 0;

    // Check Case study: The Quiet Apartment
    await workPage.goto(`${BASE}/work/the-quiet-apartment`, { waitUntil: "networkidle" });
    const caseText = await workPage.locator("body").innerText();
    const hasArea = caseText.includes("1,240 sq ft");
    const hasBudget = caseText.includes("₹35–48 lakh");
    const hasLocality = caseText.includes("Andheri West");
    console.log(`Case Study stats: Area=${hasArea}, Budget=${hasBudget}, Locality=${hasLocality}`);
    report["case_study_stats"] = hasArea && hasBudget && hasLocality;

    // Check Before/After component presence
    const beforeAfterCount = await workPage.locator(".before-after, [aria-label*='comparison'], [class*='comparison']").count();
    const hasBeforeAfter = beforeAfterCount > 0;
    console.log(`Before/After component visible: ${hasBeforeAfter}`);
    report["before_after_slider"] = hasBeforeAfter;

    await workPage.close();

    // -------------------------------------------------------------------------
    // 4. LOCALITY-FOCUSED CONTENT: Andheri West, Lokhandwala, Bandra, Juhu, Powai
    // -------------------------------------------------------------------------
    console.log("\n[4] Verifying Locality Pages on Live Site...");
    const localityPage = await browser.newPage();
    const localities = [
      "andheri-west",
      "lokhandwala",
      "bandra-west",
      "juhu",
      "powai",
    ];

    let allLocalitiesOk = true;
    for (const loc of localities) {
      const res = await localityPage.goto(`${BASE}/locations/${loc}`, { waitUntil: "networkidle" });
      const status = res?.status();
      const content = await localityPage.locator("main").innerText();
      const valid = status === 200 && content.length > 50;
      console.log(`Locality ${loc}: status=${status}, validContent=${valid}`);
      if (!valid) allLocalitiesOk = false;
    }
    report["localities_all_200"] = allLocalitiesOk;

    // Test Bandra redirect
    await localityPage.goto(`${BASE}/locations/bandra`, { waitUntil: "networkidle" });
    const finalUrl = localityPage.url();
    const redirected = finalUrl.endsWith("/locations/bandra-west");
    console.log(`Bandra Alias Redirected to /locations/bandra-west: ${redirected} (${finalUrl})`);
    report["bandra_redirect"] = redirected;

    await localityPage.close();

    // -------------------------------------------------------------------------
    // 5. MOBILE-FIRST PERFORMANCE & PHONE SANITY CHECK (360x800 & 390x844)
    // -------------------------------------------------------------------------
    console.log("\n[5] Verifying Mobile Layout & Performance (Android 360x800 & iPhone 390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 360, height: 800 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    const mobileRoutes = ["/", "/work", "/configure", "/estimator", "/locations/lokhandwala", "/contact"];
    let zeroOverflow = true;
    for (const route of mobileRoutes) {
      await mobilePage.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      const overflow = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`Route ${route} overflow on 360px: ${overflow}`);
      if (overflow) zeroOverflow = false;
    }
    report["mobile_zero_overflow"] = zeroOverflow;

    // Test Sticky Header Solid Background
    await mobilePage.goto(BASE, { waitUntil: "networkidle" });
    await mobilePage.evaluate(() => window.scrollTo(0, 600));
    await mobilePage.waitForTimeout(300);
    const headerBg = await mobilePage.evaluate(() => {
      const el = document.querySelector(".site-header.is-scrolled");
      return el ? window.getComputedStyle(el).backgroundColor : null;
    });
    console.log(`Sticky Header Background: ${headerBg}`);
    report["sticky_header_solid"] = !!(headerBg !== null && headerBg !== "transparent" && !headerBg.includes("rgba(0, 0, 0, 0)"));

    await mobileContext.close();

    console.log("\n=================================================");
    console.log("FINAL FULL PRODUCTION E2E REPORT");
    console.log("=================================================");
    console.table(report);

    const allPassed = Object.values(report).every((v) => v === true);
    console.log(`All verifications passed: ${allPassed}`);
    if (!allPassed) process.exit(1);

  } finally {
    await browser.close();
  }
}

verifyAll().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
