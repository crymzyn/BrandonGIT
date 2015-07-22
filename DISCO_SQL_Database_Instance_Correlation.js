//move to new class
var instanceCI = new GlideRecord('cmdb_ci_db_instance');
instanceCI.addQuery('sys_class_name','cmdb_ci_db_instance');
instanceCI.addQuery('u_type','SQL Server');
instanceCI.query();

while (instanceCI.next()) {

	instanceCI.sys_class_name = 'cmdb_ci_db_mssql_instance';
	instanceCI.update();

}

//correlation begin
var sqlProcess = '';
var instanceName = '';
var instanceNameNew = '';
var hostName = '';

var instance_old = new GlideRecord('cmdb_ci_db_mssql_instance');
instance_old.addQuery('sys_created_by','!=','s_UCMDBDiscovery');
instance_old.query();

while (instance_old.next()) {

	//find records with just server name so we know which have instance names of MSSQLSERVER (default)
	var oldName = instance_old.name;
	var slashChk = oldName.indexOf('\\');
	if (slashChk == -1) {
		//has MSSQLSERVER instanceName
		hostName = oldName;
		instanceName = 'MSSQLSERVER';
	} 
	else {
		var oldNameSplit = oldName.split('\\');
		hostName = oldNameSplit[0];
		instanceName = oldNameSplit[1];
	}

	gs.log('BSY --> instanceName = ' + instanceName);

	var instance_new = new GlideRecord('cmdb_ci_db_mssql_instance');
	instance_new.addQuery('sys_created_by','s_UCMDBDiscovery');
	instance_new.addQuery('name',hostName);
	instance_new.addQuery('instance_name',instanceName);
	instance_new.query();

	if (instance_new.next()) {

		sqlProcess = instance_new.running_process.sys_id;
		instanceNameNew = instance_new.instance_name;

	}

	//look up Microsoft SQL Server classifier sys_id
	var classifierSysID = '';
	var getClassifier = new GlideRecord('discovery_classy_proc');
	getClassifier.addQuery('name','Microsoft SQL Server');
	getClassifier.query();

	if (getClassifier.next()) {
		classifierSysID = getClassifier.sys_id;
	}

	instance_old.running_process = sqlProcess;
	instance_old.classifier = classifierSysID;
	instance_old.instance_name = instanceNameNew;
	instance_old.update();

}

//check name against running_process.computer ???

//clean up junk discovered records before running discovery a second time
var instance_clean = new GlideRecord('cmdb_ci_db_mssql_instance');
instance_clean.addQuery('sys_created_by','s_UCMDBDiscovery');
instance_clean.query();

while (instance_clean.next()) {
	instance_clean.deleteRecord();
}