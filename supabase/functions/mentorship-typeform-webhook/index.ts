import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {parseTypeform,verifyTypeformSignature} from '../_shared/mentorshipTypeform.ts';
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
Deno.serve(async req=>{
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  if(Number(req.headers.get('content-length')??0)>1000000)return json({error:'Payload too large'},413);
  try{
    const raw=await req.text();
    if(new TextEncoder().encode(raw).length>1000000)return json({error:'Payload too large'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'Invalid JSON'},400);}
    const formId=body?.form_response?.form_id;
    if(typeof formId!=='string'||!/^[-\w]{4,100}$/.test(formId))return json({error:'Invalid form'},400);
    const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:route,error}=await db.rpc('get_mentorship_typeform_route',{p_form_id:formId});
    if(error)return json({error:'Temporarily unavailable'},503);
    if(!route||!await verifyTypeformSignature(raw,req.headers.get('typeform-signature'),route.secret))return json({error:'Invalid signature'},401);
    if(!route.enabled)return json({error:'Connection is not ready'},503);
    let application;try{application=parseTypeform(body,route.field_map);}catch{return json({error:'Invalid application'},400);}
    if(!application)return json({ignored:'unsupported_event'});
    const {data:result,error:ingestError}=await db.rpc('ingest_mentorship_typeform',{p_form_id:formId,p_response_id:application.response_id,p_submitted_at:application.submitted_at,p_lead:application.lead,p_answers:application.answers,p_summary:application.summary});
    if(ingestError)return json({error:'Application could not be saved; retry delivery'},503);
    return json({ok:true,duplicate:Boolean(result?.duplicate),ignored:result?.ignored});
  }catch{return json({error:'Temporarily unavailable'},503);}
});
