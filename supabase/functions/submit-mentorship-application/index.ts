import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MENTORSHIP_APPLICATION_FORM_ID, parseMentorshipApplication, type ParsedMentorshipApplication } from '../_shared/mentorshipApplication.ts';

const allowedOrigins = new Set([
  'https://audio.roblate.com',
  'https://freebie-finder-friend.lovable.app',
]);
const MAX_BODY_BYTES = 16_000;

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
  } catch {
    return false;
  }
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
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (!originAllowed(origin)) return response({ error: 'Origin not allowed' }, 403, null);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405, origin);
  const length = Number(req.headers.get('content-length') ?? 0);
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) return response({ error: 'Payload too large' }, 413, origin);
  try {
    const raw = await readLimitedBody(req);
    if (raw === null) return response({ error: 'Payload too large' }, 413, origin);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return response({ error: 'Invalid application' }, 400, origin); }
    let application: ParsedMentorshipApplication;
    try { application = parseMentorshipApplication(body); } catch { return response({ error: 'Invalid application' }, 400, origin); }
    const ip = clientIp(req);
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!ip || !supabaseUrl || !serviceKey) return response({ error: 'Temporarily unavailable' }, 503, origin);
    const ipHash = await hashRateKey(serviceKey, 'ip', ip);
    const emailHash = await hashRateKey(serviceKey, 'email', application.email);
    const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await db.rpc('submit_mentorship_application', {
      p_form_id: MENTORSHIP_APPLICATION_FORM_ID,
      p_submission_id: application.submission_id,
      p_lead: application.lead,
      p_answers: application.answers,
      p_attribution: application.attribution,
      p_ip_hash: ipHash,
      p_email_hash: emailHash,
    });
    if (error) {
      if (error.code === 'P0408') return response({ error: 'Please try again later' }, 429, origin);
      if (error.code === 'P0404') return response({ error: 'Applications are closed' }, 410, origin);
      if (error.code === '22000') return response({ error: 'This submission could not be accepted' }, 409, origin);
      return response({ error: 'Temporarily unavailable' }, 503, origin);
    }
    if (!data?.success || data?.submission_id !== application.submission_id) return response({ error: 'Temporarily unavailable' }, 503, origin);
    return response({ success: true, submission_id: application.submission_id }, 200, origin);
  } catch {
    return response({ error: 'Temporarily unavailable' }, 503, origin);
  }
});
