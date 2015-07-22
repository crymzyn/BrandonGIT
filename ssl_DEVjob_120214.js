//get target date, 90 days from day of job execution
var godate = new GlideDateTime();
godate.addDays(90);

//var startdate = new GlideDateTime(godate.getDisplayValue());
var startdate = new GlideDateTime('2015-02-19 00:00:00');
gs.log('BSY --> Working date = ' + startdate.getDate());

//log beginning in SN logs
gs.log('BSY --> SSL renewal job initiated for SSL certificates expiring on \'' + startdate.getDate() + '\'');

//###### Maritz IT Centralized Logger - Begin ######

//get MID server by instance
//Determine if we are in dev, stage, or prod instan//Determine if we are in dev, stage, or prod instance
var instance = gs.getProperty('instance_name');
instance = instance.toString();

//according to instance, set mid server info
var instanceName = '';
var midServer = '';
switch(instance) {
	case 'maritzdev':
	//instance name
	instanceName = 'Service Now DEV';
	//MidServer for Web Service Calls
	midServer = 'FENWAPMGD04_Dev';
	break;
	case 'maritzstage':
	//instance name
	instanceName = 'Service Now STAGE';
	//MidServer for Web Service Calls
	midServer = 'FENAPPMGP07_Stg';
	break;
	case 'maritz':
	//instance name
	instanceName = 'Service Now PROD';
	//MidServer for Web Service Calls
	midServer = 'FENAPPMGP07_US';
	break;
	default:
	//DEFAULT TO PROD
	//instance name
	instanceName = 'Service Now PROD';
	//MidServer for Web Service Calls
	midServer = 'FENAPPMGP07_US';
}
gs.log('BSY --> midServer = ' + midServer + ' and instanceName = ' + instanceName);
//make SOAP call to logger
var s = new SOAPMessage('Centralized Logging', 'LoggerRelaySoap.Log');
s.setMIDServer(midServer);
s.setParameter('AppKey','7D1B49ED-3EB4-4DF2-851E-7313E73A1D61');
s.setParameter('AppName','SSLCertificates');
s.setParameter('ApiKey','257BAFE4-81E2-4B50-98A6-AC7A3B4C479D');
s.setParameter('MessageType','Notification');
s.setParameter('Message','SSL renewal job initiated for SSL certificates expiring on \'' + startdate.getDate() + '\'');
s.setParameter('LogSource',instanceName + ' - SSL Renewal');
s.setParameter('ComputerName','ServiceNow');
s.setParameter('sslName','Cloud');
s.setParameter('ScriptUserID','s_ServiceNowRB_US');
var postal = s.post();
gs.log('BSY --> soapmessage posted = ' + postal);

//since call is asynchronous, wait for a response for given seconds
var WaitForSeconds = 30;
var ElapsedSeconds = 1;
var response = s.getResponse();
while(response == null) {
	gs.log('BSY --> waiting ... ' + ElapsedSeconds + ' seconds');
	response = s.getResponse(1000);
	ElapsedSeconds++;
	
	if (ElapsedSeconds > WaitForSeconds ) {
		break; // service did not respond in time
	}
}

var response1 = s.getResponse();
var xmldoc = new XMLDocument(response1);
var output = xmldoc.getNodeText("//output");
gs.log('BSY --> XML Output from SOAP Call to Centralized Logger' + output);

//###### Maritz IT Centralized Logger - End ######

//###### SSL Renewal Execution - Begin #####

//create variables for lookups
var sslSysID;
var sslName;
var contact;
var expiration;
var web_name;
var ssl_process;

//start at SSL table to get distinct records, then look up relationships via view
var sslCI = new GlideRecord('u_ssl');
sslCI.addQuery('sys_id','932a8290f16f090cbdc4da9a55894443'); //testing specific SSL
sslCI.addQuery('u_expiration_date','STARTSWITH','2015-02-19'); //expiration 90 days out
sslCI.addQuery('name','DOES NOT CONTAIN','*.');
sslCI.addQuery('u_type','Web Site'); //ssl type is Web Site
sslCI.addQuery('u_owner','CONTAINS','maritz'); //Maritz owns ssl
sslCI.addQuery('manufacturer.name','CONTAINS','digicert'); //ssl manufacturer is Digicert
sslCI.query();

while (sslCI.next()) {
	
	//set variables for SSL
	sslSysID = sslCI.sys_id;
	sslName = sslCI.name;
	contact = sslCI.u_contact_name;
	expiration = sslCI.u_expiration_date;
	ssl_process = true;
	
	//look up URL value from view
	var url = new GlideRecord('u_ssl_linked_assets');
	url.addQuery('sslci_sys_id',sslSysID); //find records with SSL sys_id
	url.addQuery('relci_parent',sslSysID); //if it is the parent, then child should be URL
	url.query();
	
	if (url.next()) {
		web_name = url.name;
	}
	
	//make sure we have an active website attached to URL
	var website = new GlideRecord('cmdb_ci_web_site');
	website.addQuery('name',web_name); //locate by URL name
	website.addQuery('u_active',true); //make sure it is active
	website.query();
	
	//make sure we have at least one website to work with
	if (website.getRowCount() >= 1) {
		
		//create vars to use in loops
		var baseIPValue;
		var bindIPValue;
		var portValue;
		
		//go ahead and look up website record
		if (website.next()) {
			
			//set vars
			bindIPValue = website.ip_address;
			portValue = '443';
			
			//success, we have located a website related to SSL
			gs.log('BSY --> SSL Renewal: Website check - Success: Website(s) located for URL');
			
			//make call to ssl linked CIs view to get servers
			var sslLink = new GlideRecord('u_ssl_linked_assets');
			sslLink.addQuery('sslci_sys_id',sslSysID);
			sslLink.addQuery('relci_parent.sys_class_name','CONTAINS','cmdb_ci_win_server'); //only entries that are related to win servers
			var status = sslLink.addQuery('relci_parent.install_status','118'); //related server(s) In Use or Build/Rebuild
			status.addOrCondition('relci_parent.install_status','116');
			var par = sslLink.addQuery('relci_parent.name','CONTAINS','web'); //related server(s) has web/wap in name
			par.addOrCondition('relci_parent.name','CONTAINS','wap');
			sslLink.query();
			
			//check number of results, need at least 1 to proceed
			if (sslLink.getRowCount() >= 1) {
				
				//gather relationships, we must have a server parent and URL child
				var servLoop = 0;
				while (sslLink.next()) {
					
					if (servLoop == 0) {
						//create parse object
						var parse = {
							servers: []
						};
					}
					
					//critera processing - ####### ONLY Windows 2008 and up #######
					var winserv = new GlideRecord('cmdb_ci_win_server');
					winserv.addQuery('sys_id',sslLink.relci_parent);
					winserv.query();
					
					if (winserv.next()) {
						var os = winserv.u_d_operating_system;
						if (os != 'Windows 2003' && os != ''){
							//server OS is able to handle ssl automation
							gs.log('BSY --> SSL Renewal: Server OS check - Success: Server OS = ' + os);
							
							//set baseIPValue
							baseIPValue = winserv.ip_address;
							
							//check for base IP
							if (baseIPValue != '') {
								gs.log('BSY --> SSL Renewal: IP check - Success: Base IP = ' + baseIPValue);
								
								//add server to parse object
								var addSvr = new SSLServer(baseIPValue,bindIPValue,portValue);
								parse.servers.push(addSvr);
								
								gs.log('BSY --> SSL Renewal: Bind IP check - Success: Bind IP = ' + parse.servers[servLoop].bindIP);
								
								//success, we have server(s) to install SSL on
								gs.log('BSY --> SSL Renewal: ' + sslLink.sslci_name + ' meets initial criteria for renewal automation, sys_id:' + sslSysID);
							}
							else {
								gs.log('BSY --> SSL Renewal: IP check - Error: Server IP could not be found');
								ssl_process = false;
							}
							
							//reset baseIPValue
							baseIPValue = '';
						}
						else {
							gs.log('BSY --> SSL Renewal: Server OS check - Error: Server OS is Windows 2003 or NULL');
							ssl_process = false;
						}
					}
					else {
						gs.log('BSY --> SSL Renewal: Server OS check - Error: Server could not be found using sys_id');
						ssl_process = false;
					}
					servLoop = servLoop + 1;
				}
			}
			else {
				gs.log('BSY --> SSL Renewal: Skipping SSL ' + sslName + ' - does not have valid related server(s)');
				ssl_process = false;
			}
		}
		
		//reset vars
		bindIPValue = '';
		portValue = '';
		
		
		//success, we have located a website related to SSL
		gs.log('BSY --> SSL Renewal: Website check - Success: Website(s) located for URL');
	}
	else {
		gs.log('BSY --> SSL Renewal: Website check - Error: Website could not be found using URL');
		ssl_process = false;
	}
	
	//if ssl_process has remained true, proceed with automation
	if (ssl_process == true) {
		gs.log('BSY --> SSL Renewal: Initiated...  SSL Details: \nBSY --> sys_id = ' + sslSysID + '\nBSY --> name = ' + sslName + '\nBSY --> contact = ' + contact + '\nBSY --> expiration = ' + expiration);
		
		//execute script include to create request
		var sslRenewal = new M_Auto_Create_SC_SSL_Renewal(sslSysID,contact,expiration);
		var processRenewal = sslRenewal.createSSLRenewalReq();
		
	}
	else {
		gs.log('BSY --> SSL Renewal: Skipping SSL ' + sslName + ' - did not pass criteria checks');
	}
	
	//reset variables to null
	sslSysID = '';
	sslName = '';
	contact = '';
	expiration = '';
	web_name = '';
	ssl_process = true;
}

//##### SSL Renewal EXecution - End #####
gs.log('BSY --> SSL renewal job end');

function SSLServer(baseIP, bindIP, port) {
	this.baseIP = baseIP;
	this.bindIP = bindIP;
	this.port = port;
}