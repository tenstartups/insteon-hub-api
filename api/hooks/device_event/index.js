module.exports = (sails) => {
  var singleton

  return {
    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 30000
       }
    },

    initialize: (cb) => {
      sails.after(['hook:orm:loaded', 'hook:server:loaded', 'hook:hub:loaded'], () => {
        DeviceEventHandler.initSingleton().then(result => {
          singleton = result
          return cb()
        }, reason => {
          throw reason
        })
      })
    }
  }
}
