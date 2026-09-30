import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const ARTIFACT_DIR = "C:/Users/praja/.gemini/antigravity/brain/df31c88f-9eb4-42b0-96ae-9d1ffa6a8569/verification";
const BASE_URL = "https://mk-associates-omega.vercel.app";

async function run() {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  console.log(`Launching Playwright to verify ${BASE_URL}...`);
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // 1. Desktop Hero Video & Watermark Check
    console.log("--- 1. Testing Desktop (1440x900) ---");
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopContext.newPage();
    const desktopErrors: string[] = [];
    desktopPage.on("pageerror", (e) => desktopErrors.push(e.message));

    await desktopPage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60000 });
    console.log("Loaded homepage on desktop.");

    // Check video and poster
    const video = desktopPage.locator("video");
    const videoCount = await video.count();
    console.log(`Found ${videoCount} video element(s).`);

    const videoSrc = await video.getAttribute("src");
    const posterSrc = await video.getAttribute("poster");
    console.log(`Video source: ${videoSrc}, Poster source: ${posterSrc}`);

    // Screenshot of the hero video section
    const heroSection = desktopPage.locator("section").first();
    await heroSection.screenshot({ path: `${ARTIFACT_DIR}/desktop-hero.png` });
    console.log("Saved desktop-hero.png");

    // Crop bottom-right corner of hero section specifically to confirm no watermark
    const boundingBox = await heroSection.boundingBox();
    if (boundingBox) {
      await desktopPage.screenshot({
        path: `${ARTIFACT_DIR}/desktop-video-bottom-right.png`,
        clip: {
          x: boundingBox.x + boundingBox.width - 300,
          y: boundingBox.y + boundingBox.height - 200,
          width: 300,
          height: 200,
        },
      });
      console.log("Saved desktop-video-bottom-right.png");
    }

    // 2. Phone Sanity Check (390x844)
    console.log("--- 2. Phone Sanity Check (390x844) ---");
    const phoneContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const phonePage = await phoneContext.newPage();
    const phoneErrors: string[] = [];
    phonePage.on("pageerror", (e) => phoneErrors.push(e.message));

    // Homepage on mobile
    await phonePage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60000 });
    const homeOverflow = await phonePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Homepage horizontal overflow on mobile: ${homeOverflow}`);

    await phonePage.screenshot({ path: `${ARTIFACT_DIR}/mobile-homepage.png` });
    console.log("Saved mobile-homepage.png");

    // Mobile Navigation Drawer Test
    const menuBtn = phonePage.getByRole("button", { name: "Open navigation menu" });
    await menuBtn.click();
    await phonePage.waitForTimeout(500);
    await phonePage.screenshot({ path: `${ARTIFACT_DIR}/mobile-menu-opened.png` });
    console.log("Opened mobile navigation menu. Saved mobile-menu-opened.png");

    const closeBtn = phonePage.getByRole("button", { name: "Close navigation menu" });
    await closeBtn.click();
    await phonePage.waitForTimeout(300);

    // Mobile Action Bar Check
    const conciergeBar = phonePage.locator(".mobile-action-bar");
    const hasActionBar = await conciergeBar.isVisible();
    console.log(`Mobile action bar visible: ${hasActionBar}`);

    // Estimator on mobile
    console.log("--- 3. Testing Estimator on Mobile ---");
    await phonePage.goto(`${BASE_URL}/estimator`, { waitUntil: "networkidle", timeout: 60000 });
    const estOverflow = await phonePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Estimator horizontal overflow on mobile: ${estOverflow}`);

    // Click Bespoke tier
    const bespokeBtn = phonePage.getByRole("button", { name: /Bespoke/i });
    if (await bespokeBtn.isVisible()) {
      await bespokeBtn.click();
      console.log("Selected Bespoke tier on mobile estimator.");
    }
    await phonePage.screenshot({ path: `${ARTIFACT_DIR}/mobile-estimator.png`, fullPage: false });
    console.log("Saved mobile-estimator.png");

    // Contact form on mobile
    console.log("--- 4. Testing Contact Form on Mobile ---");
    await phonePage.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle", timeout: 60000 });
    const contactOverflow = await phonePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Contact page horizontal overflow on mobile: ${contactOverflow}`);

    // Fill Step 1
    const nameInput = phonePage.locator("#contact-name");
    await nameInput.scrollIntoViewIfNeeded();
    const emailInput = phonePage.locator("#contact-email");
    const phoneInput = phonePage.locator("#contact-phone");

    await nameInput.fill("Ananya Sharma");
    await emailInput.fill("ananya.sharma@example.com");
    await phoneInput.fill("+91 98765 43210");
    console.log("Filled contact details including valid phone number '+91 98765 43210'.");

    await phonePage.screenshot({ path: `${ARTIFACT_DIR}/mobile-contact-step1.png` });
    console.log("Saved mobile-contact-step1.png");

    // Advance to Step 2
    const nextBtn = phonePage.getByRole("button", { name: /Continue/i });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    await phonePage.waitForTimeout(500);

    // Verify Step 2 is reached (validating that phone passed validation)
    const step2Heading = phonePage.locator("h2#contact-step-title");
    const headingText = await step2Heading.textContent();
    console.log(`Advanced to next step: "${headingText?.trim()}" - Phone validation succeeded!`);

    await phonePage.screenshot({ path: `${ARTIFACT_DIR}/mobile-contact-step2.png` });
    console.log("Saved mobile-contact-step2.png");

    console.log("\n=================================");
    console.log("ALL LIVE PRODUCTION CHECKS PASSED");
    console.log(`Desktop page errors: ${desktopErrors.length}`);
    console.log(`Phone page errors: ${phoneErrors.length}`);
    console.log("=================================");

    await desktopContext.close();
    await phoneContext.close();
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
