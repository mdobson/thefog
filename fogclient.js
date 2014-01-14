var ws = require('ws'),
    Protocol = require('./wsprotocol.js'),
    events = require('events'),
    util = require('util'),
    CallbackMappings = require('./callbackmappings.js'),
    Packet = require('./wspacket.js');

function Client(options) {
  events.EventEmitter.call(this);
  var opts = options || {};
  this.endpoint = opts.endpoint || '';
  this.protocol = new Protocol();
  this.returnMessages = new CallbackMappings();
}
util.inherits(Client, events.EventEmitter);

Client.prototype.open = function(cb) {
  var self = this;
  this.socket = new ws(this.endpoint);
  this.socket.on('open', cb);
  this.socket.on('error', this.emit.bind(this));
  this.socket.on('message', function(data, flags) {
    self.protocol.parse(data, function(err, p){
      if(self.returnMessages.expectingCallback(p)) {
        var cb = self.returnMessages.callback(p);
        cb(null, p);
      } else {
        self.emit(p.getAction(), p);
      }
    }); 
  });
};

Client.prototype.respondTo = function(fromPacket, toPacket, cb) {
  var packetId = fromPacket.getPacketId();
  if(typeof cb == 'function') {
    this.returnMessages.subscribe(fromPacket, cb);
  }
  toPacket.setPacketId(packetId);
  this.socket.send(toPacket.serialize());
};

Client.prototype.send = function(packet, cb) {
  
  if(typeof cb == 'function') {
    this.returnMessages.subscribe(packet, cb);
  }

  try {
    this.socket.send(packet.serialize());
  }catch(err){
    if(typeof cb == 'function')
      cb(err);
  }
};

module.exports = Client;
