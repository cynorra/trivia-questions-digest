import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, AUTHOR } from "../site.config.js";
import { CATS } from "../lib/trivia/cats.js";
import { PAGES } from "../lib/geo/pages.js";
import { COUNTRY_PAGES } from "../lib/trivia/country-facts.js";

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const guides = (await getCollection("guides", (g) => !g.data.draft)).sort((a, b) => a.data.title.localeCompare(b.data.title));
  const body = `# ${SITE.name}

> ${SITE.description} Written and checked by ${AUTHOR.name}. Every answer has an explanation and is checked against a named source; facts that can change carry an "as of" date.

## Play

- [Daily trivia](${u("/daily-trivia/")}): ten questions a day, the same for everyone.
- [Home](${u("/")}): the fun fact of the day and every section of the site.
- [Spirit animal quiz](${u("/spirit-animal-quiz/")}): a ten-question personality match with eight animals, plus real facts about each.
- [Random trivia questions](${u("/random-trivia-questions/")}): one random question at a time from the whole library.
- [Fun facts](${u("/fun-facts/")}): sourced fun facts by topic.
${COUNTRY_PAGES.map((c: any) => `- [${c.title}](${u(`/${c.slug}/`)}): ${c.description}`).join("\n")}

## Trivia questions and answers by category

${CATS.map((c) => `- [${c.title}](${u(`/${c.slug}/`)}): ${c.description}`).join("\n")}

## Map quizzes and geography

Countries covered: the 193 UN member states plus Vatican City and Palestine. Capitals are cross-checked against two datasets; maps come from the US Census Bureau and Natural Earth.

${PAGES.map((p: any) => `- [${p.title}](${u(`/${p.slug}/`)}): ${p.description}`).join("\n")}
- [Daily geography quiz](${u("/daily-geography-quiz/")}): ten questions on flags, capitals and country shapes, the same for everyone each day.
- [Geography trivia](${u("/geography-trivia/")}): forty explained questions on rivers, mountains, borders and records.

## Guides

${guides.map((g) => `- [${g.data.title}](${u(`/guides/${g.id}/`)}): ${g.data.description}`).join("\n")}

## About

- [How we write questions](${u("/how-we-write-questions/")}) · [How we make our maps](${u("/how-we-make-our-maps/")}) · [Editorial policy](${u("/editorial-policy/")}) · [About](${u("/about/")}) · [Author](${u(`/author/${AUTHOR.slug}/`)})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
