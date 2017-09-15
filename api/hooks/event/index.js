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
      sails.after('hook:insteon:loaded', () => {
        console.log(`Subscribing to Insteon device events...`)

        Switch.find({ type: 'switch' }).exec((err, switches) => {
          if (err) {
            console.log(`Error loading switch devices for event subscription`)
            console.log(err)
            return
          }
          switches.forEach(relay => { relay.subscribeEvents() })
        })
        Dimmer.find({ type: 'dimmer' }).exec((err, dimmers) => {
          if (err) {
            console.log(`Error loading dimmer devices for event subscription`)
            console.log(err)
            return
          }
          dimmers.forEach(dimmer => { dimmer.subscribeEvents() })
        })
        Fan.find({ type: 'fan' }).exec((err, fans) => {
          if (err) {
            console.log(`Error loading fan devices for event subscription`)
            console.log(err)
            return
          }
          fans.forEach(fan => { fan.subscribeEvents() })
        })

        console.log(`Finished subscribing to Insteon device events`)

        // Finish initializing custom hook
        // Then call cb()
        return cb()
      })
    }
  }
}
