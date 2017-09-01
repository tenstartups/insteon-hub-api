'use strict';

// Load libraries
var express = require('express'),
    Insteon = require('home-controller').Insteon,
    SSDP = require('node-ssdp').Server,
    fs = require('fs'),
    uuidv4 = require('uuid/v4'),
    yaml = require('js-yaml');

// Define constants
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0';
const LISTEN_ADDRESS = '0.0.0.0';
const LISTEN_PORT = process.env.LISTEN_PORT;
const DEVICE_USN = 'urn:schemas-upnp-org:device:InsteonHubAPI:1';

// Load configuration
console.log(`Loading configuration from ${process.env.CONFIG_FILE}...`)
try {
  var config = yaml.safeLoad(fs.readFileSync(process.env.CONFIG_FILE, 'utf8'));
  console.log(`Loaded configuration from ${process.env.CONFIG_FILE}`)
} catch (e) {
  console.log(e);
}

// Get the listen interface
const ifaces = require('os').networkInterfaces();
let address;
Object.keys(ifaces).forEach(dev => {
  ifaces[dev].filter(details => {
    if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
      address = details.address;
    }
  });
});

// Start SSDP advertisement
console.log(`Starting SSDP server...`)
var udn = uuidv4();
console.log(`Generated new udn ${udn}`);
var ssdp = new SSDP({location: `http://${address}:${LISTEN_PORT}/upnp/desc`, udn: `uuid:${udn}`, sourcePort: 1900});
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
console.log(`Connecting to Insteon Hub at ${config.insteon_hub.host}:${config.insteon_hub.port}...`);
var hub = new Insteon();
hub.httpClient(config.insteon_hub, () => {
  console.log(`Connected to Insteon Hub at ${config.insteon_hub.host}:${config.insteon_hub.port}`);

  // Subscribe for device events
  config.light_switches.forEach(attrs => {
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

// UPNP description route
app.get('/upnp/desc', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var agent = req.headers['user-agent'];
  console.log(`UPnP description request from ${ip}[${agent}]...`)
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(JSON.stringify({ status: 'OK' }));
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
