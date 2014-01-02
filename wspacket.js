function WSPacket(options){
  var opts = options || {};
  var packet = options.packet || null;
  if(typeof packet == 'String') {
    this.raw = packet;
    this.message = JSON.parse(packet);
  } else {
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

WSPacket.prototype.serialize = function() {
  this.raw = JSON.stringify(this.message);
  return this.raw;
};

WSPacket.prototype.setAction = function(action) {
  this.message.action = action;
};

WSPacket.prototype.action = function() {
  return this.message.action;
};

WSPacket.prototype.addData = function(k, v) {
  if(!this.message.data) {
    this.message.data = {};
  }
  this.message.data[k] = v;
};

WSPacket.prototype.setData = function(o) {
  if(!this.message.data) {
    this.message.data = {};
  }
  this.message.data = o;
};

WSPacket.prototype.data = function() {
  if(this.message.data) {
    return this.message.data;
  } else {
    return null;
  }
};

module.exports = WSPacket;
