var objRole = new GlideRecord('u_object_roles');
objRole.addQuery('u_tag',workflow.scratchpad.server_tag);
objRole.query();

if (objRole.next()) {
	
	//set up variables
	var objType = '';
	var objValue = '';
	var objAction = '';
	
	//gs.log(objRole.sys_id);
	
	//get attributes
	var objAtt = new GlideRecord('u_object_role_attributes');
	objAtt.addQuery('u_role',objRole.sys_id);
	objAtt.query();
	
	var loop = 0;
	
	while (objAtt.next()) {
		
		if (loop == 0) {
			
			//create parse obj
			var parse = {
				attributes: []
			};
			
		}
		
		objType = '' + objAtt.u_type;
		objValue = '' + objAtt.u_value;
		objAction = '' + objAtt.u_action;
		//gs.log('Type:' + objType + ' Value:' + objValue);
		
		//add server to parse object
		var addAtt = new ServerRole(objType,objValue,objAction);
		parse.attributes.push(addAtt);
		
		loop = loop + 1;
		
		objType = '';
		objValue = '';
		objAction = '';
		
	}
	
}

for (var key in parse.attributes) {
	var obj = parse.attributes[key];
	if (obj.attType == 'disk_space') {
		for (var prop in obj) {
			/*// important check that this is objects own property
			// not from prototype prop inherited
			if(obj.hasOwnProperty(prop)){
				
				gs.log('Object ' + key + ': ' + prop + " = " + obj[prop]);
			}*/
			if (prop == 'attValue') {
				//gs.log(obj[prop]);
				var drive = '' + obj[prop];
				var drive_split = drive.split(':');
				var drive_letter = '' + drive_split[0];
				var drive_size = '' + drive_split[1];
				switch (drive_letter) {
					case 'cdrive':
						workflow.scratchpad.server_c_drive = drive_size;
					break;
					case 'ddrive':
						workflow.scratchpad.server_d_drive = drive_size;
					break;
					case 'edrive':
						workflow.scratchpad.server_e_drive = drive_size;
					break;
					case 'fdrive':
						workflow.scratchpad.server_f_drive = drive_size;
					break;
					case 'gdrive':
						workflow.scratchpad.server_g_drive = drive_size;
					break;
					case 'hdrive':
						workflow.scratchpad.server_h_drive = drive_size;
					break;
					default:
						//do nothing
				}
			}
		}		
	}
	else if (obj.attType == 'memory_size') {
		workflow.scratchpad.server_ram = obj.attValue;
	}
	else if (obj.attType == 'cpu_count') {
		workflow.scratchpad.server_cpu = obj.attValue;
	}
}

function ServerRole(attType, attValue, attAction) {
	this.attType = attType;
	this.attValue = attValue;
	this.attAction = attAction;
}