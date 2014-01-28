var Fog = require('../fogserver.js'),
    Packet = require('../wspacket.js'),
    ClientId = '12345678901';

var client = new Fog.Client({'endpoint':'ws://0.0.0.0:5050/'});

client.open(function() {
  console.log('Client opened!');
});

client.on('ACK', function(p) {
  console.log('acked');
  var p1 = new Packet({'action':'REGISTER'});
  p1.setClientId(ClientId);
  client.send(p1, function(err, packet){
    console.log(err);
    console.log('registration returned.');
    var p2 = new Packet({'action':'PONG'});
    p2.setClientId(ClientId);
    client.send(p2);
  });
});

client.on('PING', function(p) {
  console.log('Just pinged by server.');
  var p2 = new Packet({'action':'ACK'});
  p2.setClientId(ClientId);
  client.respondTo(p, p2, function(err, packet){
    console.log('This server sure is chatty!');
  });
});

client.on('error', function(data) {
  console.log('error');
  console.log(data);
});
