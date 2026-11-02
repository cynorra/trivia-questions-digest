// Smoke test against a running preview (npm run build && npm run preview):
// screenshots in both themes and two widths, overflow and console-error checks,
// and real interactions with a practice set.
//   CHROME_PATH=/path/to/chrome OUT=/tmp/shots node scripts/browser-check.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const B = process.env.BASE ?? "http://localhost:4321";
const OUT = process.env.OUT ?? "./.shots";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const errors = [];

for (const [w, h, tag] of [[1280, 900, "desk"], [390, 844, "phone"]]) {
  for (const scheme of ["light", "dark"]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    p.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${tag}/${scheme}: ${m.text().slice(0, 200)}`));
    p.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/daily-trivia/", "/general-knowledge-trivia/", "/christmas-trivia/", "/fun-facts/", "/random-trivia-questions/", "/map-quizzes/", "/us-states-map-quiz/", "/world-map-quiz/", "/flag-quiz/", "/daily-geography-quiz/", "/geography-trivia/", "/presidents-quiz/", "/spirit-animal-quiz/", "/facts-about-japan/", "/black-history-trivia/", ...(process.env.GUIDE ? [process.env.GUIDE] : [])]) {
      await p.goto(B + path, { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) errors.push(`overflow ${tag} ${scheme} ${path}`);
      const name = (path === "/" ? "home" : path.replace(/\//g, "_")) + `-${tag}-${scheme}.png`;
      await p.screenshot({ path: `${OUT}/${name}`, fullPage: tag === "desk" && (path === "/" || path === "/general-knowledge-trivia/") });
    }
    await p.close();
  }
}

const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("pageerror", (e) => errors.push(e.message));

// The home page has no quiz on it (text, links and the fact of the day only).
await p.goto(B + "/", { waitUntil: "networkidle" });
if (await p.locator('[role="radiogroup"]').count()) errors.push("home page should not contain a quiz");

// Daily trivia: answering all ten shows a result and a copy button.
await p.goto(B + "/daily-trivia/", { waitUntil: "networkidle" });
for (let i = 0; i < 10; i++) await p.locator(`[aria-label="Question ${i + 1} choices"] button`).first().click();
if (!(await p.getByText(/of 10 today/).count())) errors.push("daily quiz did not finish");
if (!(await p.getByRole("button", { name: "Copy result" }).count())) errors.push("no copy button after finishing");

// The random generator shows a new question on Next.
await p.goto(B + "/random-trivia-questions/", { waitUntil: "networkidle" });
const q1 = await p.locator("p.font-display.text-xl").textContent();
let changed = false;
for (let t = 0; t < 5 && !changed; t++) { await p.getByRole("button", { name: "Next question" }).click(); changed = (await p.locator("p.font-display.text-xl").textContent()) !== q1; }
if (!changed) errors.push("random question did not change");

// A category quiz: answering reveals the explanation.
await p.goto(B + "/general-knowledge-trivia/", { waitUntil: "networkidle" });
await p.locator('[aria-label="Question 1 choices"] button').first().click();
const open = await p.locator("details").first().getAttribute("open");
if (open === null) errors.push("answer details did not open");
// Spirit animal quiz: answering all ten shows a result.
await p.goto(B + "/spirit-animal-quiz/", { waitUntil: "networkidle" });
for (let i = 0; i < 10; i++) await p.locator(`[aria-label="Question ${i + 1} choices"] button`).nth(i % 4).click();
const animal = await p.getByText("Your spirit animal").first().isVisible().catch(() => false);
if (!animal) errors.push("spirit animal quiz did not show a result");

// The map quiz starts, accepts a correct click and moves to the next place.
await p.goto(B + "/us-states-map-quiz/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Start" }).click();
const first = await p.locator("strong.font-display").textContent();
const sid = await p.evaluate((n) => document.querySelector(`#quiz-map [data-name="${n}"]`)?.getAttribute("data-id"), first);
await p.locator(`#quiz-map [data-id="${sid}"]`).first().dispatchEvent("click");
const next = await p.locator("strong.font-display").textContent();
if (first === next) errors.push("map quiz did not advance after a correct click");
console.log(errors.length ? errors : "no errors");
await b.close();
