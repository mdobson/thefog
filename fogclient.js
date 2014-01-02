var ws = require('ws'),
    Protocol = require('./wsprotocol'),
    Packet = require('./wspacket.js');

function Client(options) {
  var opts = options || {};
  this.endpoint = options.endpoint || '';
  this.protocol = new Protocol();
}

Client.prototype.open = function(cb) {
  var self = this;
  this.socket = new ws(this.endpoint);
  this.socket.on('open', cb);
  this.socket.on('message', function(data, flags) {
    var p = new Packet(data);
    self.protocol.parse(p); 
  });
};

Client.prototype.send = function(packet, cb) {
  this.socket.send(packet.serialize());
};

Client.prototype.on = function(event, cb) {
  this.protocol.on(event, cb);
};
