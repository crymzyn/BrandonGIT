//build change for SSL renewal
var chg = new GlideRecord('change_request');
chg.initialize();
chg.type = 'Non-Standard';
chg.approval = 'requested';
chg.u_sub_type = 'Server Equipment/Software';
chg.requested_by = 'f528073800f9e400ba87f47595a1d127'; //Tonya's sys_id
chg.assigned_to = 'f528073800f9e400ba87f47595a1d127'; //Tonya's sys_id - should be switched to Terry's
chg.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
chg.impact = 2;
chg.urgency = 3;
chg.risk = 3;
chg.cmdb_ci = '54c2fb79e4c0300043df9ecc86a2eae1';
chg.short_description = 'testing script';
chg.description = 'testing script';
chg.u_was_testing_performed = 'No';
chg.u_reason_for_no_testing = 'Testing Not Applicable';
chg.u_describe_why_no_testing = 'Standard Change';
chg.u_verification_plan = 'Verify the site responds with new cert';
chg.backout_plan = 'Reapply original certificate and notify WSO';
chg.start_date = '2015-03-15 00:00:00';
chg.end_date = '2015-03-15 06:00:00';
var sys_id = chg.insert();

//log URL for change
gs.log('https://maritzdev.service-now.com/nav_to.do?uri=change_request.do?sys_id=' + sys_id);

//look up record and set approval to requested
var cr = new GlideRecord('change_request');
cr.addQuery('sys_id',sys_id);
cr.query();

if (cr.next()) {
cr.approval = 'requested';
cr.update();
}