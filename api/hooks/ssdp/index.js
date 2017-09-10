var SSDP = require('node-ssdp').Server

const DEVICE_USN = 'urn:schemas-upnp-org:device:Insteon:1'
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

var locationAddress
var locationPort
var ssdpServers = {}

function startServer (insteonId) {
  var hubId = `${sails.hooks.insteon_hub.client().insteonId}`
  var location = `http://${locationAddress}:${locationPort}/api/device/${insteonId}`
  var udn = `insteon:${hubId}:${insteonId}`

  console.log(`Starting SSDP server advertising for UDN ${udn} at ${location}...`)

  var ssdp = new SSDP({ location: location, udn: udn, sourcePort: 1900 })
  ssdpServers[insteonId] = ssdp

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

  console.log(`Started SSDP server advertising for UDN ${udn} at ${location}`)
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

    defaults: () => {
    },

    startServer (insteonId) {
      startServer(insteonId)
    },

    initialize: (cb) => {
      sails.after('hook:insteon_hub:loaded', () => {
        console.log(`Starting SSDP advertisement for all devices...`)

        Device.find().exec((err, devices) => {
          if (err) {
            console.log(`Error loading devices for SSDP advertisement`)
            console.log(err)
            return
          }
          devices.forEach(device => { startServer(device.insteon_id) })
        })

        console.log(`Started SSDP advertisement for all devices`)

        // Finish initializing custom hook
        // Then call cb()
        return cb()
      })
    }
  }
}
