var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

var PORT = process.env.PORT || 1337;

var server = app.listen(PORT, function(){
	console.log('Connected on port 1337')
});

var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket){

	socket.on('newUser', function(userData){
		users.push({
			socketID: socket.id,
			name: userData.userName
		});
		io.emit('updateUserList', users);
		io.emit('updateMessageBoard', {
			msg: ('<p>' + "<span id='new_user'>" + userData.userName + "</span>" + ' just entered the chat </p>')
		});
	});

	socket.on('newMessage', function(userData){
		io.emit('updateMessageBoard', userData);
	});

	socket.on('disconnect', function(){
		for(index in users){
			if(users[index].socketID == socket.id){
				io.emit('updateMessageBoard', {
					msg: ('<p>' + "<span id='past_user'>" + users[index].name + "</span>" + ' just left the chat </p>')
				});
				users.splice(index, 1);
				io.emit('updateUserList', users);
			};
		};
	});
});