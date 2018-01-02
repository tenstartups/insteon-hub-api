const WebSocket = require('ws')
const xmlToJS = require('xml2js').parseString

const QUEUE = require('queue')
const ISY_SETTINGS = require('js-yaml')
                     .safeLoad(require('fs')
                     .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                     .isy || {}

module.exports = (sails) => {
  return {
    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 120000
       }
    },

    initialize: (cb) => {
      return cb()
      sails.after('hook:orm:loaded', () => {
        var auth = ISY_SETTINGS.username + ':' + ISY_SETTINGS.password
        var url = 'ws://' + auth + '@' + ISY_SETTINGS.address + '/rest/subscribe'

        var ws = new WebSocket(url, 'ISYSUB', {
          origin: 'com.universal-devices.websockets.isy',
          protocolVersion: 13
        })

        ws.on('open', () => {
          console.log('connected')
          cb()
        })

        ws.on('close', () => {
          console.log('disconnected')
        })

        ws.on('message', (data, flags) => {
          xmlToJS(data, (err, result) => {
            if (err) { throw err }
            console.log(`ISY994 EVENT: ${JSON.stringify(result)}`)
          })
        })

        ws.on('error', error => {
          console.log(error)
        })
      })
    }
  }
}
