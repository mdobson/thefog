var Fog = require('../fogserver.js'),
    Packet = require('../wspacket.js');

var client = new Fog.Client({'endpoint':'ws://0.0.0.0:5050/'});

client.open(function() {
  console.log('Client opened!');
});

client.on('ACK', function(p) {
  var p2 = new Packet({'action':'PONG'});
  client.send(p2);
});

client.on('PING', function(p) {
  console.log('Just pinged by server.');
  var p2 = new Packet({'action':'ACK'});
  client.respondTo(p, p2);
});

client.on('error', function(data) {
  console.log('error');
  console.log(data);
});
