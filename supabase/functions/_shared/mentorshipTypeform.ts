type Field = {id:string;type:string;title:string};
type Answer = {field:{id:string};type:string;text?:string;email?:string;url?:string;number?:number;boolean?:boolean;choice?:{label?:string;other?:string};choices?:{labels?:string[];other?:string}};
export type FieldMap = {email:string;name?:string;music?:string;goal?:string;struggles?:string;source?:string};

export function mapTypeformFields(fields: Field[]): FieldMap {
  const emails=fields.filter(f=>f.type==='email');
  if(emails.length!==1)throw new Error('The application needs exactly one email question to match CRM contacts.');
  const find=(pattern:RegExp)=>fields.find(f=>pattern.test(f.title))?.id;
  return {email:emails[0].id,name:find(/what.{0,4}s your name|full name/i),music:find(/music we can listen|music.*links/i),goal:find(/goal with music/i),struggles:find(/struggles.*holding/i),source:find(/how did you hear/i)};
}

export function answerText(answer?:Answer):string {
  if(!answer)return '';
  switch(answer.type){
    case 'email':return answer.email??'';
    case 'text':return answer.text??'';
    case 'url':return answer.url??'';
    case 'choice':return answer.choice?.label??answer.choice?.other??'';
    case 'choices':return [...(answer.choices?.labels??[]),...(answer.choices?.other?[answer.choices.other]:[])].join(', ');
    case 'number':return answer.number===undefined?'':String(answer.number);
    case 'boolean':return answer.boolean===undefined?'':answer.boolean?'Yes':'No';
    default:return '';
  }
}

export function parseTypeform(body:unknown,map:FieldMap,now=Date.now()) {
  const data=body as {event_type?:string;form_response?:{form_id:string;token:string;submitted_at:string;definition?:{fields:Field[]};answers:Answer[]}};
  if(data.event_type!=='form_response')return null;
  const response=data.form_response;
  if(!response||!Array.isArray(response.answers)||!response.token||response.token.length>180)throw new Error('Invalid completed application');
  const date=Date.parse(response.submitted_at);
  if(!Number.isFinite(date)||date>now+300000)throw new Error('Invalid application date');
  const get=(id?:string)=>answerText(response.answers.find(a=>a.field?.id===id)).trim();
  const email=get(map.email).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw new Error('A valid applicant email is required');
  const answers=response.answers.map(a=>({question:response.definition?.fields.find(f=>f.id===a.field?.id)?.title??a.field?.id??'Question',answer:answerText(a)}));
  if(JSON.stringify(answers).length>200000)throw new Error('Application answers are too long');
  const summary=('Typeform application received\n\n'+answers.map(a=>`${a.question}\n${a.answer}`).join('\n\n')).slice(0,5800);
  let music=get(map.music).match(/https:\/\/[^\s<>"]+/)?.[0]??null;
  if(music){try{const url=new URL(music);if(url.username||url.password||url.host.includes('%')||music.length>2048)music=null;}catch{music=null;}}
  return {form_id:response.form_id,response_id:response.token,submitted_at:new Date(date).toISOString(),answers,summary,
    lead:{email,full_name:(get(map.name)||email).slice(0,160),stage:'applied',source:(get(map.source)||'Not recorded').slice(0,100),source_detail:'Typeform application',
      application_url:`https://admin.typeform.com/form/${encodeURIComponent(response.form_id)}/results`,music_url:music,
      goals:[get(map.goal),get(map.struggles)].filter(Boolean).join('\n\n').slice(0,4000),next_action:'Review application',due_on:new Date(now).toISOString().slice(0,10)}};
}

export async function verifyTypeformSignature(raw:string,signature:string|null,secret:string):Promise<boolean> {
  if(!signature||!secret||!/^sha256=[A-Za-z0-9+/]{43}=$/.test(signature))return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const bytes=Uint8Array.from(atob(signature.slice(7)),c=>c.charCodeAt(0));
  return crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(raw));
}
