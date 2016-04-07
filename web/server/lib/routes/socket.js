// WebSocket communications
module.exports = function (socket) {
  socket.on('hello', function() {
    console.log('Client connected');
    socket.emit('init', {});
  });

  socket.on('ax:edison', function(data) {
    socket.broadcast.emit('ax:web', data);
  });
};
