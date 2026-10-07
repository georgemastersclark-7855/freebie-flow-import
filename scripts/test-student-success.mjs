import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const js = ts.transpileModule(readFileSync('src/mentorship/studentSuccess.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { studentProgress, audioOptions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const student = { id:'a', status:'active' };
const data = {
  weeks:[{id:'w1',week_number:1,deadline_at:'2026-10-01T20:00:00Z'},{id:'w2',week_number:2,deadline_at:'2026-10-08T20:00:00Z'},{id:'w3',week_number:3,deadline_at:null}],
  submissions:[{id:'s1',enrollment_id:'a',week_id:'w1',submitted_at:'2026-10-01T18:00:00Z',updated_at:'2026-10-01T18:00:00Z'},{id:'s2',enrollment_id:'a',week_id:'w2',submitted_at:null,updated_at:'2026-10-06T18:00:00Z'},{id:'foreign',enrollment_id:'b',week_id:'w1',submitted_at:'2026-10-01T18:00:00Z'}],
  files:[{id:'f2',submission_id:'s2',kind:'song',uploaded_at:'2026-10-06'},{id:'f1',submission_id:'s1',kind:'idea',uploaded_at:'2026-10-01'},{id:'zip',submission_id:'s1',kind:'stems',uploaded_at:'2026-10-01'}],
  feedback:[{submission_id:'s1',status:'draft'}],
  surgeries:[{submission_id:'s1',delivered_at:null},{submission_id:'s2',delivered_at:'2026-10-07'}],
  actions:[{enrollment_id:'a',completed_at:null},{enrollment_id:'b',completed_at:null},{enrollment_id:'a',completed_at:'2026-10-06'}],
};
const p = studentProgress(data,student,new Date('2026-10-07T12:00:00Z'));
assert.equal(p.submitted,1); assert.equal(p.reviews,1); assert.equal(p.starters,1); assert.equal(p.surgeries,1); assert.equal(p.actions.length,1); assert.deepEqual(p.missingWeeks,[]);
assert.deepEqual(studentProgress(data,student,new Date('2026-10-09')).missingWeeks.map(w=>w.id),['w2']);
assert.equal(studentProgress(data,{...student,status:'completed'},new Date('2026-10-09')).missingWeeks.length,0);
assert.equal(studentProgress({...data,feedback:[{submission_id:'s1',status:'published'}]},student).reviews,0);
assert.deepEqual(audioOptions(data).map(f=>f.id),['f1','f2']);
assert.equal(studentProgress({...data,weeks:[],submissions:[],actions:[],files:[],surgeries:[]},student).needsAttention,false);
console.log('Student progress: cohort/student isolation, deadlines, review state, completed surgeries, follow-ups and comparison ordering passed.');

// Regression: historical/published work must open independently of the current
// week's queue, while another staff account's walkthrough remains unavailable.
const tables = {
  mentorship_cohorts:[{id:'cohort',current_week:1}],
  mentorship_enrollments:[{id:'enrollment',cohort_id:'cohort',user_id:'student',status:'active',is_walkthrough:false}],
  mentorship_profiles:[{user_id:'student',full_name:'Producer',email:'producer@example.com'}],
  mentorship_weeks:[{id:'oldweek',week_number:6,cohort_id:'cohort'}],
  mentorship_submissions:[{id:'oldsubmission',enrollment_id:'enrollment',week_id:'oldweek',state:'submitted',submitted_at:'2026-08-01T18:00:00Z'}],
  mentorship_submission_files:[{id:'song',submission_id:'oldsubmission',kind:'song',file_name:'Week 6.wav',storage_path:'student/old/song.wav',size_bytes:100,uploaded_at:'2026-08-01'}],
  mentorship_feedback:[{id:'feedback',submission_id:'oldsubmission',status:'published',written_notes:'Keep the chorus hook.',next_action:'Tighten the verse.',audio_storage_path:null}],
  mentorship_student_actions:[],mentorship_surgeries:[],
};
const mockDb = {
  auth:{getUser:async()=>({data:{user:{id:'staff'}}})},
  storage:{from:()=>({createSignedUrl:async path=>({data:{signedUrl:`https://test.invalid/${path}`}})})},
  from(name) {
    let found = [...(tables[name] ?? [])];
    return {
      select(){return this;},
      eq(key,value){found=found.filter(row=>row[key]===value);return this;},
      in(key,values){found=found.filter(row=>values.includes(row[key]));return this;},
      or(){found=found.filter(row=>!row.is_walkthrough||row.user_id==='staff');return this;},
      order(){return this;},
      range(start,end){return Promise.resolve({data:found.slice(start,end+1),error:null});},
    };
  },
};
globalThis.__successTestDb=mockDb;
const planJs = ts.transpileModule(readFileSync('src/mentorship/onboardingPlan.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
globalThis.__successOnboarding=await import(`data:text/javascript;base64,${Buffer.from(planJs).toString('base64')}`);
const apiJs = ts.transpileModule(readFileSync('src/mentorship/studentSuccessApi.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  .replace(/import \{ supabase \} from [^;]+;/, 'const supabase = globalThis.__successTestDb;')
  .replace(/import \{ onboardingNoteBody \} from [^;]+;/, 'const { onboardingNoteBody } = globalThis.__successOnboarding;')
  .replace(/import \{ loadStudentProfilesForEnrollments \} from [^;]+;/, 'const loadStudentProfilesForEnrollments = async () => new Map();');
const api = await import(`data:text/javascript;base64,${Buffer.from(apiJs).toString('base64')}`);
const review=await api.loadSuccessReview('oldsubmission');
assert.equal(review.weekNumber,6); assert.equal(review.status,'published'); assert.equal(review.enrollmentId,'enrollment'); assert.equal(review.feedback.writtenNotes,'Keep the chorus hook.'); assert.equal(review.song.storagePath,'student/old/song.wav');
tables.mentorship_enrollments[0].is_walkthrough=true;
await assert.rejects(api.loadSuccessReview('oldsubmission'),/not available to your account/);
tables.mentorship_submissions[0].submitted_at=null;
await assert.rejects(api.loadSuccessReview('oldsubmission'),/not been sent for review/);
assert.equal(api.safeSourceUrl('javascript:alert(1)'),undefined);
assert.equal(api.safeSourceUrl('https://user:password@example.com'),undefined);
delete globalThis.__successTestDb;
delete globalThis.__successOnboarding;
console.log('Historical review loading, published feedback, walkthrough isolation, draft rejection and recording-link validation passed.');
