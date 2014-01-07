var WSPacket = require('./wspacket.js');

function WSProtocol() {
}

WSProtocol.prototype.parse = function(packet, cb) {
  var p = new WSPacket(packet);
  if(p.valid()) {
    cb(null, p);
  } else {
    cb(new Error("Error parsing packet"));
  }
};

module.exports = WSProtocol;
