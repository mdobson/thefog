var ws = require('ws'),
    wss = require('ws').Server,
    Client = require('./fogclient.js'),
    Packet = require('./wspacket.js'),
    uuid = require('node-uuid'),
    WSProtocol = require('./wsprotocol.js');

function Server(options) {
  var opts = options || {};
  var self = this;
  this.port = options.port || 5000;
  this.server = new wss({port: this.port});
  this.protocol = new WSProtocol();
  this.clients = new ClientMappings();

  this.server.on('connection', function(ws) {
    var clientId = uuid.v1();
    self.clients.subscribe(ws, clientId);
    var packet = new Packet({'action':'ACK'});
    ws.send(packet.serialize);
    ws.on('message', function(message) {
      self.protocol.parse(message);
    });
  });
}

Server.prototype.on = function(event, cb) {
  this.protocol.on(event, cb);
};

Server.prototype.send = function(clientId, packet) {
  var ws = this.clients.get(clientId);
  ws.send(packet.serialize());
};

function ClientMappings() {
  this.mappings = {};
}

ClientMappings.prototype.subscribe = function(ws, clientId) {
  this.mappings[clientId] = ws;
};

ClientMappings.prototype.get = function(clientId) {
  return this.mappings[clientId];
};


module.exports = Server;
module.Client = Client;
