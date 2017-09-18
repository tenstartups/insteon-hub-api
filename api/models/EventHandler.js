module.exports = {

  initSingleton: function () {
    return new Promise((resolve, reject) => {
      console.log('Initializing device event handlers...')
      var eventHandler = new EventHandler._model({})
      eventHandler.start()
      .then(discovery => {
        console.log('Initialized device event handlers')
        resolve(discovery)
      })
      .catch(reason => {
        console.log('Error initializing device event handlers')
        reject(reason)
      })
      resolve(eventHandler)
    })
  },

  attributes: {
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
            console.log(`Error loading switch devices for event subscription`)
            reject(err)
          }
          switches.forEach(relay => { relay.subscribeEvents() })
        })

        Dimmer.find({ type: 'dimmer' }).exec((err, dimmers) => {
          if (err) {
            console.log(`Error loading dimmer devices for event subscription`)
            reject(err)
          }
          dimmers.forEach(dimmer => { dimmer.subscribeEvents() })
        })

        Fan.find({ type: 'fan' }).exec((err, fans) => {
          if (err) {
            console.log(`Error loading fan devices for event subscription`)
            reject(err)
          }
          fans.forEach(fan => { fan.subscribeEvents() })
        })

        console.log(`Finished subscribing to Insteon device events`)

        resolve()
      })
    }
  }
}
