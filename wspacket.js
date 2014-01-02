function WSPacket(options){
  var opts = options || {};
  var packet = options.packet || null;
  if(typeof packet == 'String') {
    this.raw = packet;
    this.message = JSON.parse(packet);
  } else {
    this.raw = JSON.stringify(packet);
    this.message = packet;
  }
}

WSPacket.prototype.valid = function() {
  if(!this.raw || !this.message) {
    return false;
  } else if (!this.message.action) {
    return false;
  } else {
    return true;
  }
};

WSPacket.prototype.action = function() {
  return this.message.action;
};

WSPacket.prototype.data = function() {
  if(this.message.data) {
    return this.message.data;
  } else {
    return null;
  }
};

module.exports = WSPacket;
