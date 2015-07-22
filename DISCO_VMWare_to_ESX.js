//POPULATE CORRELATION ID
var esxSide = new GlideRecord('cmdb_ci_esx_server');
esxSide.query();

while (esxSide.next()) {

                var hostname = '' + esxSide.name;

                var usChk = hostname.indexOf('.us');

                if (usChk > -1) {
                                //gs.log('BSY --> VM name = ' + hostname);

                                var splitName = hostname.split('.');
                                var newName = splitName[0];

                                var vmSide = new GlideRecord('u_vmware_server');
                                vmSide.addQuery('name',newName);
                                vmSide.query();

                                if (vmSide.next()) {
                                                vmSide.correlation_id = esxSide.correlation_id;
                                                vmSide.update();
                                }
                }
}


//DELETE NEW RECORDS
var esxSide = new GlideRecord('cmdb_ci_esx_server');
esxSide.query();

while (esxSide.next()) {
                gs.log('BSY --> Deleting ESX server = ' + esxSide.name);
                esxSide.deleteRecord();
}


//MOVE OLD RECORDS
var vmWare = new GlideRecord('cmdb_ci');
vmWare.addQuery('sys_class_name','u_vmware_server')
vmWare.query();

while (vmWare.next()) {
                gs.log('BSY --> Moving VMWare server to ESX class = ' + vmWare.name);
                vmWare.sys_class_name = 'cmdb_ci_esx_server';
                vmWare.update();
}
