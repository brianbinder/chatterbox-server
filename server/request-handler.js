var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/plain'
};

var objectId = 0;

var messages = [];

// var exampleMessage = {
//   username: 'bargle',
//   roomname: 'lobby',
//   text: 'arglehahaha',
//   objectId: objectId,
//   createdAt: 0
// };

var collectData = function(request, callback) {
  var data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    callback( JSON.parse(data) );
  });
};

var sendResponse = function(response, statusCode, data) {
  // data = data || '';
  statusCode = statusCode || 200;
  var headers = defaultCorsHeaders;
  response.writeHead(statusCode, headers);
  response.end(data);
};

var actions = {
  'POST': function(request, response) {
    collectData(request, function(message) {
      console.log(message);
      message.objectId = ++objectId;
      message.createdAt = Math.floor(Date.now());
      messages.push(message);
      sendResponse(response, 201, JSON.stringify({objectId: message.objectId}));
    });
  },

  'GET': function(request, response) {
    var data = JSON.stringify({results: messages});
    sendResponse(response, null, data);
  },

  'OPTIONS': function(request, response) {
    sendResponse(response);
  }
};



var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var action = request.method;
  if (actions[action]) {
    actions[action](request, response);
  } else {
    //error
    sendResponse(response, 404);
  }
};


exports.requestHandler = requestHandler;
exports.sendResponse = sendResponse;
