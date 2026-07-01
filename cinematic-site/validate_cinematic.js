const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = __dirname;
const htmlPath = path.join(root, "index.html");
const screenshotsDir = path.join(root, "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const screenshots = [];

  const heroSlideCount = await page.locator(".hero-slide").count();
  for (let index = 0; index < heroSlideCount; index += 1) {
    await page.evaluate((target) => {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.tanlongSetHeroSlide(target);
    }, index);
    await page.waitForTimeout(1000);
    const file = path.join(screenshotsDir, `cinematic-hero-${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, fullPage: false });
    screenshots.push(path.relative(root, file));
  }

  const sectionCount = await page.locator(".snap-section").count();
  for (let index = 0; index < sectionCount; index += 1) {
    if (index === 0) {
      await page.evaluate(() => window.tanlongSetHeroSlide(0));
      await page.waitForTimeout(300);
    }
    await page.evaluate((target) => window.tanlongScrollToSection(target), index);
    await page.waitForTimeout(1250);
    const file = path.join(screenshotsDir, `cinematic-section-${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, fullPage: false });
    screenshots.push(path.relative(root, file));
  }

  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    window.tanlongSetHeroSlide(0);
  });
  await page.waitForTimeout(500);
  await page.locator(".hero-dot[aria-current='true']").click();
  await page.waitForTimeout(150);
  const pauseControl = await page.evaluate(() => ({
    isPaused: document.body.classList.contains("hero-paused"),
    activeHeroControls: document.querySelectorAll(".hero-dot[aria-current='true']").length,
    visibleProgressRings: Array.from(document.querySelectorAll(".hero-dot[aria-current='true'] .active-ring"))
      .filter((element) => getComputedStyle(element).display !== "none").length,
    inactiveLines: Array.from(document.querySelectorAll(".hero-dot[aria-current='false'] .hero-line"))
      .filter((element) => getComputedStyle(element).display !== "none").length,
  }));
  await page.locator(".hero-dot[aria-current='true']").click();
  await page.waitForTimeout(150);

  const validation = await page.evaluate(() => {
    const badImages = Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
      .map((img) => img.getAttribute("src"));

    const checkSelectors = [
      ".brand-bar",
      ".section-rail",
      ".page-count",
      ".scroll-cue",
      ".snap-section.is-visible .copy",
      ".snap-section.is-visible .float-stack",
      ".snap-section.is-visible .tech-orbit",
      ".snap-section.is-visible .contact-plate",
    ];

    const overflow = checkSelectors.flatMap((selector) => (
      Array.from(document.querySelectorAll(selector)).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        };
      })
    )).filter((rect) => {
      const intersectsViewport = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      return intersectsViewport && (
        rect.left < -2 ||
        rect.top < -2 ||
        rect.right > window.innerWidth + 2 ||
        rect.bottom > window.innerHeight + 2
      );
    });

    const sections = Array.from(document.querySelectorAll(".snap-section")).map((section) => {
      const rect = section.getBoundingClientRect();
      return {
        id: section.id || "home",
        index: Number(section.dataset.sectionIndex),
        height: Math.round(rect.height),
        snapAlign: getComputedStyle(section).scrollSnapAlign,
      };
    });

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentHeight: document.documentElement.scrollHeight,
      sectionCount: document.querySelectorAll(".snap-section").length,
      heroSlideCount: document.querySelectorAll(".hero-slide").length,
      heroControlCount: document.querySelectorAll(".hero-dot").length,
      railCount: document.querySelectorAll(".section-rail .rail-button").length,
      navCount: document.querySelectorAll(".nav .section-jump").length,
      activeSections: document.querySelectorAll(".snap-section.is-visible").length,
      badImages,
      overflow,
      sections,
      scrollSnapType: getComputedStyle(document.documentElement).scrollSnapType,
    };
  });

  const result = {
    html: path.relative(root, htmlPath),
    screenshots,
    pauseControl,
    consoleMessages,
    pageErrors,
    ...validation,
  };

  fs.writeFileSync(path.join(root, "cinematic-validation.json"), JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
