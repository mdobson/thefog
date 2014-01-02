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
    if(p.getData()) {
      this.emit(p.getAction(), p.getData());
    } else {
      this.emit(p.getAction());
    }
  } else {
    this.emit('error', 'invalid packet');
  }
};

module.exports = WSProtocol;
