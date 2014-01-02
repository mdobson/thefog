var util = require('util'),
    events = require('events'),
    WSPacket = require('./wspacket.js');

function WSProtocol() {
  events.EventEmitter.call(this);
}
util.inherits(WSProtocol, events.EventEmitter);

WSProtocol.prototype.parse = function(packet) {
  var p = new WSPacket(packet);
  if(p.valid()) {
    if(p.data()) {
      this.emit(p.action(), p.data());
    } else {
      this.emit(p.action());
    }
  } else {
    this.emit('error', 'invalid packet');
  }
};

module.exports = WSProtocol;
