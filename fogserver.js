var ws = require('ws'),
    wss = require('ws').Server,
    Client = require('./fogclient.js'),
    Packet = require('./wspacket.js'),
    uuid = require('node-uuid'),
    WSProtocol = require('./wsprotocol.js');

function Server(options) {
  var opts = options || {};
  var self = this;
  this.port = opts.port || 5050;
  this.server = new wss({port: this.port});
  this.protocol = new WSProtocol();
  this.clients = new ClientMappings();

  this.server.on('connection', function(ws) {
    var clientId = uuid.v1();
    self.clients.subscribe(ws, clientId);
    var packet = new Packet({'action':'ACK', 'data':{'clientId':clientId}});
    ws.send(packet.serialize());
    ws.on('message', function(message) {
      self.protocol.parse(message);
    });
  });
}

Server.prototype.on = function(event, cb) {
  this.protocol.on(event, cb);
};

Server.prototype.send = function(clientId, packet) {
  var ws = this.clients.getMapping(clientId);
  ws.send(packet.serialize());
};

function ClientMappings() {
  this.mappings = {};
}

ClientMappings.prototype.subscribe = function(ws, clientId) {
  this.mappings[clientId] = ws;
};

ClientMappings.prototype.getMapping = function(clientId) {
  return this.mappings[clientId];
};


exports.Server = Server;
exports.Client = Client;
