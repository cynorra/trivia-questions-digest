// Page bodies link to guides that may still be scheduled. Before a guide is
// live, its links are turned into plain text so no page links to a 404.
export function unlinkMissingGuides(html, liveIds) {
  const live = new Set(liveIds);
  return html.replace(/<a href="\/guides\/([^/"]+)\/">([\s\S]*?)<\/a>/g, (m, slug, text) => (live.has(slug) ? m : text));
}
