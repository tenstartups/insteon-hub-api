var SSDP = require('node-ssdp').Server
const camelCase = require('uppercamelcase')

const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

var locationAddress
var locationPort
var ssdpServers = {}

function startServer (device) {
  var hub = sails.hooks.insteon.hub()
  var usn = `urn:schemas-upnp-org:device:Insteon${camelCase(device.type)}:1`
  var udn = `insteon:${hub.instanceId()}:hub:${hub.insteonId}:${device.type}:${device.insteonId}`
  var location = `http://${locationAddress}:${locationPort}/api/device/${device.insteonId}`

  console.log(`Starting SSDP server advertising for USN: ${usn}, UDN: ${udn}, Location: ${location}...`)

  var ssdp = new SSDP({ location: location, udn: udn, sourcePort: 1900 })

  ssdpServers[device.insteonId] = ssdp

  ssdp.addUSN(usn)

  ssdp.on('advertise-alive', (headers) => {
    // Expire old devices from your cache.
    // Register advertising device somewhere (as designated in http headers heads)
    // console.log(`Advertise alive for USN: ${usn}, UDN: ${udn}, Location: ${location}`)
  })

  ssdp.on('advertise-bye', (headers) => {
    // Remove specified device from cache.
    // console.log(`Advertise bye for USN: ${usn}, UDN: ${udn}, Location: ${location}`)
  })

  ssdp.start()

  process.on('exit', () => {
    // Advertise shutting down and stop listening
    ssdp.stop()
  })

  console.log(`Started SSDP server advertising for USN: ${usn}, UDN: ${udn}, Location: ${location}`)
}

module.exports = (sails) => {
  return {
    servers: () => {
      return ssdpServers
    },

    configure: () => {
      // Determine the listener address and port to use
      locationAddress = process.env.SSDP_LOCATION_ADDRESS
      if (locationAddress === undefined) {
        locationAddress = require('ip').address()
        var ifaces = require('os').networkInterfaces()
        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].filter(details => {
            if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
              locationAddress = details.address
            }
          })
        })
      }
      locationPort = process.env.SSDP_LOCATION_PORT
      if (locationPort === undefined) {
        locationPort = sails.config.port
      }
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 60000
       }
    },

    start (device) {
      startServer(device)
    },

    initialize: (cb) => {
      sails.after('hook:insteon:loaded', () => {
        console.log(`Starting SSDP advertisement for all devices...`)

        Device.find().populate('hub').exec((err, devices) => {
          if (err) {
            console.log(`Error loading devices for SSDP advertisement`)
            console.log(err)
            return
          }
          devices.forEach(device => { startServer(device) })
        })

        console.log(`Started SSDP advertisement for all devices`)

        // Finish initializing custom hook
        // Then call cb()
        return cb()
      })
    }
  }
}
