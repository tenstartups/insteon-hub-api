var settings = require('./settings')
var Insteon = require('home-controller').Insteon

const connectHub = new Promise((resolve, reject) => {
  var hub = new Insteon()
  hub.httpClient(settings.hub, () => {
    console.log(`Connected to Insteon Hub at ${settings.hub.host}:${settings.hub.port}`)
    hub.info()
    .then(hubInfo => {
      hub.info = hubInfo
      resolve(hub)
    })
  })
})

let insteon_hub
connectHub.then(result => { insteon_hub = result })

module.exports = insteon_hub
