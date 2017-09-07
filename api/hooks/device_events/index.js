module.exports = (sails) => {
  return {
    configure: () => {
    },

    defaults: () => {
    },

    initialize: (cb) => {
      sails.after(['hook:orm:loaded', 'hook:insteon_hub:loaded'], () => {
        var hub = sails.hooks.insteon_hub.client()

        console.log(`Subscribing to Insteon device events...`)

        Device.find().exec((err, records) => {
          if (err) {
            console.log(`Error subscribing to light switch events...`)
            console.log(err)
            return
          }
          records.forEach(device => {
            console.log(`[${device.insteon_id}] Subscribing to light switch events...`)
            var light = hub.light(device.insteon_id)

            light.on('turnOn', () => {
              console.log(`[${device.insteon_id}] Light turned ON`)
            })

            light.on('turnOff', () => {
              console.log(`[${device.insteon_id}] Light turned OFF`)
            })

            console.log(`[${device.insteon_id}] Subscribed to light switch events`)
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
