TcpSocketSerialPort
=============

A virtual [node-serialport] implementation that uses [mozTCPSocket] as the transport.
It's inspired from [BleSerialPort](https://github.com/elin-moco/ble-serialport) strongly.

# Prerequisites

First you need [git] and [node.js] to clone this repo and install dependencies:
```
git clone https://github.com/sizuhiko/tcpsocket-serialport.git
cd tcpsocket-serialport
npm install
```

Secondly, you'll need an [Arduino] board with [Firefox OS] added on top of it, 
put an LED on pin 7, connect Arduino to you computer, 
and upload this [StandardFirmata] firmware to it.

To use mozTCPSocket to send/receive data to the device with [firmata] or [Johnny Five],
run below gulp tasks to [browserify] them like:
```
gulp build
```

You'll find the browserified scripts in `build` folder 


# Use with Johnny Five

Include Johnny Five bundle script in your html file:
```html
  <script type="text/javascript" src="j5-bundle.js"></script>
```
To use with [node.js], you'll need these two require statements:
```javascript
var TcpSocketSerialPort = require('tcpsocket-serialport').SerialPort;
var five = require('johnny-five');
```

Then use it directly in your script:
```javascript
var serial = new TcpSocketSerialPort({address: '127.0.0.1', port: 9943}); //put your device address or port here
serial.connect().then(function() {
  var board = new five.Board({port: serial, repl: false});
  board.on('ready', function() {
    var led = new five.Led(7);
    led.blink();
  });
});

```

And you should see the LED blinks once you have the webapp(page) opened.


# Use with Firmata

Include the firmata bundle script in your html file:
```html
  <script type="text/javascript" src="firmata-bundle.js"></script>
```
To use with [node.js], you'll need these two require statements:
```javascript
var TcpSocketSerialPort = require('tcpsocket-serialport').SerialPort;
var firmata = require('firmata');
```

Then use it directly in your script:
```javascript
var serial = new TcpSocketSerialPort({address: '127.0.0.1', port: 9943}); //put your device address or port here
serial.connect().then(function() {
  var board = new firmata.Board(serial);
  board.on('ready', function() {
    board.digitalWrite(7, board.HIGH);
  });
});

```

And you should see the LED on once you have the webapp(page) opened.


# Runing Examples

For the [fxos-j5] example,
run following commands to copy bundle script to example/fxos-j5 directory:
```
gulp dist
```

For the [fxos-j5] example,
modify example/fxos-j5/fxos-j5.js for your device address.  
Then install app via WebIDE.

For the node-j5 and node-firmata examples, just update the address and run with:
```
node node-firmata.js
```
or
```
node node-j5.js
```

# Support

Currently this implementation uses [mozTCPSocket API](https://developer.mozilla.org/en/docs/Web/API/Navigator/mozTCPSocket) on FxOS,
which is still experimental and requires certified permissions for now.

For the hardware part, now only tested with [Arduino]+[KDDI Open Web Board].

[mozTCPSocket]: https://developer.mozilla.org/en/docs/Web/API/Navigator/mozTCPSocket
[Arduino]: http://arduino.cc/
[node-serialport]: https://github.com/voodootikigod/node-serialport
[firmata]: https://github.com/jgautier/firmata/ 
[Johnny Five]: http://github.com/rwaldron/johnny-five/ 
[browserify]: http://browserify.org/ 
[node.js]: https://nodejs.org/
[git]: https://git-scm.com/
[fxos-j5]: https://github.com/sizuhiko/tcpsocket-serialport/tree/master/example/fxos-j5
[web-tcpsocket-loopback]: https://github.com/digitarald/web-tcpsocket-loopback
