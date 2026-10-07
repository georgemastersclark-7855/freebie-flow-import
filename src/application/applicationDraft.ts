export const FORM_VERSION = 'cohort-2-v1';
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
export type Answers = Record<string, string>;
export type Attribution = Partial<Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_content'|'utm_term'|'referrer',string>>;
export type ApplicationDraft = {version:string; revision:number; id:string; answers:Answers; step:number; updatedAt:number; attribution:Attribution; updatedForm?:boolean};
const draftKey=(formId:string)=>'rla-mentorship-application-'+formId;
export const emptyAnswers = (keys:string[]): Answers => Object.fromEntries(keys.map(key => [key,'']));

export function readDraft(formId:string,revision:number,keys:string[]): ApplicationDraft | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(draftKey(formId)) || 'null');
    if (!parsed || parsed.version !== formId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.id) || !Number.isFinite(parsed.updatedAt) || Date.now()-parsed.updatedAt>MAX_AGE) return null;
    const answers = emptyAnswers(keys);
    for (const key of keys) if (typeof parsed.answers?.[key] === 'string') answers[key] = parsed.answers[key].slice(0,4000);
    const attribution: Attribution = {};
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer'] as const) {
      if (typeof parsed.attribution?.[key] === 'string') attribution[key] = parsed.attribution[key].slice(0,200);
    }
    const updatedForm=(parsed.revision??1)!==revision;
    return {...parsed,version:formId,revision,answers,attribution,updatedForm,id:updatedForm?crypto.randomUUID():parsed.id,step:updatedForm?0:Math.max(0,Math.min(keys.length,Number(parsed.step)||0))};
  } catch { return null; }
}
export function saveDraft(draft:ApplicationDraft):boolean {
  try { localStorage.setItem(draftKey(draft.version),JSON.stringify({...draft,updatedAt:Date.now()})); return true; } catch { return false; }
}
export function clearDraft(formId:string) { try { localStorage.removeItem(draftKey(formId)); } catch { /* Storage can be disabled. */ } }
export function readAttribution():Attribution {
  const params = new URLSearchParams(window.location.search);
  const attribution:Attribution = {};
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const) {
    const value=params.get(key);
    if (value) attribution[key]=value.slice(0,200);
  }
  if(document.referrer) {
    try { const url=new URL(document.referrer); const referrer=url.origin + url.pathname; attribution.referrer=referrer.length<=200?referrer:url.origin; } catch { /* No usable referrer. */ }
  }
  return attribution;
}
