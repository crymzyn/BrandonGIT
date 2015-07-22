var ssl_sys_id;
var ssl_process;
//make call to find SSLs that are due to expire
var ssl = new GlideRecord('u_ssl');
ssl.addQuery('u_expiration_date','STARTSWITH','2015-02-19');
ssl.addQuery('manufacturer','CONTAINS','Digicert');
ssl.query();

//gather relationships, we must have a server parent and URL child
while (ssl.next()) {
	//reset variables
	ssl_sys_id = ssl.sys_id;
	gs.log(ssl.name + ' sys_id:' + ssl_sys_id);
	ssl_process = true;

	//critera processing - make sure parent is server, get IP from website by name
	var relC = new GlideRecord('u_ssl_linked_assets');
	relC.addQuery('sslci_sys_id',ssl_sys_id);
	relC.addQuery('relci_child',ssl_sys_id)
	relC.query();

	if (relC.getRowCount() >= 1) {
		gs.log(ssl.name + ' Success: Parent CI(s) Present');
		while (relC.next()) {
			var relCIType1 = new GlideRecord('cmdb_ci');
			relCIType1.addQuery('sys_id',relC.relci_parent);
			relCIType1.query();

			if (relCIType1.next()) { 
				if (relCIType1.sys_class_name == 'cmdb_ci_win_server') {
					gs.log(ssl.name + ' Success: WINDOWS SERVER FOUND');
					//now check to see if it is Windows 2008 or higher
					//code here
				}		
			}
		}
	}
	else {
		gs.log(ssl.name + ' Error: Parent CI Missing or NOT a Windows Server')
		ssl_process = false;
	}

	//criteria processing - make sure child is URL, get IP from website by name
	var relP = new GlideRecord('u_ssl_linked_assets');
	relP.addQuery('sslci_sys_id',ssl_sys_id);
	relP.addQuery('relci_parent',ssl_sys_id)
	relP.query();

	if (relP.getRowCount() >= 1) {
		gs.log(ssl.name + ' Success: Child CI(s) Present');
		while (relP.next()) {
			var relCIType = new GlideRecord('cmdb_ci');
			relCIType.addQuery('sys_id',relP.relci_child);
			relCIType.query();

			if (relCIType.next()) { 
				if (relCIType.sys_class_name == 'u_url') {
					gs.log(ssl.name + ' Success: URL FOUND');
					//now get website IP
					//code here
				}		
			}
		}
	}
	else {
		gs.log(ssl.name + ' Error: Child CI Missing or NOT a URL')
		ssl_process = false;
	}

if (ssl_process == true) {
	gs.log(ssl.name + ' WINNA WINNA CHIKN DINNA')
}
}