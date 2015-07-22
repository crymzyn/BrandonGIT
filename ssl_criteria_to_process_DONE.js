var ssl_sys_id;
var ssl_process;
var web_name;
//make call to find SSLs that are due to expire
var ssl = new GlideRecord('u_ssl_linked_assets');
ssl.addQuery('sslci_u_expiration_date','STARTSWITH','2015-02-19'); //expiration 90 days out
ssl.addQuery('sslci_u_type','Web Site'); //ssl type is Web Site
ssl.addQuery('sslci_manufacturer.name','CONTAINS','digicert'); //ssl manufacturer is Digicert
ssl.addQuery('relci_parent.sys_class_name','CONTAINS','cmdb_ci_win_server'); //only ssls that are related to win servers
ssl.addQuery('relci_parent.support_group.name','CONTAINS','Windows Server Ops Operations'); //only ssls that are supported by WinSvrOps
var status = ssl.addQuery('relci_parent.install_status','118'); //server In Use or Build/Rebuild
status.addOrQuery('relci_parent.install_status','116'); 
var par = ssl.addQuery('relci_parent.name','CONTAINS','web'); //only servers that have web/wap in their name
par.addOrQuery('relci_parent.name','CONTAINS','wap');
ssl.query();

//gather relationships, we must have a server parent and URL child
while (ssl.next()) {
	//reset variables
	ssl_sys_id = ssl.sslci_sys_id;
	gs.log(ssl.sslci_name + ' sys_id:' + ssl_sys_id);
	web_name = ssl.relci_child.name;
	ssl_process = true;

	//critera processing - ####### ONLY Windows 2008 and up #######
	var winserv = new GlideRecord('cmdb_ci_win_server');
	winserv.addQuery('sys_id',ssl.relci_parent);
	winserv.query();

	if (winserv.next()) {
		var os = winserv.u_d_operating_system;
		if (os != 'Windows 2003' && os != ''){
			//server OS is able to handle ssl automation
			gs.log('Success: Server OS = ' + os)
			//check for base IP
			var baseIP = winserv.ip_address;
			if (baseIP != '') {
				gs.log('Success: Server Base IP = ' + baseIP);
			}
			else {
				gs.log('Error: Server IP could not be found');
				ssl_process = false;
			}
		}
		else {
			gs.log('Error: Server OS is Windows 2003 or NULL');
			ssl_process = false;
		}
	}
	else {
		gs.log('Error: Server could not be found using sys_id');
		ssl_process = false;
	}

	//make sure we have an active website attached to URL
	var website = new GlideRecord('cmdb_ci_web_site');
	website.addQuery('name',web_name); //locate by URL
	website.addQuery('u_active',true);
	website.query();

		//make sure we have at least one website to work with
	if (website.getRowCount() >= 1) {
		gs.log('Success: Website(s) located for URL')
	}
	else {
		gs.log('Error: Website could not be found using URL');
		ssl_process = false;
	}

	if (ssl_process == true) {
		gs.log(ssl.sslci_name + ' WINNA WINNA CHIKN DINNA');
	}
	else {
		gs.log(ssl.sslci_name + ' LOSA LOSA CHIKN SNOOZA');
	}
}