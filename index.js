'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');
const normalizePort = require('normalize-port');
 
const port = normalizePort(process.env.PORT || '3000');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(port);

/*var https = require('https');
var fs = require('fs');

 var options = {
  key: fs.readFileSync('path.key'),
  cert: fs.readFileSync('path.crt'),
  ca: fs.readFileSync('path.crt')
};
var file = new(static.Server)();
var app = https.createServer(options, function (req, res) {
  file.serve(req, res);
}).listen(8080);*/

var io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    //var clientsInRoom = io.sockets.adapter.rooms[room];

    var clients = io.sockets.adapter.rooms[room];
         var numClients = 0;
         if (typeof clients === 'undefined') {
         console.log("server.js:clients is type=" + clients + "/numClients="+numClients);
         } else {
         numClients = Object.keys(clients).length;
         console.log("server.js:clients is defined , numClients=" + numClients);
         }
    /*var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }*/
  });

  /*socket.on('create or join', function (room) {
      clients.push(arguments);
      //this line fixes the problem!!
      console.log("line executed")
      var numClients = clients.length;

      log('Room ' + room + ' has ' + numClients + ' client(s)');
      log('Request to create or join room ' + room);

      if (numClients === 0){
          socket.join(room);
          socket.emit('created', room);
      } else if (numClients === 1) {
          io.sockets.in(room).emit('join', room);
          socket.join(room);
          socket.emit('joined', room);
      } else { // max two clients
          socket.emit('full', room);
      }
      socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
      socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

  });*/

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

});
