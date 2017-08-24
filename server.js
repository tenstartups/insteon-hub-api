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
  console.log(`Retrieving info for ${id}`)
  hub.info()
  .then((info) => {
    console.log(info)
    if(info == undefined) {
      res.status(404).send(JSON.stringify({ error: 'Not found!' }));
    } else {
      res.status(200).send(JSON.stringify(info));
    }
  });
});

// Light status route
app.get('/api/lights/:id/get_status', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`Retrieving status for light ${id}`)
  var light = hub.light(id);
  light.level()
  .then((level) => {
    if(level == undefined) {
      res.status(404).send(JSON.stringify({ error: 'Not found!' }));
    } else {
      res.status(200).send(JSON.stringify({ device_id: id, level: level }));
    }
  });
});

// Light on route
app.get('/api/lights/:id/turn_on', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`Turning on light ${id}`)
  var light = hub.light(id);
  light.turnOn()
  .then((status) => {
    console.log(status)
    if(status.response) {
      res.status(200).send(JSON.stringify({ device_id: id, action: 'turned_on' }));
    } else {
      res.status(404).send(JSON.stringify({ error: 'Not found!' }));
    }
  });
});

// Light off route
app.get('/api/lights/:id/turn_off', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`Turning off light ${id}`)
  var light = hub.light(id);
  light.turnOff()
  .then((status) => {
    console.log(status)
    if(status.response) {
      res.status(200).send(JSON.stringify({ device_id: id, action: 'turned_off' }));
    } else {
      res.status(404).send(JSON.stringify({ error: 'Not found!' }));
    }
  });
});

// Light event route
app.get('/api/lights/:id/subscribe', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log(`Subscribing to events for light ${id}`)
  var light = hub.light(id);
  light.on('turnOn', () => {
    console.log(`Turned on ${id}`)
  });
  light.on('turnOff', () => {
    console.log(`Turned off ${id}`)
  });
  res.status(200).send(JSON.stringify({ device_id: id, action: 'subscribed' }));
});

// 404 catchall route
app.use((req, res, next) => {
  res.status(404).send(JSON.stringify({ error: 'Not found!' }));
})

// 500 catchall route
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(JSON.stringify({ error: 'Something broke!' }));
})

// Start listener loop
app.listen(LISTENER_PORT, LISTENER_ADDRESS);
console.log(`Listening on http://${LISTENER_ADDRESS}:${LISTENER_PORT}`);
