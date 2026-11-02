// Builds the SVG maps at build time, so every map is plain HTML that loads
// without JavaScript. Sources: us-atlas (US Census Bureau cartographic
// boundaries, pre-projected Albers USA) and world-atlas (Natural Earth 1:50m,
// public domain), simplified for the web with topojson-simplify.
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import { geoPath, geoEqualEarth, geoConicConformal, geoMercator, geoCentroid, geoArea } from "d3-geo";
import { STATES, STATE_BY_NAME } from "./us-states.js";
import { COUNTRIES, COUNTRY_BY_NUM } from "./countries.js";

const require = createRequire(import.meta.url);
const round = (n) => Math.round(n * 10) / 10;

// ------------------------------------------------------------------ US states
let usCache;
function usFeatures() {
  if (!usCache) {
    const us = require("us-atlas/states-albers-10m.json");
    usCache = feature(us, us.objects.states).features.filter((f) => STATE_BY_NAME[f.properties.name]);
  }
  return usCache;
}

/**
 * The 50 states (Albers USA: Alaska and Hawaii as insets). `focus` limits the
 * viewBox to some states; the others stay on the map in gray for context.
 * Returns { viewBox, shapes: [{ id, name, d, cx, cy, ask, meta }] }.
 */
export function usMap({ ask = STATES.map((s) => s.name), focus } = {}) {
  const path = geoPath().digits(1);
  const askSet = new Set(ask);
  const shapes = usFeatures().map((f) => {
    const s = STATE_BY_NAME[f.properties.name];
    const [cx, cy] = path.centroid(f);
    return { id: s.abbr.toLowerCase(), name: s.name, d: path(f), cx: round(cx), cy: round(cy), ask: askSet.has(s.name), meta: { capital: s.capital, region: s.region } };
  });
  let viewBox = "0 0 975 610";
  if (focus) {
    const fs = usFeatures().filter((f) => focus.includes(f.properties.name));
    const b = path.bounds({ type: "FeatureCollection", features: fs });
    const pad = 20;
    viewBox = [b[0][0] - pad, b[0][1] - pad, b[1][0] - b[0][0] + 2 * pad, b[1][1] - b[0][1] + 2 * pad].map(round).join(" ");
  }
  return { viewBox, shapes: shapes.sort((a, b) => a.name.localeCompare(b.name)) };
}

// ------------------------------------------------------------------ World
let worldCache;
function worldFeatures() {
  if (!worldCache) {
    const raw = JSON.parse(JSON.stringify(require("world-atlas/countries-50m.json")));
    const pre = presimplify(raw);
    const simple = simplify(pre, quantile(pre, 0.05));
    worldCache = feature(simple, simple.objects.countries).features;
  }
  return worldCache;
}

// Tuvalu is too small for the 1:50m dataset; it is placed by its coordinates.
const POINTS = { tv: [179.2, -8.5] };

const VIEWS = {
  world: { projection: () => geoEqualEarth(), w: 960, h: 500 },
  europe: { projection: () => geoConicConformal().rotate([-15, 0]).parallels([43, 62]), w: 800, h: 640, extent: [[-25, 34], [45, 71]] },
  africa: { projection: () => geoMercator(), w: 720, h: 760 },
  asia: { projection: () => geoMercator(), w: 900, h: 640 },
  americas: { projection: () => geoMercator(), w: 640, h: 860, extent: [[-168, -56], [-34, 72]] },
  oceania: { projection: () => geoMercator().rotate([-160, 0]), w: 900, h: 600 },
};

/**
 * A world or regional map. `ask` = alpha-2 codes the quiz asks about; every
 * country in view is drawn. Countries smaller than a few pixels, or missing
 * from the dataset, get a round marker so they can still be clicked.
 */
export function worldMap(view, ask) {
  const v = VIEWS[view];
  const askSet = new Set(ask);
  const feats = worldFeatures();
  const target = feats.filter((f) => askSet.has(COUNTRY_BY_NUM[String(f.id).padStart(3, "0")]?.a2));
  const fitTo = v.extent
    ? { type: "MultiPoint", coordinates: [[v.extent[0][0], v.extent[0][1]], [v.extent[1][0], v.extent[1][1]], [v.extent[0][0], v.extent[1][1]], [v.extent[1][0], v.extent[0][1]], [(v.extent[0][0] + v.extent[1][0]) / 2, v.extent[1][1]], [(v.extent[0][0] + v.extent[1][0]) / 2, v.extent[0][1]]] }
    : { type: "FeatureCollection", features: target };
  const projection = v.projection().fitExtent([[12, 12], [v.w - 12, v.h - 12]], fitTo).clipExtent([[0, 0], [v.w, v.h]]);
  const path = geoPath(projection).digits(1);
  const shapes = [];
  const seen = new Set();
  const byId = new Map();
  for (const f of feats) {
    const c = COUNTRY_BY_NUM[String(f.id).padStart(3, "0")];
    const d = path(f);
    if (!d) continue;
    const b = path.bounds(f);
    const small = (b[1][0] - b[0][0]) * (b[1][1] - b[0][1]) < 40;
    const [cx, cy] = path.centroid(f);
    const id = c ? c.id : `x${f.id ?? shapes.length}`;
    if (c) seen.add(c.a2);
    if (byId.has(id)) { const prev = byId.get(id); prev.d += d; prev.small = prev.small && small; continue; }
    byId.set(id, null);
    const shape = { id, name: c?.name ?? f.properties.name, d, cx: round(cx), cy: round(cy), ask: !!c && askSet.has(c.a2), small, meta: c ? { capital: c.capital, continent: c.continent } : null };
    byId.set(id, shape);
    shapes.push(shape);
  }
  for (const a2 of askSet) {
    if (seen.has(a2)) continue;
    const c = COUNTRIES.find((x) => x.a2 === a2);
    const p = POINTS[c.id] && projection(POINTS[c.id]);
    if (p && p[0] >= 0 && p[0] <= v.w && p[1] >= 0 && p[1] <= v.h) shapes.push({ id: c.id, name: c.name, d: "", cx: round(p[0]), cy: round(p[1]), ask: true, small: true, meta: { capital: c.capital, continent: c.continent } });
  }
  return { viewBox: `0 0 ${v.w} ${v.h}`, shapes };
}

/** One country's outline on its own, for the silhouette quiz. */
export function countryOutline(a2, size = 240) {
  const f = worldFeatures().find((x) => COUNTRY_BY_NUM[String(x.id).padStart(3, "0")]?.a2 === a2);
  if (!f) return null;
  const projection = geoMercator().rotate([-geoCentroid(f)[0], 0]).fitExtent([[8, 8], [size - 8, size - 8]], f);
  return geoPath(projection).digits(1)(f);
}

export const WORLD_AREA_CHECK = (a2) => {
  const f = worldFeatures().find((x) => COUNTRY_BY_NUM[String(x.id).padStart(3, "0")]?.a2 === a2);
  return f ? geoArea(f) : 0;
};
