import { SITE, AUTHOR } from "../site.config.js";

const abs = (path) => new URL(path, SITE.url).href;

export const personRef = { "@id": `${SITE.url}/author/${AUTHOR.slug}/#person` };
export const orgRef = { "@id": `${SITE.url}/#organization` };

/** crumbs: [{ name, path }], the last one being the current page. */
export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function articleSchema({ title, description, path, published, updated }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    datePublished: published.toISOString().slice(0, 10),
    dateModified: (updated ?? published).toISOString().slice(0, 10),
    author: personRef,
    publisher: orgRef,
    inLanguage: SITE.language,
  };
}

export function webPageSchema({ name, description, path, updated }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: abs(path),
    author: personRef,
    publisher: orgRef,
    dateModified: updated,
    inLanguage: SITE.language,
  };
}

/** A dated list of games (release calendar, free games). */
export function itemListSchema({ name, path, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: abs(path),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "VideoGame", name: it.name, ...(it.date ? { datePublished: it.date } : {}), ...(it.url ? { url: it.url } : {}), ...(it.platforms ? { gamePlatform: it.platforms } : {}) },
    })),
  };
}

/** A free in-browser tool. */
export function webAppSchema({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: abs(path),
    applicationCategory: "GameApplication",
    operatingSystem: "Any (runs in the browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: orgRef,
    author: personRef,
    inLanguage: SITE.language,
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** The guides index: a collection of articles. */
export function collectionSchema({ name, description, path, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: abs(path),
    publisher: orgRef,
    inLanguage: SITE.language,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(it.path), name: it.name })),
    },
  };
}
