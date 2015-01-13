//###### SSL Renewal Validation - Begin #####

//create variables for lookups
var sslSysID = workflow.scratchpad.ssl_sysid;
var sslName = workflow.scratchpad.ssl_name;
var contact = workflow.scratchpad.ssl_contact;
var expiration = workflow.scratchpad.ssl_expiration;
var ssl_process = true;
var ssl_process_msg = 'SSL renewal validation tracking for ' + sslName + ':';

//look up URL value from view
var url = new GlideRecord('u_ssl_linked_assets');
url.addQuery('sslci_sys_id',sslSysID); //find records with SSL sys_id
url.addQuery('relci_parent',sslSysID); //if it is the parent, then child should be URL
url.query();

while (url.next()) {
	
	//for each url, look up associated website records
	var website = new GlideRecord('u_website_linked_assets');
	website.addQuery('relci_child.sys_id',url.relci_child.sys_id); //URL are children of websites, match by child sys IDs
	website.addQuery('relci_parent.u_active',true); //make sure to only look up active websites
	website.query();
	
	//make sure we have at least one website to work with, if not fail automation
	if (website.getRowCount() >= 1) {
		
		//create vars to use in loops
		var baseIPValue;
		var bindIPValue;
		var portValue;
		
		//go ahead and look up website record(s)
		while (website.next()) {
			
			//set vars
			bindIPValue = website.websiteci_ip_address;
			portValue = '443';
			
			//success, we have located a website related to SSL
			workflow.info('SSL Renewal Validation: Website check - Success: Website(s) located for URL');
			
			//make call back to website linked assets to get servers, should be parents of website
			var webLink = new GlideRecord('u_website_linked_assets');
			webLink.addQuery('websiteci_sys_id',website.sys_id);
			webLink.addQuery('relci_parent.sys_class_name','CONTAINS','cmdb_ci_win_server'); //only entries that are related to win servers
			var status = webLink.addQuery('relci_parent.install_status','118'); //related server(s) In Use or Build/Rebuild
			status.addOrCondition('relci_parent.install_status','116');
			//var par = webLink.addQuery('relci_parent.name','CONTAINS','web'); //related server(s) has web/wap in name
			//par.addOrCondition('relci_parent.name','CONTAINS','wap');
			webLink.query();
			
			//check number of results, need at least 1 to proceed
			if (webLink.getRowCount() >= 1) {
				
				//gather relationships, we must have a server parent and URL child
				var servLoop = 0;
				while (webLink.next()) {
					
					if (servLoop == 0) {
						//create parse object
						var parse = {
							servers: []
						};
					}
					
					//critera processing - ####### ONLY Windows 2008 and up #######
					var winserv = new GlideRecord('cmdb_ci_win_server');
					winserv.addQuery('sys_id',webLink.relci_parent);
					winserv.query();
					
					if (winserv.next()) {
						var os = winserv.u_d_operating_system;
						if (os != 'Windows 2003' && os != ''){
							//server OS is able to handle ssl automation
							
							workflow.info('SSL Renewal Validation: Server OS check - Success: Server OS = ' + os);
							
							//set baseIPValue
							baseIPValue = winserv.ip_address;
							
							//check for base IP
							if (baseIPValue != '') {
								workflow.info('SSL Renewal Validation: IP check - Success: Base IP = ' + baseIPValue);
								
								//add server to parse object
								var addSvr = new SSLServer(baseIPValue,bindIPValue,portValue);
								parse.servers.push(addSvr);
								
								workflow.info('SSL Renewal Validation: Bind IP check - Success: Bind IP = ' + parse.servers[servLoop].bindIP);
								
								//success, we have server(s) to install SSL on
								workflow.info('SSL Renewal Validation: ' + url.sslci_name + ' meets second phase criteria for renewal automation, sys_id:' + sslSysID);
							}
							else {
								workflow.info('SSL Renewal Validation: IP check - Error: Server IP could not be found');
								ssl_process = false;
								ssl_process_msg += '\n - Server IP could not be found for ' + winserv.name + '.';
							}
							
							//reset baseIPValue
							baseIPValue = '';
						}
						else {
							workflow.info('SSL Renewal Validation: Server OS check - Error: Server OS is Windows 2003 or NULL');
							ssl_process = false;
							ssl_process_msg += '\n - Server OS check failed, ' + winserv.name + ' is not Windows 2008 or higher.';
						}
					}
					else {
						workflow.info('SSL Renewal Validation: Server OS check - Error: Server could not be found using sys_id');
						ssl_process = false;
						ssl_process_msg += '\n - Server could not be located using sys_id (' + webLink.relci_parent + ').';
					}
					servLoop = servLoop + 1;
				}
			}
			else {
				workflow.info('SSL Renewal Validation: Skipping SSL ' + sslName + ' - does not have valid related server(s).');
				ssl_process = false;
				ssl_process_msg += '\n - No valid related server(s) to install on.';
			}
		}
		
		//reset vars
		bindIPValue = '';
		portValue = '';
		
	}
	else {
		workflow.info('SSL Renewal Validation: Website check - Error: Website could not be found using URL');
		ssl_process = false;
		ssl_process_msg += '\n - Associated website not found using URL.';
	}
}

//if ssl_process has remained true throughout checks, proceed with automation
if (ssl_process == true) {
	workflow.info('SSL Renewal Validation Check: Passed...  SSL Details: \nsys_id = ' + sslSysID + '\nname = ' + sslName + '\ncontact = ' + contact + '\nexpiration = ' + expiration);
	
	workflow.scratchpad.ssl_pass = 'yes';
	
}
else {
	workflow.info('SSL Renewal Validation Check: Failed...  SSL Details: ' + sslName + ' - did not pass criteria checks');
	
	workflow.scratchpad.ssl_pass = 'no';
	
	workflow.scratchpad.ssl_troubleshooting = ssl_process_msg;
}

//##### SSL Renewal Validation - End #####

function SSLServer(baseIP, bindIP, port) {
	this.baseIP = baseIP;
	this.bindIP = bindIP;
	this.port = port;
}