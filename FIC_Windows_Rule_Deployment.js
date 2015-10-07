//Windows deployment job for FIC

var servers = new GlideRecord('cmdb_ci_server');
servers.addQuery('install_status',118);
var orQ = servers.addQuery('os_domain','CONTAINS','mpn');
orQ.addOrCondition('u_d_pci',true);
servers.query();

gs.log('BSY --> Total number of PCI servers located = ' + servers.getRowCount());
while (servers.next()) {
	gs.log('BSY --> In Use PCI Server Found - name = ' + servers.name);
}