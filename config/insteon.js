var settings = require('./settings')
var Insteon = require('home-controller').Insteon

module.exports = new Promise((resolve, reject) => {
  var hub = new Insteon()
  hub.httpClient(settings.hub, () => {
    console.log(`Connected to Insteon Hub at ${settings.hub.host}:${settings.hub.port}`)

    hub.info()
    .then(hubInfo => {
      hub.id = hubInfo.id
      resolve(hub)
    })
  })
})
