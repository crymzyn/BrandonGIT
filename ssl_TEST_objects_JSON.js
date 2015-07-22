function SSLServer(baseIP, bindIP, port) {
  this.baseIP = baseIP;
  this.bindIP = bindIP;
  this.port = port;
}

var parse = {
servers: []
};

var baseIPvalue = '156.45.45.45';
var ip_address = '156.45.45.55';

var baseIPvalue2 = '10.9.9.9';
var ip_address2 = '10.9.9.10';

var testSvr = new SSLServer(baseIPvalue,ip_address,443);
parse.servers.push(testSvr);

var testSvr2 = new SSLServer(baseIPvalue2,ip_address2,443);
parse.servers.push(testSvr2);

gs.log(parse.servers.length);

var text = 'BSY --> Servers:';
var go = parse.servers;

for (var i = 0; i < go.length; i++) {
    text += '\n ' + parse.servers[i].port;
}
gs.log(text);