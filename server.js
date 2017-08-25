'use strict';

var express = require('express'),
    Insteon = require('home-controller').Insteon;

// Constants
const LISTENER_ADDRESS = '0.0.0.0';
const LISTENER_PORT = process.env.LISTENER_PORT;
const INSTEON_HUB_ADDRESS = process.env.INSTEON_HUB_ADDRESS;
const INSTEON_HUB_PORT = process.env.INSTEON_HUB_PORT;
const INSTEON_HUB_USERNAME = process.env.INSTEON_HUB_USERNAME;
const INSTEON_HUB_PASSWORD = process.env.INSTEON_HUB_PASSWORD;

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

// Light event route
app.get('/api/lights/:id/subscribe', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`${id}] Subscribing to light events...`)
  var light = hub.light(id);
  light.on('turnOn', () => {
    console.log(`[${id}] Light turned ON`)
  });
  light.on('turnOff', () => {
    console.log(`[${id}] Light turned OFF`)
  });
  res.status(200).send(JSON.stringify({ device_id: id }));
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
