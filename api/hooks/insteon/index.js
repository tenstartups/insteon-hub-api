module.exports = (sails) => {
  var Insteon = require('home-controller').Insteon

  var hub

  function connectToHub () {
    return new Promise((resolve, reject) => {
      var settings = require('js-yaml')
                     .safeLoad(require('fs')
                     .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                     .hub
      var client = new Insteon()
      console.log(`Connecting to Insteon Hub (2245) at ${settings.host}:${settings.port}...`)
      client.httpClient(settings, () => {
        console.log(`Connected to Insteon Hub (2245) at ${settings.host}:${settings.port}`)
        console.log(`Retrieving Insteon Hub (2245) information...`)
        client.info()
        .then(hubInfo => {
          console.log(`Retrieved Insteon Hub (2245) information [${hubInfo.id}]`)
          resolve([hubInfo.id, client])
        }, reason => {
          reject(new Error(`Unable to connect to Insteon Hub (2245) at ${settings.host}:${settings.port}`))
        })
      })
    })
  }

  return {
    hub: () => {
      return hub
    },

    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 60000
       }
    },

    initialize: (cb) => {
      sails.after('hook:orm:loaded', () => {
        connectToHub().then(result => {
          console.log('Initializing hub record...')
          Hub.findOrCreate({ insteonId: result[0] }).exec((err, record) => {
            if (err) {
              throw err
            } else {
              hub = record
              hub._insteonClient = result[1]
              console.log('Initialized hub record')
              return cb()
            }
          })
        }, reason => {
          throw new Error('Error connecting to hub')
        })
      })
    }
  }
}
