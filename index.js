/* global require, module */
'use strict';

require('./polyfills');
var util = require('util');
var stream = require('stream');

function TcpSocketSerialPort(options) {
  this.options = options;
}

util.inherits(TcpSocketSerialPort, stream.Stream);

TcpSocketSerialPort.prototype.connect = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      self.tcpsocket = navigator.mozTCPSocket;
      console.debug('connect ....');
      console.debug(self.options);
      self.device = self.tcpsocket.open(self.options.address, self.options.port);
      self.device.onopen = function() {
        console.debug('tcp socket open');
        var command = { devicename: 'ttyUSB0', bitrate: 9600 };	// connect to /dev/ttyUSB0 with 9600bps
        self.device.send(JSON.stringify(command));
        resolve('connected');
        console.debug('resolved');
      };
    } catch (exp) {
      reject(exp);
      console.error('error on message', exp);
      self.emit('error', 'error receiving message: ' + exp);
    }
    self.buffer = null;

    var START_SYSEX = 0xF0;
    var END_SYSEX = 0xF7;

    self.device.ondata = function(data) {
      console.debug('ondata');
      try {
        data = new Uint8Array(data);
        if (null !== self.buffer) {
          self.buffer = self._concatBuffer(self.buffer, data);
          if (data[data.length - 1] === END_SYSEX) {
            //end of SYSEX response
            self.emit('data', self.buffer);
            self.buffer = null;
          }
        } else if (data[0] === START_SYSEX &&
          data[data.length - 1] !== END_SYSEX) {
          //SYSEX response incomplete, wait for END_SYSEX byte
          self.buffer = data;
        } else {
          self.emit('data', data);
        }
      } catch (exp) {
        console.error('error on message', exp);
        self.emit('error', 'error receiving message: ' + exp);
      }
    };
//    self.device.on('error', reject);
  });
};

TcpSocketSerialPort.prototype.open = function(callback) {
  if (callback) {
    callback();
  }
};

TcpSocketSerialPort.prototype.write = function(data, callback) {
  this.device.send(data);
};

TcpSocketSerialPort.prototype.close = function(callback) {
  if (callback) {
    callback();
  }
  this.device.close();
};

TcpSocketSerialPort.prototype.flush = function(callback) {
  if (callback) {
    callback();
  }
};

TcpSocketSerialPort.prototype.drain = function(callback) {
  if (callback) {
    callback();
  }
};

TcpSocketSerialPort.prototype._concatBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(buffer1 , 0);
  tmp.set(buffer2, buffer1.byteLength);
  return tmp;
};

TcpSocketSerialPort.prototype._parseHexString = function(str) {
  var arrayBuffer = new ArrayBuffer(Math.ceil(str.length / 2));
  var uint8Array = new Uint8Array(arrayBuffer);

  for (var i = 0, j = 0; i < str.length; i += 2, j++) {
    uint8Array[j] = parseInt(str.substr(i, 2), 16);
  }
  return arrayBuffer;
};

TcpSocketSerialPort.prototype._toHexString = function(arrayBuffer) {
  var str = '';
  if (arrayBuffer) {
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < uint8Array.length; i++) {
      var b = uint8Array[i].toString(16);
      if (b.length == 1) {
        str += '0';
      }
      str += b;
    }
  }
  return str;
};

module.exports = {
  SerialPort: TcpSocketSerialPort
};
