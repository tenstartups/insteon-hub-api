module.exports = (sails) => {
  var singleton

  return {
    singleton: () => {
      return singleton
    },

    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 30000
       }
    },

    initialize: (cb) => {
      sails.after('hook:orm:loaded', () => {
        Server.initSingleton().then(result => {
          singleton = result
          return cb()
        }, reason => {
          throw reason
        })
      })
    }
  }
}
