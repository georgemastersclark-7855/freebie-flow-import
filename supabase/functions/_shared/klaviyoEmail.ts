// Pure helpers for showing Klaviyo campaign copy in the staff calendar. No network access here, so
// they can be unit tested with `deno test`.

export interface EmailRun { text: string; bold: boolean }
export type EmailParagraph = EmailRun[];

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", ndash: "–", mdash: "—", pound: "£", copy: "©" };
const decode = (text: string) => text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code: string) => {
  if (code[0] !== "#") return NAMED[code.toLowerCase()] ?? whole;
  const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
  return Number.isFinite(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
});

// Merge tags as a reader would see them: {{ person.first_name|default:'Squad' }} reads as "Squad".
const mergeTags = (text: string) => text
  .replace(/\{\{[^}]*\|\s*default:\s*['"]([^'"]*)['"][^}]*\}\}/g, "$1")
  .replace(/\{\{\s*(?:person\.)?first_name\s*\}\}/g, "[first name]");

const BLOCK = /^(p|div|li|ul|ol|tr|td|table|tbody|h[1-6]|blockquote|br|hr)$/;

/** The email's readable text, paragraph by paragraph. Klaviyo's unsubscribe footer is left out. */
export function emailParagraphs(html: string): EmailParagraph[] {
  const body = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(head|style|script|title)\b[\s\S]*?<\/\1\s*>/gi, "");
  const paragraphs: EmailParagraph[] = [];
  let current: EmailParagraph = [], bold = 0;
  const flush = () => {
    const runs = current.map((run) => ({ ...run })).filter((run) => run.text);
    if (runs.length) { runs[0].text = runs[0].text.trimStart(); runs[runs.length - 1].text = runs[runs.length - 1].text.trimEnd(); }
    const kept = runs.filter((run) => run.text);
    if (kept.length) paragraphs.push(kept);
    current = [];
  };
  for (const token of body.match(/<[^>]+>|[^<]+/g) ?? []) {
    if (token[0] === "<") {
      const tag = /^<\s*(\/?)\s*([a-z0-9]+)/i.exec(token);
      if (!tag) continue;
      const name = tag[2].toLowerCase();
      if (name === "strong" || name === "b") bold = Math.max(0, bold + (tag[1] ? -1 : 1));
      else if (BLOCK.test(name)) flush();
      continue;
    }
    const text = mergeTags(decode(token)).replace(/[​‌‍﻿]/g, "").replace(/\s+/g, " ");
    if (!text.trim() && !current.length) continue;
    const last = current[current.length - 1];
    if (last && last.bold === (bold > 0)) last.text += text; else current.push({ text, bold: bold > 0 });
  }
  flush();
  const end = paragraphs.findIndex((runs) => runs.some((run) => /\{%\s*unsubscribe|\{\{\s*organization\./i.test(run.text)));
  return end < 0 ? paragraphs : paragraphs.slice(0, end);
}

/** "cohort-2" to "C2", the start of that cohort's Klaviyo campaign names. */
export function campaignPrefix(slug: string): string | null {
  const number = /(\d+)\s*$/.exec(slug)?.[1];
  return number ? `C${number}` : null;
}

/** "C2 Sales 1 - I'm Raising The Standard [Waitlist]" to "Sales 1", or null if it isn't this cohort's. */
export function campaignKey(name: string, prefix: string): string | null {
  const start = `${prefix} `.toLowerCase();
  if (!name.toLowerCase().startsWith(start)) return null;
  const key = name.slice(start.length).split(/\s+-\s+|\s*\[/)[0].trim();
  return key || null;
}
