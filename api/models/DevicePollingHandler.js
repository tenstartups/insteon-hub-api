module.exports = {

  initSingleton: function () {
    return new Promise((resolve, reject) => {
      console.log('Initializing device polling handlers...')
      var pollingHandler = new DevicePollingHandler._model({})
      pollingHandler.start()
      .then(discovery => {
        console.log('Initialized device polling handlers')
        resolve(discovery)
      })
      .catch(reason => {
        console.log('Error initializing device polling handlers')
        reject(reason)
      })
      resolve(pollingHandler)
    })
  },

  attributes: {
    handlers: {
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
        console.log(`Subscribing to Insteon device events...`)

        Switch.find({ type: 'switch' }).exec((err, switches) => {
          if (err) {
            console.log(`Error loading switch devices for polling`)
            reject(err)
          }
          switches.forEach(relay => { relay.startPolling() })
        })

        Dimmer.find({ type: 'dimmer' }).exec((err, dimmers) => {
          if (err) {
            console.log(`Error loading dimmer devices for polling`)
            reject(err)
          }
          dimmers.forEach(dimmer => { dimmer.startPolling() })
        })

        Fan.find({ type: 'fan' }).exec((err, fans) => {
          if (err) {
            console.log(`Error loading fan devices for polling`)
            reject(err)
          }
          fans.forEach(fan => { fan.startPolling() })
        })

        console.log(`Finished subscribing to Insteon device events`)

        resolve()
      })
    }
  }
}
