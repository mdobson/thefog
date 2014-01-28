var Fog = require('../fogserver.js'),
    Packet = require('../wspacket.js');

var server = new Fog.Server();

server.on('PONG', function(p) {
  console.log('Just got ponged. Pinging.');
  var p2 = new Packet({'action':'PING'});
  p2.setClientId(p.getClientId());
  server.send(p2, function(err, packet){
    console.log('Got a response from the ping!');
    var p3 = new Packet({'action':'ACKACK'});
    server.respondTo(packet, p3);
  });
});

server.on('REGISTER', function(p, ws) {
  server.subscribe(ws, p.getClientId());
  var p2 = new Packet({'action':'REGISTERSUCCESS'});
  p2.setClientId(p.getClientId());
  server.respondTo(p, p2);
});

server.on('error', function(data) {
  console.log('Packet err');
  console.log(data);
});
