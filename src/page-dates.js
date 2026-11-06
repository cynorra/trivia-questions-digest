// Content dates of every non-guide page (shown on the page and used for <lastmod>).
// Change a date only when the page's content changes.
import { CATS } from "./lib/trivia/cats.js";
import { PAGES as GEO_PAGES } from "./lib/geo/pages.js";
import { COUNTRY_PAGES } from "./lib/trivia/country-facts.js";
const D = "2026-11-02";
const paths = [
  "/", "/trivia/", "/community/", "/fun-facts/", "/random-trivia-questions/", "/guides/", "/how-we-write-questions/",
  "/about/", "/author/eren-simsir/", "/contact/", "/editorial-policy/", "/privacy/", "/terms/", "/disclaimer/",
  "/map-quizzes/", "/daily-trivia/", "/spirit-animal-quiz/", "/daily-geography-quiz/", "/geography-trivia/", "/how-we-make-our-maps/",
  ...CATS.map((c) => `/trivia/${c.slug}/`),
  ...GEO_PAGES.map((p) => `/${p.slug}/`),
  ...COUNTRY_PAGES.map((c) => `/${c.slug}/`),
];
export const PAGE_DATES = Object.fromEntries(paths.map((p) => [p, { published: D }]));

export function pageDates(path) {
  const d = PAGE_DATES[path];
  if (!d) throw new Error(`No date for ${path} in src/page-dates.js`);
  return { published: new Date(d.published), updated: d.updated ? new Date(d.updated) : undefined };
}
export function lastModified(path) {
  const d = PAGE_DATES[path];
  return d ? d.updated ?? d.published : undefined;
}
