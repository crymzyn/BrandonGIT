//build change for SSL renewal
var chg = new GlideRecord('change_request');
chg.initialize();
chg.type = 'Non-Standard';
chg.approval = 'requested';
chg.u_sub_type = 'Server Equipment/Software';
chg.requested_by = workflow.scratchpad.ssl_contact; 
chg.assigned_to = '13294f3800f9e400ba87f47595a1d13e'; //Terry Caldwell
chg.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
chg.impact = 2;
chg.urgency = 3;
chg.risk = 3;
chg.cmdb_ci = workflow.scratchpad.ssl_sysid; 
chg.short_description = 'SSL Renewal - ' + workflow.scratchpad.ssl_name;
chg.description = 'Cert location: D:\\Ops_Temp\\certs\\\n' + 
'Import cert into the personal store\n' + 
'Associate new cert to site\n' + 
'Delete expiring certificate from the personal store\n' + 
'Update Config with new expiration date\n' + 
'' + current.number;
chg.u_was_testing_performed = 'No';
chg.u_reason_for_no_testing = 'Testing Not Applicable';
chg.u_describe_why_no_testing = 'Standard Change';
chg.u_verification_plan = 'Verify the site responds with new cert';
chg.backout_plan = 'Reapply original certificate and notify WSO SSL group.';
chg.start_date = '2015-03-15 00:00:00';
chg.end_date = '2015-03-15 06:00:00';
var sys_id = chg.insert();

//log URL for change
workflow.info('CHANGE URL: https://maritzdev.service-now.com/nav_to.do?uri=change_request.do?sys_id=' + sys_id);

//get related url
var url_sys_id;
var links = new GlideRecord('u_ssl_linked_assets');
links.addQuery('sslci_sys_id',workflow.scratchpad.ssl_sysid);
links.addQuery('relci_parent',workflow.scratchpad.ssl_sysid); 
links.query();

if (links.next()) {
	url_sys_id = links.relci_child.sys_id;
	workflow.info('URL Relationship: ' + url_sys_id);
}

//get url relationships
var rels = [];
rels.push(url_sys_id);
var url_rel = new GlideRecord('cmdb_rel_ci');
url_rel.addQuery('child.sys_id',url_sys_id);
url_rel.addQuery('parent.sys_class_name','cmdb_ci_web_site');
url_rel.query();

while (url_rel.next()) {
	//feed website sys_id
	var web_sys_id = url_rel.parent.sys_id;
	rels.push(web_sys_id); 
	workflow.info('Website Relationship: ' + url_rel.sys_id);
	
	//get website relationships
	var web_rel = new GlideRecord('cmdb_rel_ci');
	web_rel.addQuery('child.sys_id',web_sys_id);
	var oc = web_rel.addQuery('parent.sys_class_name','cmdb_ci_server');
	oc.addOrCondition('parent.sys_class_name','cmdb_ci_netgear');
	oc.addOrCondition('parent.sys_class_name','cmdb_ci_win_server');
	web_rel.query();

	while (web_rel.next()) {
		//feed server or network gear sys_id
		var svr_sys_id = web_rel.parent.sys_id;
		rels.push(svr_sys_id); 
		workflow.info('Server/Network Gear Relationship: ' + web_rel.sys_id);
	}
}

for (var i = 0;i<rels.length;i++) {
	//relate CIs 
	var task = new GlideRecord('task_ci');
	task.initialize();
	task.ci_item = rels[i];
	task.task = sys_id;
	var ci_rel_sys_id = task.insert();
	workflow.info('Task CI: ' + ci_rel_sys_id);
}

//look up record and set approval to requested
var cr = new GlideRecord('change_request');
cr.addQuery('sys_id',sys_id);
cr.query();

if (cr.next()) {
	cr.approval = 'requested';
	cr.update();
	gs.flushMessages();
}