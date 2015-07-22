//Determine if we are in dev, stage, or prod instance
var instanceName = gs.getProperty('instance_name');
workflow.scratchpad.instance_name = instanceName;

//According to instance, set mid server info
switch(instanceName) {
	case 'maritzdev':
	//MidServer for Web Service Calls
	//workflow.scratchpad.midserver = 'FENAPPMGP_Dev';	
	workflow.scratchpad.midserver = 'FENWAPMGD04_Dev';
	//FQDN Mid Server Name
	//workflow.scratchpad.fqdn_mid_server = '172.19.7.30';
	workflow.scratchpad.fqdn_mid_server = '10.99.12.34';	
	//Central Logging 
	workflow.scratchpad.cl_instance = 'Service Now DEV';
	break;
	case 'maritzstage':
	//MidServer for Web Service Calls
	workflow.scratchpad.midserver = 'FENAPPMGP07_Stg';
	//FQDN Mid Server Name
	workflow.scratchpad.fqdn_mid_server = '156.45.55.249';
	//Central Logging 
	workflow.scratchpad.cl_instance = 'Service Now STAGE';
	break;
	case 'maritz':
	//get domain to use, so we can determine correct MID server
	//var domain = workflow.scratchpad.specified_domain;
	//domain = domain.toString().toLowerCase();
	var domain = 'us'; //override because we will always be running domain name extensions via default MID
	//Central Logging 
	workflow.scratchpad.cl_instance = 'Service Now PROD';
	switch(domain) {
		case 'us':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP07_US';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '156.45.55.249';
		break;
		case 'mneti':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP05_MNETi';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '172.19.13.249';
		break;
		case 'mnete':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP06_MNETe';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '156.45.59.119';
		break;
		case 'mpn':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP08_MPN';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '10.99.13.249';
		break;
		case 'mpni':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP09_MPNi';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '192.168.239.249';
		break;
		case 'mpne':
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP04_MPNe';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '156.45.69.249';
		break;
		default:
		//DEFAULT TO PROD
		//MidServer for Web Service Calls
		workflow.scratchpad.midserver = 'FENAPPMGP07_US';
		//FQDN Mid Server Name
		workflow.scratchpad.fqdn_mid_server = '156.45.55.249';
	}
	break;
	default:
	//DEFAULT TO PROD
	//MidServer for Web Service Calls
	workflow.scratchpad.midserver = 'FENAPPMGP07_US';
	//FQDN Mid Server Name
	workflow.scratchpad.fqdn_mid_server = '156.45.55.249';
	//Central Logging 
	workflow.scratchpad.cl_instance = 'Service Now PROD';
}
	

workflow.info(workflow.scratchpad.fqdn_mid_server);