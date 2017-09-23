var ISY = require('isy-js')

module.exports = (sails) => {
  var connection

  return {
    connection: () => {
      return connection
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
        console.log('Connecting to ISY994i home automation controller...')

        var settings = require('js-yaml')
                       .safeLoad(require('fs')
                       .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                       .isy

        connection = new ISY.ISY(
          settings.address,
          settings.user,
          settings.password,
          false, // No support for ELK
          (isy, device) => {
            Device.findTypedDevice(device)
            .then(result => {
              result.sendSmartThingsUpdate()
            })
            .catch(err => {
              throw err
            })
          },
          settings.useSSL,
          true, // Include scenes in the device list
          settings.debug,
          (isy, device) => {} // Variable changed callback
        )

        connection.initialize(() => {
          console.log('Connected to ISY994i home automation controller')
          return cb()
        })
      })
    }
  }
}
