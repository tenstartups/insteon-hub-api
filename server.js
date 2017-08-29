'use strict';

var express = require('express'),
    Insteon = require('home-controller').Insteon,
    SSDPServer = require('node-ssdp').Server;

// Constants
const LISTENER_ADDRESS = '0.0.0.0';
const LISTENER_PORT = process.env.LISTENER_PORT;
const INSTEON_HUB_ADDRESS = process.env.INSTEON_HUB_ADDRESS;
const INSTEON_HUB_PORT = process.env.INSTEON_HUB_PORT;
const INSTEON_HUB_USERNAME = process.env.INSTEON_HUB_USERNAME;
const INSTEON_HUB_PASSWORD = process.env.INSTEON_HUB_PASSWORD;
const LIGHT_SWITCH_DEVICES = process.env.LIGHT_SWITCH_DEVICES.split(',');

// Start SSDP advertisement
var ssdpServer = new SSDPServer();

ssdpServer.addUSN('upnp:rootdevice');
ssdpServer.addUSN('urn:schemas-upnp-org:device:MediaServer:1');
ssdpServer.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1');
ssdpServer.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1');

ssdpServer.on('advertise-alive', (headers) => {
  // Expire old devices from your cache.
  // Register advertising device somewhere (as designated in http headers heads)
});

ssdpServer.on('advertise-bye', (headers) => {
  // Remove specified device from cache.
});

// start the server
ssdpServer.start();

process.on('exit', function(){
  ssdpServer.stop() // advertise shutting down and stop listening
})

// Insteon connector
var hub = new Insteon();
var config = {
  host: INSTEON_HUB_ADDRESS,
  port: INSTEON_HUB_PORT,
  user: INSTEON_HUB_USERNAME,
  password: INSTEON_HUB_PASSWORD
};
hub.httpClient(config, () => {
  console.log(`Connected to Insteon Hub at ${INSTEON_HUB_ADDRESS}:${INSTEON_HUB_PORT}`);
});

// Subscribe for device events
LIGHT_SWITCH_DEVICES.forEach((id) => {
  console.log(`[${id}] Subscribing to light events...`)
  var light = hub.light(id);
  console.log(light);
  light.on('turnOn', () => {
    console.log(`[${id}] Light turned ON`)
  });
  light.on('turnOff', () => {
    console.log(`[${id}] Light turned OFF`)
  });
});

// App
var app = express();

// Light status route
app.get('/api/devices/:id/info', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`[${id}] Retrieving device info...`)
  hub.info()
  .then((result) => {
    if(result == undefined) {
      console.log(`[${id}] Device not found`)
      res.status(404).send(JSON.stringify({ error: 'Device not found!' }));
    } else {
      console.log(`[${id}] Device info: ${JSON.stringify(result)}`)
      res.status(200).send(JSON.stringify(result));
    }
  });
});

// Light status route
app.get('/api/lights/:id/get_status', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`[${id}] Retrieving light status...`)
  var light = hub.light(id);
  light.level()
  .then((result) => {
    if(result == undefined) {
      console.log(`[${id}] Device not found`)
      res.status(404).send(JSON.stringify({ error: 'Device not found!' }));
    } else {
      console.log(`[${id}] Light level is ${result}`)
      res.status(200).send(JSON.stringify({ device_id: id, level: result }));
    }
  });
});

// Light on route
app.get('/api/lights/:id/turn_on', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`[${id}] Turning light ON...`)
  var light = hub.light(id);
  light.turnOn()
  .then((result) => {
    if(result.response) {
      console.log(`[${id}] Response: ${JSON.stringify(result.response)}`)
      res.status(200).send(JSON.stringify(result.response));
    } else {
      console.log(`[${id}] Device not found: ${JSON.stringify(result)}`)
      res.status(404).send(JSON.stringify({ error: 'Device not found!' }));
    }
  });
});

// Light off route
app.get('/api/lights/:id/turn_off', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`[${id}] Turning Light OFF...`)
  var light = hub.light(id);
  light.turnOff()
  .then((result) => {
    if(result.response) {
      console.log(`[${id}] Response: ${JSON.stringify(result.response)}`)
      res.status(200).send(JSON.stringify(result.response));
    } else {
      console.log(`[${id}] Device not found: ${JSON.stringify(result)}`)
      res.status(404).send(JSON.stringify({ error: 'Device not found!' }));
    }
  });
});

// 404 catchall route
app.use((req, res, next) => {
  res.status(404).send(JSON.stringify({ error: 'Invalid endpoint!' }));
})

// 500 catchall route
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(JSON.stringify({ error: 'Something broke!' }));
})

// Start listener loop
app.listen(LISTENER_PORT, LISTENER_ADDRESS);
console.log(`Listening on http://${LISTENER_ADDRESS}:${LISTENER_PORT}`);
