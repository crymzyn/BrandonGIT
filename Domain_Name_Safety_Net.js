//get target date, 21 days out from job date
var godate = new GlideDateTime();
godate.addDays(21);

var startdate = new GlideDateTime(godate.getDisplayValue());
//var startdate = new GlideDateTime('2014-12-20 00:00:00');
//gs.log('BSY --> Working date = ' + startdate.getDate());

//log beginning in SN logs
gs.log('BSY --> Domain name expiration check for \'' + startdate.getDate() + '\'');

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
s.setParameter('AppKey','1DBDFB59-2DCC-4EFC-BD8F-AE7700DDAD1E');
s.setParameter('AppName','DomainNames');
s.setParameter('ApiKey','68BF9B1A-5000-45FC-96D7-1C58C81F5D1E');
s.setParameter('MessageType','Notification');
s.setParameter('Message','Domain name expiration check initiated for domains expiring on \'' + startdate.getDate() + '\'');
s.setParameter('LogSource',instanceName + ' - Domain Name Expiration Check');
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

//###### Domain Expiration Check Execution - Begin #####

//create variables for lookups
var domain = '';
var domainName = '';
var contact = '';
var expiration = '';

//gather domain name records that match specified conditions
var dn = new GlideRecord('u_domain_name');
dn.addQuery('install_status','101'); //Active
dn.addQuery('u_expiration_date','STARTSWITH',startdate.getDate());
dn.addQuery('u_allow_expiration',false);
dn.query();

while (dn.next()) {
	
	//domain renewal ritm open already?
	//set variable ticket to false - change to true if already has ritm open
	var ticket = false;
	
	//check affected CI table to see if renewal ritm is open for this domain
	var ritmChk = new GlideRecord('task_ci');
	ritmChk.addQuery('ci_item',dn.sys_id);
	ritmChk.addQuery('task.state',1);
	ritmChk.addQuery('task.cat_item.name','Domain Name Renewal Request');
	ritmChk.query();
	
	while (ritmChk.next()) {
		
		//if we have a record here, ritm is open - mark ticket as true to skip opening incident
		ticket = true;
		gs.log('Domain \'' + dn.name + '\' has a renewal RITM open = ' + ritmChk.task.number);
		
	}
	
	if (ticket == false) {
		
		gs.log('BSY --> Domain Name Expiration: We matched a domain name expiring with no associated renewal RITM, sys_id = ' + dn.sys_id);
		
		//poulate variables
		domain = dn.sys_id;
		domainName = dn.name;
		expiration = dn.u_expiration_date;
		
		var owner = dn.u_owner;
		if (owner == 'Client' || ('' + dn.u_contact_name) == '') {
			contact = 'baffb39f540ba84076be372d61ca1f04'; //SYSTEM FEED sys_id
		} 
		else {
			contact = dn.u_contact_name;
		}
		
		gs.log('BSY --> Domain Name Expiration: Incident Creation Initiated...  Domain Name Details: \nBSY --> sys_id = ' + domain + '\nBSY --> name = ' + domainName + '\nBSY --> contact = ' + contact + '\nBSY --> expiration = ' + expiration);
		
		//get current date/time
		var now = new GlideDateTime();
		
		//create incident for any domains that are expiring
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
		inc.short_description = 'DOMAIN EXPIRING - ' + domainName;
		inc.description = 'Domain name \'' + domainName + '\' is expiring on \'' + expiration + '\'.';
		var sysid = inc.insert();
		//gs.log(sysid);
		
		//attach affected CI to new incident
		var affCI = new GlideRecord('task_ci');
		affCI.initialize();
		affCI.task = sysid;
		affCI.ci_item = domain;
		var sysid2 = affCI.insert();
		//gs.log(sysid2);
		
	}
	
	//reset variables
	domain = '';
	domainName = '';
	contact = '';
	expiration = '';
	
}

//##### Domain Renewal Execution - End #####
gs.log('BSY --> Domain name expiration check end');