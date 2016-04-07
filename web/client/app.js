// MODIFY THIS WITH THE APPROPRIATE URL
var socket = io.connect('http://drejkim-mbpr.local:8080');

socket.on('connect', function() {
  socket.emit('hello');
});

socket.on('ax:web', function(data) {
  var ax = document.getElementById('ax-value');
  ax.innerText = data;
});
