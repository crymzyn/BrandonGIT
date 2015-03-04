var currentHardware = g_form.getValue('hw_name');
alert('currentHardware' + currentHardware);
//if this gives a sys_id, you might have to do a getReference instead
//to get the value you are looking for...
//example =
http://wiki.servicenow.com/index.php?title=GlideForm_(g_form)#getReference

if (newValue == currentHardware) {
        var serverRecord = new GlideRecord('cmdb_ci_server');
        serverRecord.addQuery(server_name.cmdb_ci_server); //missing a parameter
here, needs column you are looking up, like
('sys_id',server_name.cmdb_ci_server)
        serverRecord.query();

        if(serverRecord.next()){

                g_form.setValue('server_name', serverRecord.cmdb_ci_server);

                alert("If this code is correct");
        }
}