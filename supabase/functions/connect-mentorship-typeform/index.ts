import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {mapTypeformFields} from '../_shared/mentorshipTypeform.ts';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  const url=Deno.env.get('SUPABASE_URL')!;
  const db=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');
  if(!token)return json({error:'Sign in as an administrator.'},401);
  const {data:auth,error:authError}=await db.auth.getUser(token);
  if(authError||!auth.user)return json({error:'Sign in as an administrator.'},401);
  const {data:profile}=await db.from('mentorship_profiles').select('role').eq('user_id',auth.user.id).maybeSingle();
  if(profile?.role!=='admin')return json({error:'Administrator access required.'},403);
  try {
    const {form_id,api_key,cohort_id}=await req.json();
    if(typeof form_id!=='string'||!/^[-\w]{4,100}$/.test(form_id)||typeof api_key!=='string'||api_key.length<20||typeof cohort_id!=='string')return json({error:'Enter the form ID, cohort and Typeform token.'},400);
    const headers={Authorization:`Bearer ${api_key}`,'Content-Type':'application/json'};
    const formResponse=await fetch(`https://api.typeform.com/forms/${form_id}`,{headers,signal:AbortSignal.timeout(15000)});
    if(!formResponse.ok)return json({error:'Typeform could not read this form. Check the form ID and token’s forms:read permission.'},400);
    const form=await formResponse.json();
    const fieldMap=mapTypeformFields(form.fields??[]);
    const {data:route,error}=await db.rpc('prepare_mentorship_typeform',{p_form_id:form_id,p_cohort_id:cohort_id,p_form_title:form.title??form_id,p_field_map:fieldMap});
    if(error)return json({error:'Could not prepare this connection. Check that the cohort is open and this form is not connected to another cohort.'},409);
    const webhookUrl=`${url}/functions/v1/mentorship-typeform-webhook`;
    const hookPath=`https://api.typeform.com/forms/${form_id}/webhooks/rob-late-mentorship-crm`;
    const registered=await fetch(hookPath,{method:'PUT',headers,body:JSON.stringify({url:webhookUrl,enabled:true,secret:route.secret,event_types:{form_response:true,form_response_partial:false}}),signal:AbortSignal.timeout(15000)});
    if(!registered.ok)return json({error:'Typeform could not save the webhook. Check the token’s webhooks:write permission, then retry.'},400);
    const confirmed=await fetch(hookPath,{headers,signal:AbortSignal.timeout(15000)});
    const hook=confirmed.ok?await confirmed.json():null;
    if(!hook?.enabled||hook.url!==webhookUrl||hook.event_types?.form_response!==true||hook.event_types?.form_response_partial===true)return json({error:'Could not verify the webhook. Check webhooks:read permission, then retry.'},502);
    const connectedAt=new Date().toISOString();
    const {error:routeError}=await db.from('mentorship_typeform_routes').update({enabled:true,connected_at:connectedAt}).eq('form_id',form_id).eq('cohort_id',cohort_id);
    if(routeError)throw new Error('save');
    const {error:connectionError}=await db.from('mentorship_intake_connections').upsert({cohort_id,provider:'typeform',status:'connected',account_label:form.title??form_id,last_checked_at:connectedAt,detail:'New completed applications sync automatically. Existing applications remain in Typeform.'},{onConflict:'cohort_id,provider'});
    if(connectionError)throw new Error('save');
    return json({ok:true,form_title:form.title,connected_at:connectedAt});
  } catch(error) {
    if(error instanceof Error&&error.message==='The application needs exactly one email question to match CRM contacts.')return json({error:error.message},400);
    // Provider responses, request bodies and credentials must never enter logs.
    return json({error:'The connection could not finish. Please retry; existing applications are unchanged.'},500);
  }
});
