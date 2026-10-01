/**
 * Lays out one resume mix as a PDF: header, summary, skills, one experience
 * section per craft in fader order, then additional experience, education
 * and publications. Single column, standard fonts, real text, so applicant
 * tracking systems read it cleanly.
 *
 * If a mix runs past two pages, the quietest craft gives up its lowest
 * ranked bullets, skills and extra entries first, before the next craft up
 * is touched. The loudest craft never drops below mid depth.
 */

import { PDFDocument, PDFFont, PDFPage, PDFString, StandardFonts, rgb } from "pdf-lib";
import type { PillarId } from "@/data/pillars";
import {
  ADDITIONAL_HEADING,
  CRAFTS,
  EDUCATION,
  ENTRIES,
  HEADER,
  PUBLICATIONS,
  type Bullet,
  type Entry,
  type SkillGroup,
  type Tier,
} from "@/data/resume-bank";
import type { MixPart } from "@/data/resume-mix";

const MAX_PAGES = 2;

// ── Depth rules ──────────────────────────────────────────────────────────

const BULLETS_AT: Record<Tier, number> = { 1: 1, 2: 3, 3: Infinity };
const SKILLS_AT: Record<Tier, number> = { 1: 1, 2: 2, 3: Infinity };

type EntryPlan = { entry: Entry; bullets: Bullet[] };
type CraftPlan = { id: PillarId; skills: SkillGroup[]; entries: EntryPlan[] };

function planCraft(id: PillarId, tier: Tier, on: Set<PillarId>): CraftPlan {
  const skills = CRAFTS[id].skills.filter((g) => !g.unlessOn || !on.has(g.unlessOn)).slice(0, SKILLS_AT[tier]);
  const entries = ENTRIES.filter((e) => e.home === id && e.minTier <= tier).map((entry) => ({
    entry,
    bullets: entry.bullets.filter((b) => !b.needs || on.has(b.needs)).slice(0, BULLETS_AT[tier]),
  }));
  return { id, skills, entries };
}

type CraftTrim = { plan: CraftPlan; tier: Tier; floor: Tier };
type Cut = { depth: number; apply: () => void };

/** Every cut a craft can still take without dropping below its floor. */
function cutsFor({ plan, floor }: CraftTrim): Cut[] {
  const cuts: Cut[] = [];
  plan.entries.forEach((ep, e) => {
    const b = ep.bullets.length - 1;
    if (b >= BULLETS_AT[floor]) {
      cuts.push({ depth: b + e * 0.01, apply: () => (ep.bullets = ep.bullets.slice(0, -1)) });
    }
    if (ep.entry.minTier > floor) {
      cuts.push({ depth: 3 + e * 0.01, apply: () => (plan.entries = plan.entries.filter((x) => x !== ep)) });
    }
  });
  const g = plan.skills.length - 1;
  if (g >= SKILLS_AT[floor]) cuts.push({ depth: g + 0.5, apply: () => (plan.skills = plan.skills.slice(0, -1)) });
  return cuts;
}

/**
 * One cut at a time. The lowest tier gives first. Crafts that share a tier
 * give their deepest item in turn, so an all-loud mix stays balanced.
 * Returns false when nothing is left to cut.
 */
function trimOnce(crafts: CraftTrim[]): boolean {
  const tiers = [...new Set(crafts.map((c) => c.tier))].sort();
  for (const tier of tiers) {
    const cuts = crafts
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.tier === tier)
      .flatMap(({ c, i }) => cutsFor(c).map((cut) => ({ ...cut, i })));
    if (!cuts.length) continue;
    cuts.sort((a, b) => b.depth - a.depth || b.i - a.i);
    cuts[0].apply();
    return true;
  }
  return false;
}

// ── Text ─────────────────────────────────────────────────────────────────

const SWAPS: [RegExp, string][] = [
  [/[‘’]/g, "'"],
  [/[“”]/g, '"'],
  [/[–—]/g, "-"],
  [/×/g, "x"],
  [/[→⟶]/g, "->"],
  [/ /g, " "],
];

/** Keeps every string inside the WinAnsi set the standard fonts can encode. */
export function sanitize(text: string): string {
  let out = text;
  for (const [re, to] of SWAPS) out = out.replace(re, to);
  return out.replace(/[^\x20-\x7e•é]/g, "");
}

// ── Layout engine ────────────────────────────────────────────────────────

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 50;
const WIDTH = PAGE_W - MARGIN_X * 2;

const INK = rgb(0.1, 0.11, 0.13);
const SOFT = rgb(0.32, 0.34, 0.38);
const RULE = rgb(0.72, 0.73, 0.76);

const BODY = 9.5;
const LEAD = 12.4;
const BULLET_INDENT = 14;

type Fonts = { regular: PDFFont; bold: PDFFont };
type Run = { text: string; bold?: boolean; color?: typeof INK; href?: string };

class Writer {
  pages = 1;
  y = PAGE_H - MARGIN_TOP;
  private page: PDFPage | null = null;

  constructor(
    private fonts: Fonts,
    private doc: PDFDocument | null,
  ) {
    if (doc) this.page = doc.addPage([PAGE_W, PAGE_H]);
  }

  font(bold?: boolean): PDFFont {
    return bold ? this.fonts.bold : this.fonts.regular;
  }

  width(text: string, size: number, bold?: boolean): number {
    return this.font(bold).widthOfTextAtSize(text, size);
  }

  /** Starts a new page unless `height` still fits on this one. */
  ensure(height: number): void {
    if (this.y - height >= MARGIN_BOTTOM) return;
    this.pages += 1;
    this.y = PAGE_H - MARGIN_TOP;
    if (this.doc) this.page = this.doc.addPage([PAGE_W, PAGE_H]);
  }

  gap(h: number): void {
    this.y -= h;
  }

  private draw(text: string, x: number, size: number, bold?: boolean, color = INK, href?: string): void {
    if (!this.page || !text) return;
    this.page.drawText(text, { x, y: this.y, size, font: this.font(bold), color });
    if (href && this.doc) {
      const w = this.width(text, size, bold);
      const annot = this.doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, this.y - 2, x + w, this.y + size],
        Border: [0, 0, 0],
        A: { Type: "Action", S: "URI", URI: PDFString.of(href) },
      });
      this.page.node.addAnnot(this.doc.context.register(annot));
    }
  }

  /** Wraps runs word by word across the width, keeping each run's style. */
  rich(runs: Run[], opts: { x?: number; width?: number; size?: number; lead?: number } = {}): number {
    const x0 = opts.x ?? MARGIN_X;
    const maxW = opts.width ?? WIDTH - (x0 - MARGIN_X);
    const size = opts.size ?? BODY;
    const lead = opts.lead ?? LEAD;

    type Word = { text: string; run: Run };
    const lines: Word[][] = [[]];
    let lineW = 0;
    for (const run of runs) {
      const words = sanitize(run.text).split(/(?<= )/);
      for (const text of words) {
        const w = this.width(text, size, run.bold);
        const trimmedW = this.width(text.trimEnd(), size, run.bold);
        if (lineW + trimmedW > maxW && lines[lines.length - 1].length) {
          lines.push([]);
          lineW = 0;
        }
        lines[lines.length - 1].push({ text, run });
        lineW += w;
      }
    }
    for (const line of lines) {
      this.ensure(lead);
      this.y -= size;
      let x = x0;
      // Merge neighbouring words of one run so links cover the whole run.
      const pieces: Word[] = [];
      for (const w of line) {
        const last = pieces[pieces.length - 1];
        if (last && last.run === w.run) last.text += w.text;
        else pieces.push({ ...w });
      }
      pieces.forEach((pc, i) => {
        const text = i === pieces.length - 1 ? pc.text.trimEnd() : pc.text;
        this.draw(text.trimEnd(), x, size, pc.run.bold, pc.run.color ?? INK, pc.run.href);
        x += this.width(text, size, pc.run.bold);
      });
      this.y -= lead - size;
    }
    return lines.length;
  }

  /** A left label and a right label on one line, such as a title and its dates. */
  split(left: Run[], right: string | undefined, size = 10): void {
    const rightW = right ? this.width(sanitize(right), BODY) + 12 : 0;
    this.rich(left, { size, width: WIDTH - rightW, lead: size + 3.2 });
    if (right && this.page) {
      const text = sanitize(right);
      const y = this.y;
      this.y = y + 3.2;
      this.draw(text, PAGE_W - MARGIN_X - this.width(text, BODY), BODY, false, SOFT);
      this.y = y;
    }
  }

  bullet(text: string): void {
    this.ensure(LEAD);
    const y = this.y - BODY;
    if (this.page) this.page.drawText("•", { x: MARGIN_X + 3, y, size: BODY, font: this.fonts.regular, color: SOFT });
    this.rich([{ text }], { x: MARGIN_X + BULLET_INDENT });
  }

  heading(text: string): void {
    this.gap(9);
    this.ensure(10 + 6 + LEAD * 3);
    this.y -= 10;
    this.draw(sanitize(text).toUpperCase(), MARGIN_X, 10, true);
    this.y -= 4;
    this.page?.drawLine({
      start: { x: MARGIN_X, y: this.y },
      end: { x: PAGE_W - MARGIN_X, y: this.y },
      thickness: 0.6,
      color: RULE,
    });
    this.y -= 5;
  }

  /** Page numbers on every page after the first. */
  footers(): void {
    if (!this.doc) return;
    this.doc.getPages().forEach((page, i) => {
      if (i === 0) return;
      const text = `${HEADER.name} | ${i + 1}`;
      page.drawText(text, {
        x: PAGE_W - MARGIN_X - this.fonts.regular.widthOfTextAtSize(text, 8),
        y: MARGIN_BOTTOM - 22,
        size: 8,
        font: this.fonts.regular,
        color: SOFT,
      });
    });
  }
}

// ── Resume ───────────────────────────────────────────────────────────────

function headline(parts: MixPart[]): string {
  return parts.length === 1 ? CRAFTS[parts[0].id].soloHeadline : parts.map((p) => CRAFTS[p.id].title).join(" | ");
}

function contactRuns(on: Set<PillarId>): Run[][] {
  const sep: Run = { text: "  |  ", color: SOFT };
  const join = (items: Run[]): Run[] => items.flatMap((r, i) => (i ? [sep, r] : [r]));
  const [email, city, phone] = HEADER.contact;
  const links = [...HEADER.links, ...(on.has("software") ? [HEADER.github] : [])];
  return [
    join([
      { text: email, href: `mailto:${email}` },
      { text: city },
      { text: phone, href: `tel:+1${phone.replace(/\D/g, "")}` },
    ]),
    join(links.map((l) => ({ text: l, href: `https://${l}` }))),
  ];
}

function write(w: Writer, parts: MixPart[], plans: CraftPlan[]): void {
  const on = new Set(parts.map((p) => p.id));

  // Header
  w.y -= 20;
  w.rich([{ text: HEADER.name, bold: true }], { size: 20, lead: 24 });
  w.rich([{ text: headline(parts), color: SOFT }], { size: 10.5, lead: 14 });
  w.gap(2);
  for (const line of contactRuns(on)) w.rich(line, { size: 9, lead: 12 });

  // Summary
  w.heading("Summary");
  const summary = [CRAFTS[parts[0].id].opener, ...parts.map((p) => CRAFTS[p.id].proof)].join(" ");
  w.rich([{ text: summary }]);

  // Skills, grouped by craft in fader order
  w.heading("Skills");
  for (const p of plans) {
    for (const g of p.skills) {
      w.rich([{ text: `${g.label}: `, bold: true }, { text: g.items }]);
      w.gap(1.5);
    }
  }

  // One section per craft, loudest first
  for (const p of plans) {
    if (!p.entries.length) continue;
    w.heading(CRAFTS[p.id].section);
    p.entries.forEach((ep, i) => {
      if (i) w.gap(5);
      const e = ep.entry;
      w.ensure(14 + 13 + LEAD);
      if (e.kind === "role") {
        w.split([{ text: e.title, bold: true }], e.dates);
        w.rich([{ text: [e.org, e.place].filter(Boolean).join(", "), color: SOFT }], { size: BODY, lead: LEAD + 1 });
      } else {
        w.split([{ text: e.title, bold: true }, { text: `  |  ${e.org}`, color: SOFT }], undefined);
        w.gap(1);
      }
      for (const b of ep.bullets) w.bullet(b.text);
    });
  }

  // Roles the mix left out, one line each, so no stretch of time goes missing
  const shown = new Set(plans.flatMap((p) => p.entries.map((ep) => ep.entry.id)));
  const rest = ENTRIES.filter((e) => e.kind === "role" && !shown.has(e.id));
  if (rest.length) {
    w.heading(ADDITIONAL_HEADING);
    for (const e of rest) {
      w.rich([{ text: e.title, bold: true }, { text: `  |  ${[e.org, e.dates].filter(Boolean).join("  |  ")}`, color: SOFT }]);
      w.gap(1.5);
    }
  }

  // Education, always
  w.heading("Education");
  EDUCATION.forEach((ed, i) => {
    if (i) w.gap(5);
    w.ensure(14 + 13 + LEAD);
    w.split([{ text: ed.degree, bold: true }], ed.dates);
    w.rich([{ text: `${ed.school}, ${ed.place}`, color: SOFT }], { size: BODY, lead: LEAD + 1 });
    for (const d of ed.details.filter((d) => !d.needs || on.has(d.needs))) w.bullet(d.text);
  });

  // Publications, always
  w.heading("Publications");
  for (const pub of PUBLICATIONS) w.bullet(pub.text);
}

export type ResumeRender = { bytes: Uint8Array; pages: number };

/** Renders one mix. `parts` are the crafts that are on, loudest first. */
export async function renderResume(parts: MixPart[], maxPages = MAX_PAGES): Promise<ResumeRender> {
  if (!parts.length) throw new Error("A resume mix needs at least one craft.");
  const on = new Set(parts.map((p) => p.id));
  const doc = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  const plans = parts.map((p) => planCraft(p.id, p.tier, on));
  const crafts: CraftTrim[] = parts.map((p, i) => ({
    plan: plans[i],
    tier: p.tier,
    floor: i === 0 ? (Math.min(2, p.tier) as Tier) : 1,
  }));
  const measure = (): number => {
    const w = new Writer(fonts, null);
    write(w, parts, plans);
    return w.pages;
  };
  while (measure() > maxPages && trimOnce(crafts)) {
    // keep trimming until it fits or nothing is left to cut
  }

  const w = new Writer(fonts, doc);
  write(w, parts, plans);
  w.footers();

  doc.setTitle(`${HEADER.name} Resume`);
  doc.setAuthor(HEADER.name);
  doc.setSubject(headline(parts));
  doc.setKeywords(parts.map((p) => CRAFTS[p.id].title));
  doc.setCreator(HEADER.name);
  doc.setProducer(HEADER.name);
  doc.setLanguage("en-US");

  return { bytes: await doc.save(), pages: doc.getPageCount() };
}
