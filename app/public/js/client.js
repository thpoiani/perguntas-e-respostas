(function(window, document, io, undefined) {
  'use strict';

  var socket = io.connect(window.server);
  var ON = null;

  window.off = function(value) {
    socket.emit('off', value);
  }

  window.on = function(value) {
    socket.emit('on', value);
    ON = value;
  }

  socket.on('disconnect', function() {
    if (ON !== null) {
      socket.emit('disconnect', ON);
    }
  })

  socket.on('question', function (response) {
    document.querySelector('h2').innerText = response;

    if (ON !== null) {
      socket.emit('on', ON);
    }
  });
})(window, document, window.io);
