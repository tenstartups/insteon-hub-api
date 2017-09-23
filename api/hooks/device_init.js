var ISY = require('isy-js')

module.exports = (sails) => {
  return {
    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 30000
       }
    },

    initialize: (cb) => {
      sails.after('hook:device_cleanup:loaded', () => {
        console.log('Initializing device records...')
        var deviceList = sails.hooks.isy.connection().getDeviceList()
        Device.findOrCreate(
          deviceList.map(d => { return { isyAddress: d.address } }),
          deviceList.map(d => { return { isyAddress: d.address, isyType: d.deviceType, name: d.name } })
        ).exec((err, records) => {
          if (err) {
            console.log(`Error initializing device records`)
            throw err
          }
          console.log(`Initialized ${records.length} device records`)
          return cb()
        })
      })
    }
  }
}
