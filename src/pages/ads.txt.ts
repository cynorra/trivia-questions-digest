import type { APIRoute } from "astro";
import { SITE } from "../site.config.js";

// Authorized sellers file for AdSense (served before approval so the site can be verified).
export const GET: APIRoute = () => {
  const id = (SITE.adsensePublisherId || SITE.adsTxtPublisher || "").replace(/^ca-/, "");
  const body = id ? `google.com, ${id}, DIRECT, f08c47fec0942fa0\n` : "# Ads not enabled yet.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
