import fs from 'fs';
import path from 'path';

const dir = 'src/content/guides';
const files = fs.readdirSync(dir);

let fixed = 0;
for (const f of files) {
  if (!f.endsWith('.md')) continue;
  const p = path.join(dir, f);
  let raw = fs.readFileSync(p, 'utf8');
  let changed = false;

  // If status is draft or draft: true, make it published
  if (raw.includes('draft: true')) {
    raw = raw.replace(/draft:\s*true/g, 'draft: false');
    changed = true;
  }
  if (raw.includes('status: "draft"') || raw.includes('status: draft')) {
    raw = raw.replace(/status:\s*["']?draft["']?/g, 'status: "published"');
    changed = true;
  }

  // If published is in the future, set to 2026-11-18
  const pubMatch = raw.match(/published:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  if (pubMatch && pubMatch[1] > '2026-11-18') {
    raw = raw.replace(/published:\s*["']?\d{4}-\d{2}-\d{2}["']?/, 'published: "2026-11-18"');
    changed = true;
  }

  // Ensure updated: "2026-11-18" is present
  if (!raw.includes('updated:')) {
    raw = raw.replace(/published:\s*([^\r\n]+)/, 'published: $1\nupdated: "2026-11-18"');
    changed = true;
  } else {
    raw = raw.replace(/updated:\s*["']?\d{4}-\d{2}-\d{2}["']?/, 'updated: "2026-11-18"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(p, raw, 'utf8');
    fixed++;
  }
}

console.log(`Updated dates on ${fixed} guides in trivia-questions-digest.`);
