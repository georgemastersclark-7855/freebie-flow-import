import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  buildApplicationLead,
  validateApplicationAnswers,
  validateApplicationAttribution,
  validateFormConfig,
  type ApplicationAttribution,
  type ApplicationFormConfig,
  type ValidatedApplication,
} from '../_shared/applicationFormSchema.ts';

const DEFAULT_FORM_ID = 'cohort-2-v1';
const LEGACY_FORM_VERSION = 'cohort-2-v1';
const MAX_BODY_BYTES = 160_000;
const allowedOrigins = new Set(['https://audio.roblate.com', 'https://freebie-finder-friend.lovable.app']);

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

function response(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (allowedOrigins.has(origin)) return true;
  try {
    const parsed = new URL(origin);
    return parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname) && Boolean(parsed.port);
  } catch { return false; }
}

async function hashRateKey(secret: string, kind: 'ip' | 'email', value: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${secret}\0native-application-rate\0${kind}\0${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string | null {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const candidate = forwarded || req.headers.get('x-real-ip')?.trim() || '';
  if (!candidate || candidate.length > 64 || !/^[0-9a-fA-F:.]+$/.test(candidate)) return null;
  return candidate.toLowerCase();
}

async function readLimitedBody(req: Request): Promise<string | null> {
  if (!req.body) return '';
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

function makeDb() {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) throw new Error('Service unavailable');
  return { db: createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }), serviceKey };
}

async function loadRevision(db: ReturnType<typeof createClient>, formId: string, revision: number): Promise<ApplicationFormConfig> {
  const { data, error } = await db.rpc('get_mentorship_application_form_revision', { p_form_id: formId, p_revision: revision });
  if (error) throw Object.assign(new Error('Unable to load application form'), { code: error.code });
  if (!data || data.form_id !== formId || data.revision !== revision || typeof data.cohort_id !== 'string') throw new Error('Application form unavailable');
  return validateFormConfig(data.config);
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (!originAllowed(origin)) return response({ error: 'Origin not allowed' }, 403, null);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== 'GET' && req.method !== 'POST') return response({ error: 'Method not allowed' }, 405, origin);

  try {
    const { db } = makeDb();
    if (req.method === 'GET') {
      const requestedSlug = new URL(req.url).searchParams.get('slug');
      const slug = requestedSlug?.trim() || null;
      if (slug && (slug.length > 80 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))) return response({ error: 'Form not found' }, 404, origin);
      const { data, error } = await db.rpc('get_public_mentorship_application_form', { p_slug: slug });
      if (error) {
        if (error.code === 'P0404') return response({ error: 'Applications are closed' }, 410, origin);
        return response({ error: 'Temporarily unavailable' }, 503, origin);
      }
      if (!data?.id || !Number.isInteger(data.revision) || !data.config) return response({ error: 'Temporarily unavailable' }, 503, origin);
      return response({ form: data }, 200, origin);
    }

    const contentLength = Number(req.headers.get('content-length') ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return response({ error: 'Payload too large' }, 413, origin);
    const raw = await readLimitedBody(req);
    if (raw === null) return response({ error: 'Payload too large' }, 413, origin);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return response({ error: 'Invalid application' }, 400, origin); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return response({ error: 'Invalid application' }, 400, origin);
    const input = body as Record<string, unknown>;
    const legacy = input.form_version === LEGACY_FORM_VERSION;
    const allowedKeys = legacy
      ? ['form_version', 'submission_id', 'answers', 'attribution', 'website']
      : ['form_id', 'form_revision', 'submission_id', 'answers', 'attribution', 'website'];
    if (Object.keys(input).some((key) => !allowedKeys.includes(key))) return response({ error: 'Invalid application' }, 400, origin);
    if (typeof input.website !== 'string' || input.website.length !== 0) return response({ error: 'Invalid application' }, 400, origin);
    const formId = legacy ? DEFAULT_FORM_ID : input.form_id;
    const revision = legacy ? 1 : input.form_revision;
    if (typeof formId !== 'string' || formId.length < 1 || formId.length > 100 || !Number.isInteger(revision) || (revision as number) < 1) return response({ error: 'Invalid application' }, 400, origin);
    if (typeof input.submission_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submission_id)) return response({ error: 'Invalid application' }, 400, origin);

    let validated: ValidatedApplication;
    let attribution: ApplicationAttribution;
    let config: ApplicationFormConfig;
    try {
      config = await loadRevision(db, formId, revision as number);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'P0404') return response({ error: 'Applications are closed' }, 410, origin);
      return response({ error: 'Temporarily unavailable' }, 503, origin);
    }
    try {
      validated = validateApplicationAnswers(config, input.answers);
      attribution = validateApplicationAttribution(input.attribution);
    } catch {
      return response({ error: 'Invalid application' }, 400, origin);
    }

    const ip = clientIp(req);
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!ip || !serviceKey) return response({ error: 'Temporarily unavailable' }, 503, origin);
    const ipHash = await hashRateKey(serviceKey, 'ip', ip);
    const emailHash = await hashRateKey(serviceKey, 'email', validated.email);
    const lead = buildApplicationLead(validated, attribution as Record<string, string>);
    const { data, error } = await db.rpc('submit_mentorship_application', {
      p_form_id: formId,
      p_submission_id: input.submission_id,
      p_lead: lead,
      p_answers: validated.answers,
      p_attribution: attribution,
      p_ip_hash: ipHash,
      p_email_hash: emailHash,
      p_form_revision: revision,
    });
    if (error) {
      if (error.code === 'P0408') return response({ error: 'Please try again later' }, 429, origin);
      if (error.code === 'P0404') return response({ error: 'Applications are closed' }, 410, origin);
      if (error.code === '22000') return response({ error: 'This submission could not be accepted' }, 409, origin);
      return response({ error: 'Temporarily unavailable' }, 503, origin);
    }
    if (!data?.success || data?.submission_id !== input.submission_id) return response({ error: 'Temporarily unavailable' }, 503, origin);
    return response({ success: true, submission_id: input.submission_id }, 200, origin);
  } catch {
    return response({ error: 'Temporarily unavailable' }, 503, origin);
  }
});
