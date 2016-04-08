// MODIFY THIS WITH THE APPROPRIATE URL
var socket = io.connect('http://drejkim-mbpr.local:8080');

socket.on('connect', function() {
  socket.emit('hello');
});

socket.on('ax:web', function(data) {
  document.getElementById('ax-value').innerText = data;
});

socket.on('ay:web', function(data) {
  document.getElementById('ay-value').innerText = data;
});

socket.on('az:web', function(data) {
  document.getElementById('az-value').innerText = data;
});

socket.on('gx:web', function(data) {
  document.getElementById('gx-value').innerText = data;
});

socket.on('gy:web', function(data) {
  document.getElementById('gy-value').innerText = data;
});

socket.on('gz:web', function(data) {
  document.getElementById('gz-value').innerText = data;
});
