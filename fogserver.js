var ws = require('ws'),
    wss = require('ws').Server,
    uuid = require('node-uuid'),
    events = require('events'),
    util = require('util'),
    WSProtocol = require('./wsprotocol.js'),
    Client = require('./fogclient.js'),
    CallbackMappings = require('./callbackmappings.js'),
    Packet = require('./wspacket.js');

function Server(options) {
  events.EventEmitter.call(this);
  var opts = options || {};
  var self = this;
  this.port = opts.port || 5050;
  this.hostingServer = opts.server || null;
  if(!this.hostingServer) {
    this.server = new wss({port: this.port});
  } else {
    this.server = new wss({server: this.hostingServer});
  }
  this.protocol = new WSProtocol();
  this.clients = new ClientMappings();
  this.returnMessages = new CallbackMappings();

  this.server.on('connection', function(ws) {
    var clientId = uuid.v1();
    self.clients.subscribe(ws, clientId);
    var packet = new Packet({'action':'ACK'});
    ws.send(packet.serialize());
    ws.on('error', self.emit.bind(self));
    ws.on('message', function(message) {
      self.protocol.parse(message, function(err, packet) {
        packet.setClientId(clientId);
        if(self.returnMessages.expectingCallback(packet)) {
          var cb = self.returnMessages.callback(packet);
          cb(packet);
        } else {
          self.emit(packet.getAction(), packet);
        }
      });
    });
  });
}
util.inherits(Server, events.EventEmitter);

Server.prototype.send = function(clientId, packet, cb) {
  if(typeof cb == 'function') {
    this.returnMessages.subscribe(packet, cb);
  }
  var ws = this.clients.getMapping(clientId);
  ws.send(packet.serialize());
};

Server.prototype.respondTo = function(fromPacket, toPacket, cb) {
  var packetId = fromPacket.getPacketId();
  if(typeof cb == 'function') {
    this.returnMessages.subscribe(fromPacket, cb);
  }
  toPacket.setPacketId(packetId);
  var ws = this.clients.getMapping(fromPacket.getClientId());
  ws.send(toPacket.serialize());
}

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
exports.Packet = Packet;
