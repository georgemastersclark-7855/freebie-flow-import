// deno test supabase/functions/_shared/klaviyoEmail.test.ts
import { campaignKey, campaignPrefix, emailParagraphs } from "./klaviyoEmail.ts";

function assertEquals(actual: unknown, expected: unknown, label = "") {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${label} expected ${e}, got ${a}`);
}
const plain = (html: string) => emailParagraphs(html).map((runs) => runs.map((run) => run.text).join(""));

Deno.test("paragraphs: reads the copy out of Klaviyo's nested tables and leaves the head out", () => {
  const html = `<html><head><title>Hidden</title><style>p{color:red}</style></head><body><!-- TRACKING_PIXEL_TOP --><table><tr><td><img src="logo.png"/></td></tr></table>
    <table><tr><td><div><p>What’s up squad!</p><p>Second line.</p></div></td></tr></table></body></html>`;
  assertEquals(plain(html), ["What’s up squad!", "Second line."]);
});

Deno.test("paragraphs: keeps bold, joins link text and decodes entities", () => {
  assertEquals(emailParagraphs(`<p><strong><a href="https://x">Click here</a></strong><strong>.</strong> Q&amp;A &#39;now&#39;</p>`), [[{ text: "Click here.", bold: true }, { text: " Q&A 'now'", bold: false }]]);
});

Deno.test("paragraphs: merge tags read as the reader would see them", () => {
  assertEquals(plain(`<p>Yes {{ person.first_name|default:'Squad' }}!</p><p>Hi {{ first_name }}</p>`), ["Yes Squad!", "Hi [first name]"]);
  assertEquals(plain(`<p>Yes {{ person.first_name|default:&#39;Squad&#39; }}!</p>`), ["Yes Squad!"], "encoded quotes");
});

Deno.test("paragraphs: stops at the unsubscribe footer and drops zero-width blanks", () => {
  assertEquals(plain(`<p>Rob</p><p>​</p><p>No longer want these? {% unsubscribe %}</p><p>{{ organization.name }}</p>`), ["Rob"]);
});

Deno.test("paragraphs: a line break starts a new paragraph", () => {
  assertEquals(plain(`<p>One<br/>Two</p>`), ["One", "Two"]);
});

Deno.test("campaign names: cohort prefix and the key the calendar matches on", () => {
  assertEquals(campaignPrefix("cohort-2"), "C2");
  assertEquals(campaignPrefix("cohort-12"), "C12");
  assertEquals(campaignPrefix("no-number"), null);
  assertEquals(campaignKey("C2 Sales 1 - You're Getting Priority Access [Waitlist]", "C2"), "Sales 1");
  assertEquals(campaignKey("C2 Warm Up 2 - Why Isn't That Verse One [180-Day Engaged]", "C2"), "Warm Up 2");
  assertEquals(campaignKey("C2 Last Call [180-Day]", "C2"), "Last Call");
  assertEquals(campaignKey("C12 Sales 1 - Other cohort", "C1"), null, "C1 must not match C12");
  assertEquals(campaignKey("Mentorship Launch", "C2"), null);
});
