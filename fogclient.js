var ws = require('ws'),
    Protocol = require('./wsprotocol.js'),
    Packet = require('./wspacket.js');

function Client(options) {
  var opts = options || {};
  this.endpoint = opts.endpoint || '';
  this.protocol = new Protocol();
}

Client.prototype.open = function(cb) {
  var self = this;
  this.socket = new ws(this.endpoint);
  this.socket.on('open', cb);
  this.socket.on('message', function(data, flags) {
    self.protocol.parse(data); 
  });
};

Client.prototype.send = function(packet) {
  this.socket.send(packet.serialize());
};

Client.prototype.on = function(event, cb) {
  this.protocol.on(event, cb);
};

module.exports = Client;
