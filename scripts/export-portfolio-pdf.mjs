// Regenerates the portfolio PDF from the live site using headless Chromium.
// Chromium's print-to-PDF preserves background graphics and turns anchors with
// absolute hrefs into clickable link annotations (e.g. the lessons link to /lab).
// Usage: npm run export:pdf   (override target with PORTFOLIO_URL=...)
import { chromium } from "playwright";

const URL = process.env.PORTFOLIO_URL || "https://chalece-portfolio.vercel.app/";
const OUT = "exports/Chalece-DeLaCoudray-Portfolio.pdf";

const browser = await chromium.launch();
try {
  // reducedMotion from first paint: the stat count-up never runs, so the PDF
  // captures the final numbers (30,630+ / 7 / 10+), not a mid-animation frame.
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.emulateMedia({ media: "print" });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800); // let fonts and print layout settle
  await page.pdf({
    path: OUT,
    printBackground: true,
    format: "Letter",
    margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
  });
  console.log("Wrote " + OUT + " from " + URL);
} finally {
  await browser.close();
}
