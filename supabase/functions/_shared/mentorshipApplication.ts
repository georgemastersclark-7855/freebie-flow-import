export const MENTORSHIP_APPLICATION_FORM_VERSION = 'cohort-2-v1';
export const MENTORSHIP_APPLICATION_FORM_ID = 'cohort-2-v1';

export const APPLICATION_FIELDS = [
  { key: 'name', title: "What's your name?", required: true, type: 'text', maxLength: 160 },
  { key: 'email', title: "What's your email address?", required: true, type: 'email', maxLength: 254 },
  { key: 'social', title: "What's your social media handle?", required: false, type: 'text', maxLength: 120 },
  { key: 'music', title: 'Got any music we can listen to?', required: false, type: 'textarea', maxLength: 2048 },
  { key: 'experience', title: 'How long have you been producing?', required: false, type: 'choice', options: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years', 'Returning after a break'] },
  { key: 'goal', title: "What's your goal with music?", required: false, type: 'choice', options: ['Full-time career', 'Side income alongside my job', 'Serious hobby'] },
  { key: 'struggles', title: 'What are the 3 main struggles holding you back with your music?', required: false, type: 'textarea', maxLength: 2000 },
  { key: 'income', title: 'How much are you currently making from music?', required: false, type: 'choice', options: ['$0', 'Under $1k/month', '$1–5k/month', '$5k+/month'] },
  { key: 'investment', title: 'The six-week mentorship is $2,497 USD. Are you ready to invest?', required: true, type: 'choice', options: ["Yes, I'm ready", 'I have questions first', 'Not right now'] },
  { key: 'source', title: 'How did you hear about Rob?', required: false, type: 'choice', options: ['Instagram', 'YouTube', 'Friend/word of mouth', 'Other'] },
] as const;

export const MENTORSHIP_APPLICATION_FIELDS = APPLICATION_FIELDS;
const ANSWER_KEYS = APPLICATION_FIELDS.map((field) => field.key);
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParsedMentorshipApplication = {
  submission_id: string;
  email: string;
  lead: { full_name: string; email: string; source: string; source_detail: string; goals: string; music_url: string | null; application_url: null; stage: 'applied' };
  answers: Array<{ key: string; question: string; answer: string }>;
  attribution: Record<(typeof ATTRIBUTION_KEYS)[number], string>;
};

export function validateApplicationAnswers(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid answers');
  const rawAnswers = input as Record<string, unknown>;
  if (Object.keys(rawAnswers).some((key) => !ANSWER_KEYS.includes(key as typeof ANSWER_KEYS[number]))) throw new Error('Invalid answers');
  const normalized: Record<string, string> = {};
  for (const field of APPLICATION_FIELDS) {
    const value = cleanText(rawAnswers[field.key], 'maxLength' in field ? field.maxLength : 160, field.required, field.key);
    if (field.type === 'email' && (!EMAIL_RE.test(value) || value.length > 254)) throw new Error('Invalid email');
    if (field.type === 'choice' && value && !field.options.includes(value as never)) throw new Error(`Invalid ${field.key}`);
    if (field.key === 'music' && value) extractMusicLinks(value);
    normalized[field.key] = value;
  }
  normalized.email = normalized.email.toLowerCase();
  return normalized;
}

function cleanText(value: unknown, maxLength: number, required: boolean, field: string): string {
  if (typeof value !== 'string') {
    if (required) throw new Error(`Invalid ${field}`);
    return '';
  }
  const result = value.trim();
  if ((required && !result) || result.length > maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(result)) throw new Error(`Invalid ${field}`);
  return result;
}

function safeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function extractMusicLinks(value: string): string[] {
  if (/\bhttp:\/\//i.test(value)) throw new Error('Music links must use HTTPS');
  const matches = value.match(/https:\/\/[^\s<>"']+/gi) ?? [];
  const links = matches.map((match) => match.replace(/[),.;!?\]}]+$/g, ''));
  if (links.length > 8 || links.some((link) => !safeHttpsUrl(link))) throw new Error('Invalid music link');
  return links;
}

export function parseMentorshipApplication(input: unknown): ParsedMentorshipApplication {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid application');
  const body = input as Record<string, unknown>;
  if (body.form_version !== MENTORSHIP_APPLICATION_FORM_VERSION) throw new Error('Invalid form version');
  if (typeof body.submission_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submission_id)) throw new Error('Invalid submission id');
  if (typeof body.website !== 'string' || body.website.length > 0) throw new Error('Invalid application');
  const normalized = validateApplicationAnswers(body.answers);
  if (!body.attribution || typeof body.attribution !== 'object' || Array.isArray(body.attribution)) throw new Error('Invalid attribution');
  const rawAttribution = body.attribution as Record<string, unknown>;
  if (Object.keys(rawAttribution).some((key) => !ATTRIBUTION_KEYS.includes(key as typeof ATTRIBUTION_KEYS[number]))) throw new Error('Invalid attribution');
  const attribution = {} as ParsedMentorshipApplication['attribution'];
  for (const key of ATTRIBUTION_KEYS) {
    const value = cleanText(rawAttribution[key], 200, false, key);
    if (key === 'referrer' && value) {
      try {
        const url = new URL(value);
        if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error();
        const canonicalUrl = url.toString();
        if (canonicalUrl.length > 200) throw new Error();
        attribution[key] = canonicalUrl;
      } catch { throw new Error('Invalid attribution'); }
    } else attribution[key] = value;
  }
  const answers = APPLICATION_FIELDS.map((field) => ({ key: field.key, question: field.title, answer: normalized[field.key] }));
  const source = normalized.source || 'Not recorded';
  const music = extractMusicLinks(normalized.music)[0] || null;
  const attributionSummary = ATTRIBUTION_KEYS.slice(0, 5).map((key) => attribution[key] ? `${key}=${attribution[key]}` : '').filter(Boolean).join('&');
  return {
    submission_id: body.submission_id,
    email: normalized.email,
    lead: {
      full_name: normalized.name,
      email: normalized.email,
      source,
      source_detail: attributionSummary.slice(0, 1000),
      goals: [normalized.goal, normalized.struggles].filter(Boolean).join('\n\n').slice(0, 4000),
      music_url: music,
      application_url: null,
      stage: 'applied',
    },
    answers,
    attribution,
  };
}
