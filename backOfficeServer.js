"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Run server to listen on port 3000.
var server = app.listen(4000, function () {
  console.log('listening on *:4000');
});

app.use('/', express.static(__dirname + '/backOffice'));

var io = require('socket.io')(server);
// Parse application/json inputs.
app.use(bodyParser.json());

io.sockets.on('connection', function (socket) {

  socket.on('message', function (data) {
     console.log(data);

     io.sockets.emit('message',data);

  })
  socket.on('desconectado', function (data) {
    io.sockets.emit('desconectado',data);
  })
});


