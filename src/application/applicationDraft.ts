export const FORM_VERSION = 'cohort-2-v1';
const DRAFT_KEY = 'rla-mentorship-application-' + FORM_VERSION;
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
export const ANSWER_KEYS = ['name','email','social','music','experience','goal','struggles','income','investment','source'] as const;
export type AnswerKey = typeof ANSWER_KEYS[number];
export type Answers = Record<AnswerKey, string>;
export type Attribution = Partial<Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_content'|'utm_term'|'referrer',string>>;
export type ApplicationDraft = {version:string; id:string; answers:Answers; step:number; updatedAt:number; attribution:Attribution};
export const emptyAnswers = (): Answers => Object.fromEntries(ANSWER_KEYS.map(key => [key,''])) as Answers;

export function readDraft(): ApplicationDraft | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!parsed || parsed.version !== FORM_VERSION || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.id) || !Number.isFinite(parsed.updatedAt) || Date.now()-parsed.updatedAt>MAX_AGE) return null;
    const answers = emptyAnswers();
    for (const key of ANSWER_KEYS) if (typeof parsed.answers?.[key] === 'string') answers[key] = parsed.answers[key].slice(0,4000);
    const attribution: Attribution = {};
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer'] as const) {
      if (typeof parsed.attribution?.[key] === 'string') attribution[key] = parsed.attribution[key].slice(0,200);
    }
    return {...parsed, answers, attribution, step:Math.max(0,Math.min(10,Number(parsed.step)||0))};
  } catch { return null; }
}

export function saveDraft(draft:ApplicationDraft):boolean {
  try { localStorage.setItem(DRAFT_KEY,JSON.stringify({...draft,updatedAt:Date.now()})); return true; } catch { return false; }
}
export function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch { /* Storage can be disabled. */ } }

export function readAttribution():Attribution {
  const params = new URLSearchParams(window.location.search);
  const attribution:Attribution = {};
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const) {
    const value=params.get(key);
    if (value) attribution[key]=value.slice(0,200);
  }
  // Do not keep referrer query strings, which can contain personal information.
  if(document.referrer) {
    try { const url=new URL(document.referrer); const referrer=url.origin + url.pathname; attribution.referrer=referrer.length<=200?referrer:url.origin; } catch { /* No usable referrer. */ }
  }
  return attribution;
}
