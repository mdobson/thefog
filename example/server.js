var Fog = require('../fogserver.js'),
    Packet = require('../wspacket.js');

var server = new Fog.Server();

server.on('PONG', function(p) {
  console.log('Just got ponged. Pinging.');
  var p2 = new Packet({'action':'PING'});
  server.send(p.getClientId(), p2, function(err, packet){
    console.log('Got a response from the ping!');
  });
});

server.on('error', function(data) {
  console.log('Packet err');
  console.log(data);
});
