begin;
select set_config('request.jwt.claims','{"sub":"e0858a96-9869-44c8-8a64-9ada37805919","role":"authenticated"}',true);
do $test$
declare l uuid; c uuid:='faa94fb4-dcf0-4d96-9369-d834c71fb0c2'; p public.mentorship_lead_payments; r public.mentorship_lead_payments;
begin
 insert into mentorship_leads(cohort_id,full_name,email,stage) values(c,'Launch reporting QA','launch-report-qa@example.invalid','applied') returning id into l;
 update mentorship_leads set stage='approved' where id=l;
 update mentorship_leads set stage='offer_sent' where id=l;
 update mentorship_leads set stage='closed' where id=l;
 if (select count(*) from mentorship_lead_milestones where lead_id=l)<>3 then raise exception 'Stage history lost'; end if;
 p:=record_mentorship_payment(l,'payment',83233,'USD',current_date,'stripe','launch-test-payment','Instalment 1');
 r:=record_mentorship_payment(l,'refund',10000,'USD',current_date,'stripe','launch-test-refund','Partial refund');
 if (select sum(case when kind='payment' then amount_minor else -amount_minor end) from mentorship_lead_payments where lead_id=l)<>73233 then raise exception 'Cash total wrong'; end if;
 begin
  perform record_mentorship_payment(l,'payment',83233,'USD',current_date,'stripe','launch-test-payment','Retry');
  raise exception 'Duplicate should fail';
 exception when unique_violation then null; end;
 begin
  perform record_mentorship_payment(l,'refund',100000,'USD',current_date,'stripe','launch-test-overrefund','');
  raise exception 'Over-refund should fail';
 exception when others then if sqlerrm='Over-refund should fail' then raise; end if; end;
 begin
  perform record_mentorship_payment(l,'refund',1,'GBP',current_date,'stripe','launch-test-other-currency','');
  raise exception 'Wrong currency refund should fail';
 exception when others then if sqlerrm='Wrong currency refund should fail' then raise; end if; end;
 begin
  perform record_mentorship_payment(l,'payment',0,'USD',current_date,'stripe','launch-test-zero','');
  raise exception 'Zero should fail';
 exception when check_violation then null; end;
 begin
  perform record_mentorship_payment(l,'payment',100,'USD',current_date+1,'stripe','launch-test-future','');
  raise exception 'Future should fail';
 exception when check_violation then null; end;
 begin
  perform void_mentorship_payment(p.id,'Wrong amount');
  raise exception 'Voiding funded refund should fail';
 exception when others then if sqlerrm='Voiding funded refund should fail' then raise; end if; end;
 perform void_mentorship_payment(r.id,'Wrong refund entry');
 perform void_mentorship_payment(p.id,'Wrong payment entry');
 if (select count(*) from mentorship_lead_payments where lead_id=l and voided_at is null)<>0 then raise exception 'Void failed'; end if;
 if (select count(*) from mentorship_lead_payments where lead_id=l)<>2 then raise exception 'Audit history deleted'; end if;
 perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
 begin
  perform record_mentorship_payment(l,'payment',100,'USD',current_date,'stripe','launch-test-unauthorised','');
  raise exception 'Nonstaff should fail';
 exception when insufficient_privilege then null; end;
 if has_table_privilege('authenticated','public.mentorship_lead_payments','insert') or has_table_privilege('authenticated','public.mentorship_lead_payments','update') or has_table_privilege('anon','public.mentorship_lead_payments','select') then raise exception 'Payment privileges too broad'; end if;
 if has_table_privilege('authenticated','public.mentorship_lead_milestones','insert') then raise exception 'Milestone evidence writable from browser'; end if;
end $test$;
rollback;
