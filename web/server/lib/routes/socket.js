// WebSocket communications
module.exports = function (socket) {
  socket.on('hello', function() {
    console.log('Client connected');
    socket.emit('init', {});
  });

  socket.on('ax:edison', function(data) {
    socket.broadcast.emit('ax:web', data);
  });

  socket.on('ay:edison', function(data) {
    socket.broadcast.emit('ay:web', data);
  });

  socket.on('az:edison', function(data) {
    socket.broadcast.emit('az:web', data);
  });

  socket.on('gx:edison', function(data) {
    socket.broadcast.emit('gx:web', data);
  });

  socket.on('gy:edison', function(data) {
    socket.broadcast.emit('gy:web', data);
  });

  socket.on('gz:edison', function(data) {
    socket.broadcast.emit('gz:web', data);
  });
};
