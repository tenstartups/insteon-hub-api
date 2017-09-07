var SSDP = require('node-ssdp').Server

const DEVICE_USN = 'urn:schemas-upnp-org:device:InsteonServer:1'
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

module.exports = (sails) => {
  var advertiseIP
  var ssdp

  return {
    server: () => {
      return ssdp
    },

    configure: () => {
      // Determine the listener address to use
      advertiseIP = require('ip').address()
      var ifaces = require('os').networkInterfaces()
      Object.keys(ifaces).forEach(dev => {
        ifaces[dev].filter(details => {
          if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
            advertiseIP = details.address
          }
        })
      })
    },

    defaults: () => {
    },

    initialize: (cb) => {
      sails.after('hook:insteon_hub:loaded', () => {
        var location = `http://${advertiseIP}:${sails.config.port}/api/devices`
        var udn = `insteon_hub:${sails.hooks.insteon_hub.client().info.id}`

        console.log(`Starting SSDP server advertising ${udn} at ${location}...`)

        ssdp = new SSDP({ location: location, udn: udn, sourcePort: 1900 })

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

        // Finish initializing custom hook
        // Then call cb()
        return cb()
      })
    }
  }
}
