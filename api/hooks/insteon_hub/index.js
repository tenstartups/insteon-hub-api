module.exports = (sails) => {
  var Insteon = require('home-controller').Insteon
  var settings
  var client
  return {
    client: () => {
      return client
    },

    configure: () => {
      settings = require('js-yaml')
                 .safeLoad(require('fs')
                 .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                 .hub
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 60000
       }
    },

    initialize: (cb) => {
      client = new Insteon()
      console.log(`Connecting to Insteon Hub (2245) at ${settings.host}:${settings.port}...`)
      client.httpClient(settings, () => {
        console.log(`Connected to Insteon Hub (2245) at ${settings.host}:${settings.port}`)
        console.log(`Retrieving Insteon Hub (2245) information...`)
        client.info()
        .then(hubInfo => {
          client.insteonId = hubInfo.id
          console.log(`Retrieved Insteon Hub (2245) information [${client.insteonId}]`)
          return cb()
        })
      })
    }
  }
}
