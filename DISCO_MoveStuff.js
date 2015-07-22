//move HPUX

var unixMove = new GlideRecord('cmdb_ci');
unixMove.addQuery('sys_class_name','cmdb_ci_unix_server');
unixMove.addQuery('u_type','HP-Unix');
unixMove.query();

while (unixMove.next()) {
unixMove.sys_class_name = 'cmdb_ci_hpux_server';
gs.log('BSY --> Moving HPUX Server to new class - ' + unixMove.name);
unixMove.update();
}

//move Linux

var linuxMove = new GlideRecord('cmdb_ci');
linuxMove.addQuery('sys_class_name','cmdb_ci_unix_server');
linuxMove.addQuery('u_type','Linux');
linuxMove.query();

while (linuxMove.next()) {
linuxMove.sys_class_name = 'cmdb_ci_linux_server';
gs.log('BSY --> Moving Linux Server to new class - ' + linuxMove.name);
linuxMove.update();
}

//move Solaris

var solarisMove = new GlideRecord('cmdb_ci');
solarisMove.addQuery('sys_class_name','cmdb_ci_unix_server');
solarisMove.addQuery('u_type','Solaris');
solarisMove.query();

while (solarisMove.next()) {
solarisMove.sys_class_name = 'cmdb_ci_solaris_server';
gs.log('BSY --> Moving Solaris Server to new class - ' + solarisMove.name);
solarisMove.update();
}