require('events').EventEmitter.defaultMaxListeners = 255

module.exports = (sails) => {
  var servers = new Map()

  return {
    servers: () => {
      return servers
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
    }
  }
}
