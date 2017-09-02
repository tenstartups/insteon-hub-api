'use strict';

// Load libraries
var
  express = require('express'),
  Insteon = require('home-controller').Insteon,
  JsonDB = require('node-json-db'),
  SSDP = require('node-ssdp').Server,
  uuidv4 = require('uuid/v4');

// Define constants
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0';
const LISTEN_ADDRESS = '0.0.0.0';
const LISTEN_PORT = process.env.LISTEN_PORT;
const DEVICE_USN = 'urn:schemas-upnp-org:device:InsteonHubAPI:1';

// Load configuration
console.log(`Loading configuration from ${process.env.CONFIG_FILE}...`)
try {
  var config = require('js-yaml').safeLoad(require('fs').readFileSync(process.env.CONFIG_FILE, 'utf8'));
  console.log(`Loaded configuration from ${process.env.CONFIG_FILE}`)
} catch (e) {
  console.log(e);
}

// Initializing database
console.log(`Loading database from ${process.env.DATABASE_FILE}...`)
var db = new JsonDB(process.env.DATABASE_FILE, true, true);
console.log(`Loaded database from ${process.env.DATABASE_FILE}`)

// Determine the listen interface
const ifaces = require('os').networkInterfaces();
let address;
Object.keys(ifaces).forEach(dev => {
  ifaces[dev].filter(details => {
    if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
      address = details.address;
    }
  });
});
address = address || require('ip').address();

// Get or generate a unique ID for the Hub
let udn;
try {
  udn = db.getData('/hub/udn');
} catch(error) {
  udn = uuidv4();
  console.log(`Generated new udn ${udn}`);
  db.push('/hub/udn', udn);
};

// Start SSDP advertisement
console.log(`Starting SSDP server...`)
var ssdp = new SSDP(
  {
    location: `http://${address}:${LISTEN_PORT}/api/discovery`,
    udn: udn,
    sourcePort: 1900
  }
);
ssdp.addUSN(DEVICE_USN);
ssdp.on('advertise-alive', (headers) => {
  // Expire old devices from your cache.
  // Register advertising device somewhere (as designated in http headers heads)
});
ssdp.on('advertise-bye', (headers) => {
  // Remove specified device from cache.
});
ssdp.start();
process.on('exit', () => {
  // Advertise shutting down and stop listening
  ssdp.stop()
})
console.log(`Started SSDP server`)

// Insteon connector
console.log(`Connecting to Insteon Hub at ${config.hub.host}:${config.hub.port}...`);
var hub = new Insteon();
hub.httpClient(config.hub, () => {
  console.log(`Connected to Insteon Hub at ${config.hub.host}:${config.hub.port}`);

  // Subscribe for switch events
  config.devices.switch.forEach(attrs => {
    console.log(`[${attrs.insteon_id}] Subscribing to light switch events...`);
    var light = hub.light(attrs.insteon_id);
    light.on('turnOn', () => {
      console.log(`[${attrs.insteon_id}] Light turned ON`)
    });
    light.on('turnOff', () => {
      console.log(`[${attrs.insteon_id}] Light turned OFF`)
    });
    console.log(`[${attrs.insteon_id}] Subscribed to light switch events`)
  });

});

// App
var app = express();

// Device discovery route
app.get('/api/discovery', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Device discovery request from ${ip}...`);
  var discovery_response = JSON.parse(JSON.stringify(config.devices));
  discovery_response.forEach((device) => { device.udn = `${udn}:${device.insteon_id}`; });
  res.status(200).send(JSON.stringify(discovery_response));
});

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
console.log(`Starting HTTP API server...`);
app.listen(LISTEN_PORT, LISTEN_ADDRESS);
console.log(`Listening on http://${LISTEN_ADDRESS}:${LISTEN_PORT}`);
