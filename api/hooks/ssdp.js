require('events').EventEmitter.defaultMaxListeners = 255
var macaddress = require('macaddress')

const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

module.exports = (sails) => {
  var servers = new Map()
  var advertiseIP
  var advertisePort
  var advertiseMAC

  return {
    servers: () => {
      return servers
    },

    advertiseIP: function () {
      return advertiseIP
    },

    advertisePort: function () {
      return advertisePort
    },

    advertiseMAC: function () {
      return advertiseMAC
    },

    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 30000
       }
    },

    initialize: (cb) => {
      sails.after('hook:device_update:loaded', () => {
        advertiseIP = process.env.DEVICE_ADVERTISE_IP
        if (advertiseIP === undefined) {
          advertiseIP = require('ip').address()
          var ifaces = require('os').networkInterfaces()
          Object.keys(ifaces).forEach(dev => {
            ifaces[dev].filter(details => {
              if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
                advertiseIP = details.address
              }
            })
          })
        }

        advertisePort = process.env.DEVICE_ADVERTISE
        if (advertisePort === undefined) {
          advertisePort = sails.config.port
        }

        macaddress.one(LISTEN_INTERFACE, (err, mac) => {
          if (err) {
            throw err
          }
          advertiseMAC = mac.toUpperCase().replace(/:/g, '')

          console.log('Starting device SSDP advertisement servers...')
          Device.find({ isAdvertised: true }).exec((err, devices) => {
            if (err) {
              console.log('Error retrieving device records')
              throw err
            }
            devices.forEach(device => {
              servers[device.id] = device.ssdpAdvertise()
            })
            console.log('Started device SSDP advertisement servers')

            return cb()
          })
        })
      })
    }
  }
}
