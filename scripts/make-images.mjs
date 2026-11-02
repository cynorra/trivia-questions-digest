// Renders public/og.png (1200x630), public/logo-512.png and public/apple-touch-icon.png
// from HTML using the site's own fonts. Run after changing the brand name:
//   CHROME_PATH=/path/to/chrome node scripts/make-images.mjs
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const font = (p) => `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString("base64")}`;
const archivo = font("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
const geist = font("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const mono = font("@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2");

const css = `
@font-face{font-family:A;src:url(${archivo})}@font-face{font-family:G;src:url(${geist})}@font-face{font-family:M;src:url(${mono})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fbf7ef;color:#2a1838;font-family:G;position:relative;overflow:hidden}
.ruled{position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 90px,#e0a12f60 90px 92px,transparent 92px),repeating-linear-gradient(0deg,#6d3fd318 0 2px,transparent 2px 44px)}
.wrap{position:absolute;inset:0;padding:70px 80px 70px 130px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-family:A;font-weight:800;font-size:34px}
h1{font-family:A;font-weight:800;font-size:76px;line-height:1.04;margin-top:46px;max-width:900px}
.row{margin-top:auto;display:flex;gap:14px;align-items:center;font-size:26px;color:#4a5570}
.b{width:44px;height:44px;border-radius:50%;border:3px solid #1f2a44;display:grid;place-items:center;font-weight:700}.b.on{background:#2e9a5a;border-color:#2e9a5a;color:#fff}`;
const bubble = (fill, ink) => `<path d="M6 4 H26 a3 3 0 0 1 3 3 V20 a3 3 0 0 1 -3 3 H14 L8 28.5 V23 H6 a3 3 0 0 1 -3 -3 V7 a3 3 0 0 1 3 -3 z" fill="${fill}"/><path d="M12.6 10.6 a3.4 3.4 0 1 1 5.2 2.9 c-1.2 .8 -1.8 1.4 -1.8 2.8" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="16" cy="19.2" r="1.45" fill="${ink}"/>`;
const mark = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32">${bubble("#5b2bb5", "#fbf7ef")}</svg>`;
const og = `<style>${css}</style><div class="ruled"></div><div class="wrap"><div class="brand">${mark(46)}${SITE.name}</div>
<h1>Ten new trivia questions, every day.</h1>
<div class="row"><span style="margin-left:0">Daily quiz · Trivia questions · Map quizzes · Fun facts</span></div></div>`;
const icon = (size) => `<style>*{margin:0}body{width:${size}px;height:${size}px;background:#5b2bb5;display:grid;place-items:center}</style><svg width="${size * 0.74}" height="${size * 0.74}" viewBox="0 0 32 32">${bubble("#ffffff", "#5b2bb5")}</svg>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
async function shot(html, w, h, out) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`../public/${out}`, import.meta.url).pathname });
  await page.close();
}
await shot(og, 1200, 630, "og.png");
await shot(icon(512), 512, 512, "logo-512.png");
await shot(icon(180), 180, 180, "apple-touch-icon.png");
await browser.close();
console.log("Wrote public/og.png, public/logo-512.png, public/apple-touch-icon.png");
