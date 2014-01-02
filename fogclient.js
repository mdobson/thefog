var ws = require('ws'),
    packet = require('./wspacket.js');

function Client(options) {
  var opts = options || {};
  this.endpoint = options.endpoint || '';
}

Client.prototype.open = function(cb, mcb) {
  this.socket = new ws(this.endpoint);
  this.socket.on('open', cb);
  this.socket.on('message', function(data, flags) {
    var p = new packet(data);
    mcb(p);
  });
};

Client.prototype.send = function(packet, cb) {
  this.socket.send(packet, cb);
};
