'use strict';

var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    ip      = require('ip'),
    colors  = require('colors/safe'),
    control = [];

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views/');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  // TODO authorization handshake
  res.render(app.get('views') + 'client.html', { server: ip.address() });
});

app.get('/show', function (req, res) {
  res.render(app.get('views') + 'server.html', { server: ip.address() });
});

io.on('connection', function (socket) {
  socket.on('question', function(data) {
    io.emit('question', data);
  });

  socket.on('off', function (data) {
    var message = {id: socket.id, value: data};

    io.emit('off', message);
    console.log(colors.red("%j"), message);
  });

  socket.on('on', function (data) {
    var message = {id: socket.id, value: data};

    control[socket.id] = data;

    io.emit('on', message);
    console.log(colors.green("%j"), message);
  });

  socket.on('disconnect', function(data) {
    var message = {id: socket.id, value: control[socket.id]};

    io.emit('off', message);
    console.log(colors.gray("%j"), message);
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
