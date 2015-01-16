//get target date, 21 days out from job date
var godate = new GlideDateTime();
godate.addDays(21);

//var startdate = new GlideDateTime(godate.getDisplayValue());
var startdate = new GlideDateTime('2015-02-07 00:00:00');
//gs.log('BSY --> Working date = ' + startdate.getDate());

//log beginning in SN logs
gs.log('BSY --> SSL expiration check for \'' + startdate.getDate() + '\'');

//###### Maritz IT Centralized Logger - Begin ######

//get MID server by instance
//Determine if we are in dev, stage, or prod instance
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
s.setParameter('Message','SSL certificate expiration check initiated for domains expiring on \'' + startdate.getDate() + '\'');
s.setParameter('LogSource',instanceName + ' - SSL Expiration Check');
s.setParameter('ComputerName','ServiceNow');
s.setParameter('DomainName','Cloud');
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

//###### SSL Expiration Check - Begin #####

//create variables for lookups
var ssl_sysid = '';
var ssl_name = '';
var contact = '';
var expiration = '';

//gather ssl records that match specified conditions
var ssl = new GlideRecord('u_ssl');
ssl.addQuery('install_status','101'); //Active
ssl.addQuery('u_expiration_date','STARTSWITH',startdate.getDate());
ssl.addQuery('u_allow_expiration',false);
ssl.query();

while (ssl.next()) {
	
	//ssl renewal ritm open already?
	//set variable ticket to false - change to true if already has ritm open
	var ticket = false;
	
	//check affected CI table to see if renewal ritm is open for this ssl
	var ritmChk = new GlideRecord('task_ci');
	ritmChk.addQuery('ci_item',ssl.sys_id);
	ritmChk.addQuery('task.state',1);
	ritmChk.addQuery('task.cat_item.name','SSL Renewal Request');
	ritmChk.query();
	
	while (ritmChk.next()) {
		
		//if we have a record here, ritm is open - mark ticket as true to skip opening incident
		ticket = true;
		gs.log('SSL \'' + ssl.name + '\' has a renewal RITM open = ' + ritmChk.task.number);
		
	}
	
	if (ticket == false) {
		
		gs.log('BSY --> SSL Certificate Expiration: We matched an SSL expiring with no associated renewal RITM, sys_id = ' + ssl.sys_id);
		
		//populate variables
		ssl_sysid = ssl.sys_id;
		ssl_name = '' + ssl.name;
		expiration = ssl.u_expiration_date;
		
		
		var owner = ssl.u_owner;
		if (owner == 'Client' || ('' + ssl.u_contact_name) == '') {
			contact = 'baffb39f540ba84076be372d61ca1f04'; //SYSTEM FEED sys_id
		}
		else {
			contact = ssl.u_contact_name;
		}
		
		gs.log('BSY --> SSL Certificate Expiration: Incident Creation Initiated...  SSL Details: \nBSY --> sys_id = ' + ssl_sysid + '\nBSY --> name = ' + ssl_name + '\nBSY --> contact = ' + contact + '\nBSY --> expiration = ' + expiration);
		
		//get current date/time
		var now = new GlideDateTime();
		
		//create incident for any ssls that are expiring
		var inc = new GlideRecord('incident');
		inc.initialize();
		inc.incident_state = 1;
		inc.caller_id = contact;
		inc.assignment_group = '46d6f4800009e000ba87f47595a1d1d7'; //Windows Server Operations - SSL
		inc.contact_type = 'internally-identified';
		inc.category = 'Failure';
		inc.subcategory = 'Error message';
		inc.impact = 1;
		inc.urgency = 3;
		inc.u_event_start_date = now.getDisplayValue();
		inc.cmdb_ci = ssl_sysid;
		inc.short_description = 'SSL EXPIRING - ' + ssl_name;
		inc.description = 'SSL \'' + ssl_name + '\' is expiring on \'' + expiration + '\'.';
		var sysid = inc.insert();
		//gs.log(sysid);
		
		
		/* NOT NEEDED - ADDING CI TO inc.cmdb_ci CREATES RELATIONSHIP!
		//attach affected CI to new incident
		var affCI = new GlideRecord('task_ci');
		affCI.initialize();
		affCI.task = sysid;
		affCI.ci_item = ssl;
		var sysid2 = affCI.insert();
		//gs.log(sysid2);
		
		*/
		
	}
	
	//reset variables
	ssl_sysid = '';
	ssl_name = '';
	contact = '';
	expiration = '';
	
}

//##### SSL Expiration Check - End #####
gs.log('BSY --> SSL certificate expiration check end');