#!/usr/bin/env node
/**
 * Portfolio guardrail: `npm run check:portfolio`
 *
 * Keeps the three pillars equal and the copy clean. Run it after every content
 * update and before every PR. Exit code 1 on any error; warnings don't fail.
 *
 * Errors:
 *   - a pillar holds under 30% or over 36% of featured work, or fewer than 2 items
 *   - an em dash in src/data or the copy components
 *   - an en dash range like "2012–2016" in the same files; write "2012 to 2016"
 *   - the retired venture's name anywhere in src/ or public/
 *   - stale figures ("30,630", "7 published") in src/, public/, or scripts/
 *   - parentheses in the portfolio's public copy, except "(She/Her)" and area
 *     codes. Lesson content is left out: its code and math need parentheses.
 * Warnings:
 *   - a pillar's lastReviewed is more than 45 days old
 *   - a work item with no confirmed date
 *
 * Data files are imported directly (Node 24 strips TypeScript types), so
 * src/data/work.ts and src/data/pillars.ts may only use `import type` for
 * other modules. Path aliases in runtime imports would not resolve here.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const BAND = { min: 0.3, max: 0.36 };
const MIN_ITEMS = 2;
const STALE_DAYS = 45;

const errors = [];
const warnings = [];

// ---------- Balance and freshness ----------

const { work } = await import(join(root, "src/data/work.ts"));
const { pillars } = await import(join(root, "src/data/pillars.ts"));

const total = work.length;
const counts = Object.fromEntries(pillars.map((p) => [p.id, 0]));
for (const item of work) {
  if (!(item.pillar in counts)) {
    errors.push(`work item "${item.title}" has unknown pillar "${item.pillar}"`);
    continue;
  }
  counts[item.pillar] += 1;
  if (!item.date) warnings.push(`work item "${item.title}" has no date yet`);
  else if (!/^\d{4}(-\d{2})?$/.test(item.date)) errors.push(`work item "${item.title}" date "${item.date}" is not YYYY or YYYY-MM`);
}

console.log(`Featured work: ${total} items`);
for (const p of pillars) {
  const n = counts[p.id];
  const share = total ? n / total : 0;
  const pct = `${(share * 100).toFixed(1)}%`;
  console.log(`  ${p.id.padEnd(12)} ${String(n).padStart(2)}  ${pct}`);
  if (n < MIN_ITEMS) errors.push(`${p.id} has ${n} featured items (min ${MIN_ITEMS})`);
  if (share < BAND.min || share > BAND.max) {
    errors.push(`${p.id} is ${pct} of featured work (band ${BAND.min * 100} to ${BAND.max * 100}%)`);
  }

  const reviewed = new Date(`${p.lastReviewed}T00:00:00Z`);
  if (Number.isNaN(reviewed.getTime())) {
    errors.push(`${p.id} lastReviewed "${p.lastReviewed}" is not YYYY-MM-DD`);
  } else {
    const days = Math.floor((Date.now() - reviewed.getTime()) / 86_400_000);
    if (days > STALE_DAYS) warnings.push(`${p.id} last reviewed ${days} days ago (run the monthly review)`);
  }
}

// ---------- Copy scans ----------

function walk(dir, exts) {
  const out = [];
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

function scan(files, pattern, message, bucket = errors) {
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (pattern.test(line)) bucket.push(`${message}: ${relative(root, file)}:${i + 1}`);
    });
  }
}

const TEXT = [".ts", ".tsx", ".mjs", ".js", ".html", ".md", ".json", ".txt", ".svg"];
const copyFiles = [
  ...walk(join(root, "src/data"), [".ts"]),
  ...walk(join(root, "src/components"), [".tsx"]).filter((f) => !f.includes("/components/ui/")),
  ...walk(join(root, "src/app"), [".tsx"]),
];
scan(copyFiles, /—/, "em dash");
scan(copyFiles, /\d\s*–\s*(\d|now)/, "en dash range, use \"to\"");
// Built from pieces so the name never appears as a literal in this public repo.
const RETIRED = new RegExp(["bla", "cq", "list"].join(""), "i");
scan([...walk(join(root, "src"), TEXT), ...walk(join(root, "public"), TEXT)], RETIRED, "retired venture mention");
scan(
  [...walk(join(root, "src"), TEXT), ...walk(join(root, "public"), TEXT), ...walk(join(root, "scripts"), TEXT)].filter(
    (f) => !f.endsWith("check-portfolio.mjs"),
  ),
  /30,630|\b7 published\b/,
  "stale figure",
);

// Parentheses: prose strings in the site's data files, plus JSX text in the
// Night components and site pages. Screen-reader hints are fine.
const SITE_DATA = ["about", "labs", "mix", "pillars", "site", "stats", "teaching", "timeline", "work"].map((n) =>
  join(root, `src/data/${n}.ts`),
);
const siteViews = [
  ...walk(join(root, "src/components/night"), [".tsx"]),
  ...walk(join(root, "src/app"), [".tsx"]).filter((f) => !f.includes("/app/lab/")),
];
const PAREN_OK = /\(She\/Her\)|\(\d{3}\)|\(opens in a new tab\)/g;
const isProse = (s) => /[a-z] [a-z]/i.test(s) && /[()]/.test(s.replace(PAREN_OK, ""));
function scanParens(files, literal) {
  for (const file of files) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      for (const m of line.matchAll(literal)) {
        const text = m[1] ?? m[2];
        if (text && isProse(text)) errors.push(`parentheses in copy: ${relative(root, file)}:${i + 1}`);
      }
    });
  }
}
scanParens(SITE_DATA, /"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g);
scanParens(siteViews, /(?<![=-])>([^<>{}]*)</g);

// ---------- Report ----------

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
if (errors.length) {
  console.log(`\ncheck:portfolio failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\ncheck:portfolio passed${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
