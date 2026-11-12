// Internal-linking helpers shared by the guide page, the category pages and
// the link audit. Pure functions, no Astro imports, so tests can load them.

/** First /trivia/<slug>/ link in a guide body whose slug is in `catSlugs`. */
export function guideCategory(body, catSlugs) {
  for (const m of (body || "").matchAll(/\/trivia\/([a-z0-9-]+)\//g)) {
    if (catSlugs.has(m[1])) return m[1];
  }
  return null;
}

/**
 * Related guides for every guide, as Map(id -> guide[]), `n` each.
 *
 * Pass 1: the next guides after it in a ring of its own section (oldest
 * first), so neighbours link to each other. Pass 2: slots still empty (small
 * sections) are filled with whichever other guides have the fewest links in so
 * far. That gives every guide at least `n - 1` links in, and a brand new guide
 * (zero links in) is picked first the next time the site builds. A plain
 * slice(0, n) would show the same four guides on every page forever.
 *
 * `all` is a list of { id, data: { tool, published } }. Pure and
 * deterministic, so every page computes the same map from the same input.
 */
export function relatedMap(all, n = 4) {
  const ordered = [...all].sort(
    (a, b) => a.data.published.valueOf() - b.data.published.valueOf() || a.id.localeCompare(b.id),
  );
  const inbound = new Map(ordered.map((g) => [g.id, 0]));
  const picks = new Map(ordered.map((g) => [g.id, []]));
  const take = (from, to) => {
    picks.get(from.id).push(to);
    inbound.set(to.id, inbound.get(to.id) + 1);
  };
  for (const g of ordered) {
    const same = ordered.filter((x) => x.data.tool === g.data.tool);
    const i = same.findIndex((x) => x.id === g.id);
    for (const x of same.slice(i + 1).concat(same.slice(0, i)).slice(0, n)) take(g, x);
  }
  for (const g of ordered) {
    const have = picks.get(g.id);
    while (have.length < n) {
      const pool = ordered.filter((x) => x.id !== g.id && !have.includes(x));
      if (!pool.length) break;
      pool.sort((a, b) => inbound.get(a.id) - inbound.get(b.id));
      take(g, pool[0]);
    }
  }
  return picks;
}

export function relatedGuides(guide, all, n = 4) {
  return relatedMap(all, n).get(guide.id) ?? [];
}
