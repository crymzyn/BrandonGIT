//Create glide record to u_domain_name to gather domains expiring on matched date
var dnGr = new GlideRecord('u_domain_name');
dnGr.addQuery('u_expiration_date','STARTSWITH','2015-02-02');
dnGr.query();

while (dnGr.next()) {
	//Create new glide record at cmdb_ci level to get same record, but access to other fields to check manufacturer
	var ciGr = new GlideRecord('cmdb_ci');
	ciGr.addQuery('sys_id',dnGr.sys_id);
	ciGr.query();

	if (ciGr.next()) {
		var manu = ciGr.manufacturer.name;
		manu = manu.toString().toLowerCase();
gs.log('BSY --> manu = ' + manu);
		if (manu.indexOf('enom') > -1) {
			gs.log('BSY --> domain name = ' + dnGr.name);
		}
	}
}