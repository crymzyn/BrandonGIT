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
var ssl_process;

//start at SSL table to get distinct records, then look up relationships via view
var sslCI = new GlideRecord('u_ssl');
sslCI.addQuery('sys_id','932a8290f16f090cbdc4da9a55894443'); //testing specific SSL
sslCI.addQuery('u_expiration_date','STARTSWITH','2015-02-19'); //expiration 90 days out
sslCI.addQuery('name','DOES NOT CONTAIN','*.'); //exlcude wildcards
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
		
		//execute script include to create request
		var sslRenewal = new M_Auto_Create_SC_SSL_Renewal(sslSysID,contact,expiration);
		var processRenewal = sslRenewal.createSSLRenewalReq();
}

//##### SSL Renewal EXecution - End #####
gs.log('BSY --> SSL renewal job end');