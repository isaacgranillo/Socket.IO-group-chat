var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

var PORT = process.env.PORT || 1337;

var server = app.listen(PORT, function(){
	console.log('Connected on port 1337')
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

	socket.on('newMessage', function(userData){
		io.emit('updateMessageBoard', userData);
	});

	socket.on('disconnect', function(){

	});
});