function WSPacket(options){
  var opts = options || {};
  var packet = opts || null;
  if(typeof packet == 'string') {
    this.raw = packet;
    this.message = JSON.parse(packet);
  } else {
    this.message = packet;
  }
}

WSPacket.prototype.valid = function() {
  if(!this.message) {
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

WSPacket.prototype.getAction = function() {
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

WSPacket.prototype.getData = function() {
  if(this.message.data) {
    return this.message.data;
  } else {
    return null;
  }
};

module.exports = WSPacket;
