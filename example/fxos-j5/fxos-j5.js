/* global TcpSocketSerialPort,five */
'use strict';

(function() {
//  var toggle = document.getElementById('led-toggle');
  var serial = new TcpSocketSerialPort({address: '127.0.0.1', port: 9943});
  console.debug(serial);

  var conn = serial.connect();
  console.debug(conn);
  conn.then(function() {
    console.debug('serial connected');
    var board = new five.Board({port: serial, repl: false});

    board.on('ready', function() {
      console.debug('board ready');
//      var led = new five.Led(7);
//      led.blink();
//      toggle.addEventListener('change', function() {
//        if (this.checked) {
//          led.blink();
//        } else {
//          led.stop();
//        }
//      });

      // Create a new `motion` hardware instance.
      var motion = new five.Motion(4);

      // 'calibrated' occurs once, at the beginning of a session,
      motion.on('calibrated', function() {
        console.log('calibrated');
      });

      // 'motionstart' events are fired when the 'calibrated'
      // proximal area is disrupted, generally by some form of movement
      motion.on('motionstart', function() {
        console.log('motionstart');
      });

      // 'motionend' events are fired following a 'motionstart' event
      // when no movement has occurred in X ms
      motion.on('motionend', function() {
        console.log('motionend');
      });

    });
  }, function(err) {
    console.error(err);
  });
})();

