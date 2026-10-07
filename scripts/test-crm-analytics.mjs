import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const compile=p=>ts.transpileModule(readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const url=js=>`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
const planUrl=url(compile('src/mentorship/onboardingPlan.ts'));
const crmUrl=url(compile('src/mentorship/crm.ts').replace("'./onboardingPlan'",JSON.stringify(planUrl)));
const {blankLead}=await import(crmUrl);
const {parseMoney,cashByCurrency,hasPaid,launchAnalytics}=await import(url(compile('src/mentorship/crmAnalytics.ts').replace("'./crm'",JSON.stringify(crmUrl))));
const lead=(id,stage='waitlist')=>({...blankLead('cohort'),id,email:`${id}@example.invalid`,full_name:id,stage,enrollment_id:null});
const receipt=(id,leadId,kind,amount,currency='USD',voided=false)=>({id,lead_id:leadId,kind,amount_minor:amount,currency,voided_at:voided?'2026-10-07':null});
assert.equal(parseMoney('2497'),249700);assert.equal(parseMoney('0.01'),1);assert.equal(parseMoney('832.33'),83233);
for(const value of ['','-1','2.555','1e3','12,00','0','Infinity'])assert.throws(()=>parseMoney(value));
let contacts=[lead('a'),lead('b','approved'),lead('c','offer_sent'),lead('d','closed')];
let events=[{lead_id:'b',milestone:'applied'},{lead_id:'b',milestone:'approved'},{lead_id:'c',milestone:'applied'},{lead_id:'c',milestone:'offer_sent'},{lead_id:'d',milestone:'applied'}];
let payments=[receipt('p1','c','payment',83233),receipt('p2','c','payment',83233),receipt('r1','c','refund',10000),receipt('p3','d','payment',10000),receipt('r2','d','refund',10000),receipt('p4','a','payment',9000,'GBP'),receipt('void','a','payment',100000,'USD',true)];
let result=launchAnalytics(contacts,events,payments,[]);
assert.equal(result.steps.find(s=>s.key==='applied').count,3);
assert.equal(result.steps.find(s=>s.key==='approved').rate,1/3);
assert.equal(result.steps.find(s=>s.key==='offer_sent').rate,0); // a direct offer must not fabricate approval
assert.equal(result.steps.find(s=>s.key==='offer_sent').skipped,1);
assert.equal(result.ids.paid.size,3); // instalments count once; refunded buyer stays in historical conversion
assert.equal(result.confirmed.length,2); // fully refunded/closed contact does not fill a seat
assert.equal(result.totals.USD.net,156466);
assert.equal(result.totals.GBP.net,9000); // currencies never mixed
assert.equal(result.sources.reduce((sum,s)=>sum+s.leads,0),4);
assert.equal(launchAnalytics([],[],[],[]).leadToPaid,null);
assert.equal(launchAnalytics([lead('a')],[],[],[]).steps.find(s=>s.key==='approved').rate,null);
assert.equal(launchAnalytics([lead('a')],[],[],[]).steps.find(s=>s.key==='applied').rate,0);
contacts=[{...lead('legacy'),payment_status:'confirmed'}];
assert.equal(launchAnalytics(contacts,[],[],[]).unknownAmounts,1);
assert.equal(launchAnalytics(contacts,[],[],[]).confirmed.length,1);
assert.deepEqual(cashByCurrency([]),{}); // old confirmation never invents a cash amount
assert.equal(hasPaid(contacts[0],[receipt('x','legacy','payment',100),receipt('y','legacy','refund',100)]),false);
console.log('Launch analytics passed: exact money, cumulative evidence, closed leads, skipped stages, rates, instalments, refunds, currency separation and missing cash amounts.');
