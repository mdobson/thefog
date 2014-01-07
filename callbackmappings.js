function CallbackMappings() {
  this.mappings = {};
}

CallbackMappings.prototype.subscribe = function(packet, cb) {
  var cbObj = {
    'cb':cb,
    'timeout':setTimeout(function() { cb(new Error('Socket communication timed out.')); }, 10000)
  };
  this.mappings[packet.getPacketId()] = cbObj;
};

CallbackMappings.prototype.expectingCallback = function(packet) {
  return packet.getPacketId() in this.mappings;
};

CallbackMappings.prototype.callback = function(packet) {
  if(packet.getPacketId() in this.mappings) {
    var cbObj = this.mappings[packet.getPacketId()];
    clearTimeout(cbObj['timeout']);
    return cbObj.cb;
  } else {
    return null;
  }
};

module.exports = CallbackMappings;