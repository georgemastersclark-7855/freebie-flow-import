// The Applications screen works everything out here from real records, so nothing on it is typed in by hand.
export type PipelineKey = 'interested' | 'review' | 'offer' | 'paid' | 'onboarding';
export interface ApplicationAnswer { key: string; question: string; answer: string }
export interface ApplicationRecord { id: string; lead_id: string; submitted_at: string; answers: ApplicationAnswer[]; attribution: Record<string, string | null> | null }
export interface ListColumn { key: string; label: string }

export const pipelineStages: { key: PipelineKey; label: string; hint: string; about: string }[] = [
  { key: 'interested', label: 'Interested', hint: "haven't applied yet", about: "People who've shown interest but haven't applied yet." },
  { key: 'review', label: 'To review', hint: 'applied, waiting on you', about: 'Applied and waiting on your decision. Nearest deadline first.' },
  { key: 'offer', label: 'Offer sent', hint: 'approved, waiting on payment', about: 'Approved. Waiting on their payment.' },
  { key: 'paid', label: 'Paid', hint: 'place secured', about: 'Paid and got their place.' },
  { key: 'onboarding', label: 'Onboarding', hint: 'paid, getting set up', about: 'Paid and getting set up: call, profile and coaching focus.' },
];

/** One entry per person: their most recent application. */
export function latestApplications(applications: ApplicationRecord[]) {
  const latest = new Map<string, ApplicationRecord>();
  for (const application of applications) {
    const current = latest.get(application.lead_id);
    if (!current || application.submitted_at > current.submitted_at) latest.set(application.lead_id, application);
  }
  return latest;
}
export const answerOf = (application: ApplicationRecord | undefined, key: string | null) =>
  (key && application?.answers.find(a => a.key === key)?.answer?.trim()) || '';

/** Web links in an answer. A link pasted without https:// still counts. */
export function answerLinks(text: string): string[] {
  const links: string[] = [];
  for (const part of text.split(/[\s,]+/)) {
    const clean = part.replace(/^[(<]+|[),.;!?>\]}]+$/g, '');
    if (/^https?:\/\//i.test(clean)) links.push(clean);
    else if (/^(www\.|[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}\/\S)/i.test(clean)) links.push(`https://${clean}`);
  }
  return links.filter(link => { try { return ['https:', 'http:'].includes(new URL(link).protocol); } catch { return false; } });
}
const linkNames: [RegExp, string][] = [[/soundcloud/, 'SoundCloud'], [/spotify/, 'Spotify'], [/youtube|youtu\.be/, 'YouTube'], [/dropbox/, 'Dropbox'], [/drive\.google|docs\.google/, 'Google Drive'], [/instagram/, 'Instagram'], [/tiktok/, 'TikTok'], [/music\.apple/, 'Apple Music'], [/disco\.ac/, 'DISCO'], [/bandcamp/, 'Bandcamp']];
export function linkName(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return linkNames.find(([pattern]) => pattern.test(host))?.[1] ?? host;
}
/** Names a set of links, numbering repeats: SoundCloud 1, SoundCloud 2, Spotify. */
export function namedLinks(urls: string[]) {
  const names = urls.map(linkName);
  return urls.map((url, i) => ({ url, name: names.filter(n => n === names[i]).length > 1 ? `${names[i]} ${names.slice(0, i + 1).filter(n => n === names[i]).length}` : names[i] }));
}

/** Time left on a promise, such as replying within 24 hours of an application. */
export function deadline(from: string, hours: number, now: number, pastLabel = 'Overdue') {
  const left = new Date(from).getTime() + hours * 3600_000 - now;
  if (left <= 0) return { label: pastLabel, tone: 'red' as const };
  const leftHours = left / 3600_000;
  const label = leftHours >= 1 ? `${Math.floor(leftHours)}h left` : `${Math.max(1, Math.floor(left / 60_000))}m left`;
  return { label, tone: leftHours <= 2 ? 'red' as const : leftHours <= hours * 2 / 3 ? 'amber' as const : 'gray' as const };
}

export const dayKey = (value: Date | string, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
const addDays = (key: string, days: number) => new Date(Date.parse(`${key}T12:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

/** Applications per day: from the first application to the close date, or the last two weeks if there is no close date. */
export function applicationsPerDay(applications: ApplicationRecord[], timeZone: string, closesAt: string | null, now: number) {
  const today = dayKey(new Date(now), timeZone);
  const counts = new Map<string, number>();
  for (const application of applications) { const key = dayKey(application.submitted_at, timeZone); counts.set(key, (counts.get(key) ?? 0) + 1); }
  const first = [...counts.keys()].sort()[0] ?? today;
  const end = closesAt ? dayKey(closesAt, timeZone) : today;
  const earliest = addDays(end, -13);
  const start = [first < today ? first : today, earliest].sort()[1];
  const days: { key: string; label: string; count: number; today: boolean; future: boolean }[] = [];
  for (let key = start; key <= end; key = addDays(key, 1)) {
    days.push({ key, label: new Date(`${key}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }), count: counts.get(key) ?? 0, today: key === today, future: key > today });
  }
  return days;
}

export function timeLeft(closesAt: string, now: number) {
  const left = new Date(closesAt).getTime() - now;
  if (left <= 0) return null;
  return { days: Math.floor(left / 86_400_000), hours: Math.floor(left / 3_600_000) % 24, minutes: Math.floor(left / 60_000) % 60 };
}
export const closesDate = (closesAt: string, timeZone: string) =>
  new Date(closesAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone }).replace(',', '');
export const closesTime = (closesAt: string, timeZone: string) =>
  `${new Date(closesAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone })} ${timeZone === 'Europe/London' ? 'UK time' : timeZone.split('/').pop()?.replace(/_/g, ' ') + ' time'}`;

/** Where an application came from, read from the tracking tag it arrived with. */
export function applicationChannel(attribution: ApplicationRecord['attribution']) {
  const source = (attribution?.utm_source ?? '').trim();
  if (/klaviyo|mailchimp|convertkit|\bkit\b|email|newsletter/i.test(source) || /email/i.test(attribution?.utm_medium ?? '')) return 'An email';
  if (source) return source[0].toUpperCase() + source.slice(1);
  return 'Direct or unknown';
}
