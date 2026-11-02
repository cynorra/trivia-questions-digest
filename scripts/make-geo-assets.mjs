// Copies the flag of every quiz country into public/flags/ (flag-icons, MIT)
// and writes each country's outline to public/outlines/ for the shape quiz.
// Runs before every build (npm run build) so the files always match the data.
import { mkdirSync, copyFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { COUNTRIES } from "../src/lib/geo/countries.js";
import { countryOutline } from "../src/lib/geo/maps.js";

const require = createRequire(import.meta.url);
const flagDir = new URL("../node_modules/flag-icons/flags/4x3/", import.meta.url);
mkdirSync(new URL("../public/flags/", import.meta.url), { recursive: true });
mkdirSync(new URL("../public/outlines/", import.meta.url), { recursive: true });
let flags = 0, outlines = 0;
const missing = [];
for (const c of COUNTRIES) {
  const src = new URL(`${c.id}.svg`, flagDir);
  if (existsSync(src)) { copyFileSync(src, new URL(`../public/flags/${c.id}.svg`, import.meta.url)); flags++; } else missing.push(`flag:${c.id}`);
  const d = countryOutline(c.a2);
  if (d) {
    writeFileSync(new URL(`../public/outlines/${c.id}.svg`, import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="${d}" fill="#1f2a44"/></svg>\n`);
    outlines++;
  } else missing.push(`outline:${c.id}`);
}
console.log(`Wrote ${flags} flags and ${outlines} outlines.${missing.length ? " Missing: " + missing.join(", ") : ""}`);
