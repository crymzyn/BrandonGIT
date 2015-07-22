//get target date, 90 days from day of job execution
var godate = new GlideDateTime();
godate.addDays(90);

var startdate = new GlideDateTime(godate.getDisplayValue());
//var startdate = new GlideDateTime('2014-12-20 00:00:00');
gs.log('BSY --> Working date = ' + startdate.getDate());

//log beginning in SN logs
gs.log('BSY --> SSL renewal job initiated for SSL certificates expiring on \'' + startdate.getDate() + '\'');

/*

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

*/

//###### SSL Renewal Execution - Begin #####

//create variables for lookups
var sslSysID = '';
var sslName = '';
var contact = '';
var expiration = '';

//gather SSL records that match specified conditions
var sslgr = new GlideRecord('u_ssl');
sslgr.addQuery('install_status','101'); //Active
//sslgr.addQuery('name','ENDSWITH','.com'); //remove once we have code to handle more than .COMs
sslgr.addQuery('u_expiration_date','STARTSWITH',startdate.getDate());
sslgr.addQuery('u_owner','Maritz'); //remove once we have code to handle client owned
sslgr.query();

while (sslgr.next()) {
	
	//additional lookup on same record at cmdb_ci to get access to other fields
	var sslgr_ci = new GlideRecord('cmdb_ci');
	sslgr_ci.addQuery('sys_id',sslgr.sys_id);
	sslgr_ci.query();
	
	if (sslgr_ci.next()) {
		//identify manufacturer of SSL - currently only processing ENOM records
		var manu = sslgr_ci.manufacturer.name;
		manu = manu.toString().toLowerCase();
		gs.log('BSY --> manu = ' + manu);
		if (manu.indexOf('digicert') > -1) {
			
			gs.log('BSY --> SSL Renewal: We matched an Digi SSL by expiration date, sys_id = ' + sslgr.sys_id);
			
			//poulate variables for script include
			sslSysID = sslgr.sys_id;
			sslName = sslgr.name;
			contact = sslgr.u_contact_name;
			expiration = sslgr.u_expiration_date;
			
			gs.log('BSY --> SSL Renewal: Initiated...  SSL Details: \nBSY --> sys_id = ' + sslSysID + '\nBSY --> name = ' + sslName + '\nBSY --> contact = ' + contact + '\nBSY --> expiration = ' + expiration);
			
			////##### make REST call to see if ssl expiration date is truly 90 days out
			//var rWHOIS = new RESTMessage('WHOIS Expiration Date', 'get');
			//rWHOIS.setStringParameter('sslName',sslName);
			//rWHOIS.setStringParameter('username','maritz');
			//rWHOIS.setStringParameter('password','ki!9@Gb8Jg');
			//var responseWHOIS = rWHOIS.execute();
			//
			//gs.log(responseWHOIS.getBody());
			//
			////capture XML response and create doc to parse
			//var xmldocWHOIS = new XMLDocument(responseWHOIS.getBody());
			//
			////test whether expiresDate was returned, error if not
			//var testWHOIS = xmldocWHOIS.getNodes('//expiresDate').getLength();
			//if (testWHOIS > 0) {
				////##### expiresDate tag found, get value
				//var expiresDateWHOIS = xmldocWHOIS.getNodeText("//expiresDate");
				//
				////##### verify that expiration date is same as we expected
				////get date value from WHOIS
				//var splitDate = expiresDateWHOIS.split('T');
				//var eDate = splitDate[0];
				//if ('' + eDate == '' + startdate.getDate()) {
					
					//execute script include to create request
					var sslRenewal = new M_Auto_Create_SC_SSL_Renewal(sslSysID,contact,expiration);
					var processRenewal = sslRenewal.createSSLRenewalReq();
					
					//reset variables
					sslSysID = '';
					sslName = '';
					contact = '';
					expiration = '';
					
				//}
				//else {
				//	gs.log('BSY --> SSL Renewal: ssl expiration date from WHOIS record does not match expected 90 days out date... \nSSL = ' + ssl + '\nExpiration date from WHOIS = ' + splitDate[0] + '\nStart date value from job = ' + startdate.getDate());
				//}
			//}
			//else {
				//expiresDate tag not found, something is wrong
			//	gs.log('BSY --> SSL Renewal: WHOIS response did not include expiresDate - either call is broken or SSL (' + ssl + ') has no WHOIS record.');
			//}
		}
	}
}

//##### SSL Renewal EXecution - End #####
gs.log('BSY --> SSL renewal job end');