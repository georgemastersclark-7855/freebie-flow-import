import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const js=ts.transpileModule(readFileSync('supabase/functions/_shared/mentorshipApplication.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {APPLICATION_FIELDS,parseMentorshipApplication,validateApplicationAnswers}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const payload={
  form_version:'cohort-2-v1',
  submission_id:'c0a80123-4567-489a-8abc-1234567890ab',
  answers:{name:'  Test Applicant  ',email:' TEST@example.com ',social:'@test',music:'A couple of tracks for you: https://soundcloud.com/test and https://open.spotify.com/artist/123.',experience:'1–3 years',goal:'Full-time career',struggles:'Finishing tracks',income:'$0',investment:"Yes, I'm ready",source:'Instagram'},
  attribution:{utm_source:'instagram',utm_medium:'social',utm_campaign:'cohort-2',utm_content:'post-1',utm_term:'',referrer:'https://audio.roblate.com/mentorship'},
  website:'',
};
assert.equal(APPLICATION_FIELDS.length,10);
assert.deepEqual(Object.keys(APPLICATION_FIELDS[0]).sort(),['key','maxLength','required','title','type']);
const parsed=parseMentorshipApplication(payload);
assert.equal(parsed.email,'test@example.com');
assert.equal(parsed.lead.full_name,'Test Applicant');
assert.equal(parsed.lead.stage,'applied');
assert.equal(parsed.lead.source,'Instagram');
assert.equal(parsed.lead.music_url,'https://soundcloud.com/test');
assert.equal(parsed.lead.application_url,null);
assert.equal(parsed.answers.length,10);
assert.equal(parsed.answers[8].question,'The six-week mentorship is $2,497 USD. Are you ready to invest?');
assert.equal(parsed.answers[8].title,undefined);
assert.equal(parsed.attribution.utm_campaign,'cohort-2');
assert.throws(()=>parseMentorshipApplication({...payload,form_version:'old'}));
assert.throws(()=>parseMentorshipApplication({...payload,submission_id:'bad'}));
assert.throws(()=>parseMentorshipApplication({...payload,website:'spam'}));
assert.throws(()=>parseMentorshipApplication({...payload,answers:{...payload.answers,stage:'approved'}}));
assert.throws(()=>validateApplicationAnswers({...payload.answers,investment:'Yes'}));
assert.throws(()=>validateApplicationAnswers({...payload.answers,email:'bad'}));
assert.throws(()=>validateApplicationAnswers({...payload.answers,music:'https://user:pass@example.com/audio'}));
assert.throws(()=>validateApplicationAnswers({...payload.answers,music:'http://soundcloud.com/test'}));
assert.throws(()=>parseMentorshipApplication({...payload,attribution:{...payload.attribution,secret:'no'}}));
assert.throws(()=>parseMentorshipApplication({...payload,attribution:{...payload.attribution,referrer:'javascript:alert(1)'}}));
assert.throws(()=>parseMentorshipApplication({...payload,attribution:{...payload.attribution,referrer:'x'.repeat(201)}}));
console.log('Native application parser passed: shared field contract, normalization, required fields, choices, links, honeypot and bounded attribution.');
