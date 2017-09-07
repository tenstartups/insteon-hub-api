var db = require('./db')
var insteon = require('./insteon')

Object.keys(db.getData('/devices')).forEach(insteon_id => {

  attrs = db.getData(`/devices/${insteon_id}`)

  console.log(`[${insteon_id}] Subscribing to light switch events...`)
  var light = hub.light(insteon_id)

  light.on('turnOn', () => {
    console.log(`[${insteon_id}] Light turned ON`)
  })

  light.on('turnOff', () => {
    console.log(`[${insteon_id}] Light turned OFF`)
  })

  console.log(`[${insteon_id}] Subscribed to light switch events`)
})
