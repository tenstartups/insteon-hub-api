var insteon = require('./insteon')
var SSDP = require('node-ssdp').Server

const DEVICE_USN = 'urn:schemas-upnp-org:device:InsteonServer:1'
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'
const LISTEN_PORT = process.env.LISTEN_PORT;

// Determine the listner address to use
advertise_address = require('ip').address()
var ifaces = require('os').networkInterfaces()
Object.keys(ifaces).forEach(dev => {
  ifaces[dev].filter(details => {
    if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
      advertise_address = details.address
    }
  })
})

let hub
insteon.hub().then(result => { console.log(result); hub = result })
console.log(hub)

var location = `http://${advertise_address}:${LISTEN_PORT}/api/devices`
var udn = `insteon:${insteon.hub().id}`
var ssdp = new SSDP({ location: location, udn: udn, sourcePort: 1900 })

ssdp.addUSN(DEVICE_USN)

ssdp.on('advertise-alive', (headers) => {
  // Expire old devices from your cache.
  // Register advertising device somewhere (as designated in http headers heads)
})

ssdp.on('advertise-bye', (headers) => {
  // Remove specified device from cache.
})

ssdp.start()

process.on('exit', () => {
  // Advertise shutting down and stop listening
  ssdp.stop()
})

console.log(`SSDP server advertising for UDN ${udn} at ${location}`)
