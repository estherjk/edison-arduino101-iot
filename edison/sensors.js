var noble = require('noble');

// MODIFY THIS WITH THE APPROPRIATE URL
var socket = require('socket.io-client')('WEB-SERVER-DOMAIN-HERE:8080');

// These should correspond to the peripheral's service and characteristic UUIDs
var IMU_SERVICE_UUID = '2947ac9efc3811e586aa5e5517507c66';
var AX_CHAR_UUID =  '2947af14fc3811e586aa5e5517507c66';
var AY_CHAR_UUID = '2947b090fc3811e586aa5e5517507c66';
var AZ_CHAR_UUID = '2947b180fc3811e586aa5e5517507c66';
var GX_CHAR_UUID = '2947b252fc3811e586aa5e5517507c66';
var GY_CHAR_UUID = '2947b5aefc3811e586aa5e5517507c66';
var GZ_CHAR_UUID = '2947b694fc3811e586aa5e5517507c66';

socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('hello');
});

noble.on('stateChange', function(state) {
  if(state === 'poweredOn') {
    console.log('Start BLE scan...')
    noble.startScanning([IMU_SERVICE_UUID], false);
  }
  else {
    console.log('Cannot scan... state is not poweredOn')
    noble.stopScanning();
  }
});

// Discover the peripheral's IMU service and corresponding characteristics
// Then, emit each data point on the socket stream
noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    console.log('Connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices([IMU_SERVICE_UUID], function(error, services) {
      var imuService = services[0];
      console.log('Discovered IMU service');

      imuService.discoverCharacteristics([], function(error, characteristics) {
        characteristics.forEach(function(characteristic) {
          emitSensorData(characteristic);
        });
      });
    });
  });
});

function getSocketLabel(uuid) {
  var label = null;

  if(uuid == AX_CHAR_UUID) {
    label = 'ax:edison';
  }
  else if(uuid == AY_CHAR_UUID) {
    label = 'ay:edison';
  }
  else if(uuid == AZ_CHAR_UUID) {
    label = 'az:edison';
  }
  else if(uuid == GX_CHAR_UUID) {
    label = 'gx:edison';
  }
  else if(uuid == GY_CHAR_UUID) {
    label = 'gy:edison';
  }
  else if(uuid == GZ_CHAR_UUID) {
    label = 'gz:edison';
  }

  return label;
}

function emitSensorData(characteristic) {
  var socketLabel = getSocketLabel(characteristic.uuid);
  console.log(socketLabel);

  characteristic.on('read', function(data) {
    socket.emit(socketLabel, data.readInt32LE(0));
  });

  characteristic.notify('true', function(error) { if (error) throw error; });
}
