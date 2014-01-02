var ws = require('ws'),
    wss = require('ws').Server,
    Client = require('./fogclient.js'),
    WSProtocol = require('./wsprotocol.js');

function Server(options) {
  var opts = options || {};
  var self = this;
  this.port = options.port || 5000;
  this.server = new wss({port: this.port});
  this.protocol = new WSProtocol();

  this.server.on('connection', function(ws) {
    ws.on('message', function(message) {
      self.protocol.parse(message);
    });
  });
}

Server.prototype.on = function(event, cb) {
  this.protocol.on(event, cb);
};

module.exports = Server;
module.Client = Client;
