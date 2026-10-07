import { supabase } from '@/integrations/supabase/client';
import type { ApplicationFormConfig } from '../../supabase/functions/_shared/applicationFormSchema';
export type ApplicationFormRecord={id:string;name:string;slug:string;cohort_id:string;draft_config:ApplicationFormConfig;draft_version:number;published_revision:number|null;is_open:boolean;created_at:string;updated_at:string;published_draft_version?:number|null};
type Result<T>={data:T|null;error:{message:string}|null};
const db=supabase as unknown as {
  from:(table:string)=>{select:(columns:string)=>{order:(column:string,options:{ascending:boolean})=>Promise<Result<ApplicationFormRecord[]>>}};
  rpc:(name:string,args:Record<string,unknown>)=>Promise<Result<ApplicationFormRecord>>;
};
async function result(promise:Promise<Result<ApplicationFormRecord>>) {const {data,error}=await promise;if(error)throw new Error(error.message);if(!data)throw new Error('The form could not be saved.');return data;}
export async function loadApplicationForms(){const {data,error}=await db.from('mentorship_application_forms').select('*').order('created_at',{ascending:false});if(error)throw new Error(error.message);return data??[];}
export function createApplicationForm(name:string,slug:string,cohortId:string,config:ApplicationFormConfig){return result(db.rpc('create_mentorship_application_form',{p_name:name,p_slug:slug,p_cohort_id:cohortId,p_config:config}));}
export function saveApplicationForm(form:ApplicationFormRecord,name:string,config:ApplicationFormConfig){return result(db.rpc('save_mentorship_application_form',{p_form_id:form.id,p_expected_version:form.draft_version,p_name:name,p_config:config}));}
export function publishApplicationForm(form:ApplicationFormRecord){return result(db.rpc('publish_mentorship_application_form',{p_form_id:form.id,p_expected_version:form.draft_version}));}
export function setApplicationFormOpen(form:ApplicationFormRecord,open:boolean){return result(db.rpc('set_mentorship_application_form_open',{p_form_id:form.id,p_open:open}));}
export const applicationPath=(form:Pick<ApplicationFormRecord,'id'|'slug'>)=>form.id==='cohort-2-v1'?'/mentorship/apply':'/mentorship/apply/'+form.slug;
