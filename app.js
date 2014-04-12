var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express()
	, port = process.env.PORT || 4444;

app.use(express.static(__dirname + '/public/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
	console.log('websocket connection open');

	ws.on('message', function(data) {
		console.log(JSON.parse(data));
		wss.broadcast(data);
	});
});

wss.broadcast = function(data) {
	for(var i in this.clients) {
		this.clients[i].send(data);
	}
};