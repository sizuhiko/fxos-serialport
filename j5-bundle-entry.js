/* global require */
'use strict';

(function(exports) {
  exports.TcpSocketSerialPort = require('./index').SerialPort;
  exports.five = require('johnny-five');
}(window));
