var SSDP = require('node-ssdp').Server
const camelCase = require('uppercamelcase')

module.exports = {

  initSingleton: function () {
    return new Promise((resolve, reject) => {
      console.log('Initializing discovery servers...')
      var discovery = new Discovery._model({})
      discovery.start()
      .then(discovery => {
        console.log('Initialized discovery servers')
        resolve(discovery)
      })
      .catch(reason => {
        console.log('Error initializing discovery servers')
        reject(reason)
      })
      resolve(discovery)
    })
  },

  attributes: {
    ssdpServers: {
      type: 'array'
    },

    server: function () {
      return sails.hooks.server.singleton()
    },

    hub: function () {
      return sails.hooks.hub.singleton()
    },

    start: function () {
      return new Promise((resolve, reject) => {
        console.log(`Starting SSDP advertisement for all devices...`)

        Device.find().exec((err, devices) => {
          if (err) {
            console.log(`Error loading devices for SSDP advertisement`)
            reject(err)
          }
          devices.forEach(device => { this.startFor(device) })
          console.log(`Started SSDP advertisement for all devices`)
          resolve(devices)
        })
      })
    },

    startFor: function (device) {
      var usn = `urn:schemas-upnp-org:device:Insteon${camelCase(device.type)}:1`
      var udn = `insteon:${this.server().instanceId}:hub:${this.hub().insteonId}:${device.type}:${device.insteonId}`
      var location = `http://${this.server().advertiseIP()}:${this.server().advertisePort()}/api/device/${device.insteonId}`

      console.log(`Starting SSDP server advertising for USN: ${usn}, UDN: ${udn}, Location: ${location}...`)

      var ssdp = new SSDP({ location: location, udn: udn, sourcePort: 1900 })

      this.ssdpServers << ssdp

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
  }
}
