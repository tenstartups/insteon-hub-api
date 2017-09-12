module.exports = (sails) => {
  return {
    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 60000
       }
    },

    initialize: (cb) => {
      sails.after(['hook:orm:loaded', 'hook:insteon_hub:loaded'], () => {
        var hub = sails.hooks.insteon_hub.client()

        console.log(`Subscribing to Insteon device events...`)

        Device.find().exec((err, devices) => {
          if (err) {
            console.log(`Error loading devices for event subscription`)
            console.log(err)
            return
          }
          devices.forEach(device => {
            // console.log(`[${device.insteonId}] Subscribing to light switch events...`)
            // var light = hub.light(device.insteonId)
            //
            // light.on('turnOn', () => {
            //   console.log(`[${device.insteonId}] Light turned ON`)
            // })
            //
            // light.on('turnOff', () => {
            //   console.log(`[${device.insteonId}] Light turned OFF`)
            // })
            //
            // console.log(`[${device.insteonId}] Subscribed to light switch events`)
          })
        })

        console.log(`Finished subscribing to Insteon device events`)

        // Finish initializing custom hook
        // Then call cb()
        return cb()
      })
    }
  }
}
