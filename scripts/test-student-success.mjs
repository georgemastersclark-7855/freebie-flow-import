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
