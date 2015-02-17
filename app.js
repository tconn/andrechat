var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io').listen(server),
	api = require('./src/routes/api')(app),
	mqtt = require('mqtt');

var port = process.env.PORT || 8080;
server.listen(port);

app.use(express.static(__dirname + '/build'));


var client = mqtt.connect({host: 'localhost', port: 61613});

client.on('error', function(err){
  console.error(err);
});

client.subscribe('testchat');

// once a connection is made to socket io
io.on('connection', function(socket){

  // once a message is heard on socket io
  socket.on('chat message', function(msg){
  	// relay the message to mqtt
	client.publish('testchat', msg.body);
  });
});

// once mqtt hears a message
client.on('message', function(topic, message){
  console.log('message heard from mqtt: ' + message);
  // relay the message back to socket io
  io.emit('chat message', {sender: "Unknown", "body":message.toString()});
});

exports = module.exports = app;