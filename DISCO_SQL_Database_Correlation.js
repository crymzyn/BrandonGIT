//move SQL databases to new class
var dbMove = new GlideRecord('cmdb_ci');
dbMove.addQuery('sys_class_name','cmdb_ci_database');
dbMove.addQuery('u_type','SQL Database');
dbMove.query();

while (dbMove.next()) {

	dbMove.sys_class_name = 'cmdb_ci_db_mssql_catalog';
	dbMove.update();

}

//delete newly discovered records so we can match on old ones
var dbKill = new GlideRecord('cmdb_ci_db_mssql_catalog');
dbKill.addQuery('sys_created_by','s_UCMDBDiscovery');
dbKill.query();

while (dbKill.next()) {

	dbKill.deleteRecord();

}

//populate SQL databases with instance sys id
var dbOld = new GlideRecord('cmdb_ci_database');
dbOld.addQuery('u_type','SQL Database');
dbOld.query();

while (dbOld.next()) {
	
	var dbOldSysID = dbOld.sys_id;

	var dbRel = new GlideRecord('cmdb_rel_ci');
	dbRel.addQuery('child.sys_id',dbOldSysID);
	dbRel.query();

	if (dbRel.next()) {

		//dbOld.u_host_sys_id = dbRel.parent.sys_id;
		dbOld.database_instance = dbRel.parent.sys_id;

	}

dbOld.update();

}

//combined last script with one above...

/*
//populate database_instance field
var db = new GlideRecord('cmdb_ci_db_mssql_catalog');
db.query();

if (db.next()) {
db.database_instance = db.u_host_sys_id;
db.update();
}
*/