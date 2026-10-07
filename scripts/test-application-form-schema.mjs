import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const js=ts.transpileModule(readFileSync('supabase/functions/_shared/applicationFormSchema.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {
  BASE_APPLICATION_FORM_CONFIG,
  validateFormConfig,
  validateApplicationAnswers,
  validateApplicationAttribution,
  buildApplicationLead,
}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

const config=validateFormConfig(BASE_APPLICATION_FORM_CONFIG);
assert.equal(config.questions.length,10);
assert.deepEqual(config.identity.details,['6 weeks','12 places','$2,497 USD']);
assert.equal(config.questions[0].title,"What's your name?");
assert.equal(config.completion.title,'THANKS FOR TELLING ME ABOUT YOUR MUSIC.');
const answers={name:'Test Applicant',email:' TEST@example.com ',social:'@test',music:'My tracks: https://soundcloud.com/test and https://open.spotify.com/artist/123.',experience:'1–3 years',goal:'Full-time career',struggles:'Finishing tracks',income:'$0',investment:"Yes, I'm ready",source:'Instagram'};
const valid=validateApplicationAnswers(config,answers);
assert.equal(valid.email,'test@example.com');
assert.equal(valid.lead.music_url,'https://soundcloud.com/test');
assert.equal(valid.storedAnswers[0].question,"What's your name?");
assert.deepEqual(Object.keys(valid.storedAnswers[0]).sort(),['answer','key','question']);
assert.equal(valid.lead.application_url,null);
assert.throws(()=>validateApplicationAnswers(config,{...answers,name:''}));
assert.throws(()=>validateApplicationAnswers(config,{...answers,email:'bad'}));
assert.throws(()=>validateApplicationAnswers(config,{...answers,source:'Not a source choice'}));
assert.throws(()=>validateApplicationAnswers(config,{...answers,extra:'no'}));
assert.throws(()=>validateApplicationAnswers(config,{...answers,music:'http://soundcloud.com/test'}));
assert.throws(()=>validateApplicationAnswers(config,{...answers,music:'https://user:secret@example.com/test'}));
assert.deepEqual(validateApplicationAttribution(undefined),{});
assert.throws(()=>validateApplicationAttribution({referrer:'x'.repeat(201)}));
assert.throws(()=>validateApplicationAttribution({secret:'no'}));
assert.equal(buildApplicationLead(valid,{utm_source:'instagram'}).source_detail,'utm_source=instagram');

const custom=structuredClone(config);
custom.questions.push({key:'q_123e4567-e89b-42d3-a456-426614174000',title:'Anything else?',description:'Optional context.',placeholder:'Write a note',section:'Wrap up',type:'textarea',required:false,maxLength:300});
custom.questions.push({key:'q_123e4567-e89b-42d3-a456-426614174001',title:'Optional contact email',description:'',placeholder:'',section:'About you',type:'email',required:false,maxLength:254});
const customAnswers=validateApplicationAnswers(custom,{...answers,'q_123e4567-e89b-42d3-a456-426614174000':'More detail'});
assert.equal(customAnswers.storedAnswers.find(answer=>answer.key==='q_123e4567-e89b-42d3-a456-426614174000').question,'Anything else?');
assert.equal(customAnswers.answers['q_123e4567-e89b-42d3-a456-426614174001'],'');
assert.throws(()=>validateFormConfig({...config,questions:config.questions.filter(q=>q.key!=='email')}));
assert.throws(()=>validateFormConfig({...config,questions:[...config.questions,{...config.questions[0]}]}));
assert.throws(()=>validateFormConfig({...config,questions:config.questions.map(q=>q.key==='name'?{...q,required:false}:q)}));
assert.throws(()=>validateFormConfig({...config,questions:config.questions.map(q=>q.key==='email'?{...q,type:'text'}:q)}));
assert.throws(()=>validateFormConfig({...config,questions:config.questions.map(q=>q.key==='experience'?{...q,options:Array.from({length:21},(_,i)=>`Option ${i}`)}:q)}));
console.log('Application form schema passed: seeded copy, fixed identity fields, custom questions, answer snapshots, choices, links, attribution bounds and malformed-config rejection.');
