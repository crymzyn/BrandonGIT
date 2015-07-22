//set u_website_name field -- need to update biz rule, its not working
var setWebsiteName = new GlideRecord('cmdb_ci_web_site');
setWebsiteName.addQuery('sys_created_by','s_UCMDBDiscovery');
setWebsiteName.addNullQuery('u_website_name');
setWebsiteName.query();

while (setWebsiteName.next()) {

	var split = setWebsiteName.name.split(' ');
	var splitName = '' + split[0];
	var dotChk = splitName.indexOf('.');
	if (dotChk > -1) {

		setWebsiteName.u_website_name = splitName;
		setWebsiteName.update();
		gs.log('BSY --> Name set for ' + setWebsiteName.name);

	}
}

//set fields for Discovery
var webDisc = new GlideRecord('cmdb_ci_web_site');
webDisc.addQuery('sys_created_by','s_UCMDBDiscovery');
webDisc.addNotNullQuery('u_website_name')
webDisc.query();

while (webDisc.next()) {

	var webNew = new GlideRecord('cmdb_ci_web_site');
	webNew.addQuery('sys_created_by','!=','s_UCMDBDiscovery');
	webNew.addQuery('install_status',101);
	webNew.addQuery('name','CONTAINS',webDisc.u_website_name);
	webNew.addNullQuery('correlation_id');
	webNew.query();

	while (webNew.next()) {
		if (webNew.ip_address == webDisc.ip_address) {
			webNew.correlation_id = webDisc.correlation_id;
			webNew.web_server = webDisc.web_server;
			webNew.update();
			gs.log('BSY --> Discovery fields set for ' + webNew.name);
		}
		/*else {
			//needed for cleaning ONLY
			webNew.correlation_id = '';
			webNew.web_server = '';
			webNew.update();
			gs.log('BSY --> Cleaning fields for ' + webNew.name);
		}*/
	}
}

//delete junk CIs from initial Discovery
var cleanWebsiteCI = new GlideRecord('cmdb_ci_web_site');
cleanWebsiteCI.addQuery('sys_created_by','s_UCMDBDiscovery');
cleanWebsiteCI.query();

while (cleanWebsiteCI.next()) {

	cleanWebsiteCI.deleteRecord();
	gs.log('BSY --> deleting junk Discovery website = ' + cleanWebsiteCI.name);
}

//re-run discovery to link the correct records