/* global require */
'use strict';

(function(exports) {
  exports.TcpSocketSerialPort = require('./index').SerialPort;
  exports.firmata = require('firmata');
}(window));
