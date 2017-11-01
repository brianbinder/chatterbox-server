/* Import node's http module: */
var http = require('http');
var requestHandler = require('./request-handler.js');
var url = require('url');

var port = 3000;

var ip = '127.0.0.1';

var server = http.createServer(function(request, response) {
  var destination = url.parse(request.url, true);
  if (destination.pathname === '/classes/messages' || destination.pathname === '/classes/room') {
    requestHandler.requestHandler(request, response);
  } else {
    requestHandler.sendResponse(response, 404);
  }
});
console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);
