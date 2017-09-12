module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Retrieving switch status...`)
    var relay = hub.light(insteonId)
    relay.level()
    .then((result) => {
      if (result === undefined) {
        return unknownDevice(res, insteonId)
      } else {
        if (result === 0) {
          console.log(`[${insteonId}] Switch is OFF`)
          return res.json({ device: relay, command: 'status', status: 'off' })
        } else {
          console.log(`[${insteonId}] Switch is ON`)
          return res.json({ device: relay, command: 'status', status: 'on' })
        }
      }
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Turning switch ON...`)
    var relay = hub.light(insteonId)
    relay.turnOn()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: relay, command: 'on', status: 'on' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Turning switch OFF...`)
    var relay = hub.light(insteonId)
    relay.turnOff()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: relay, command: 'off', status: 'off' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  subscribe: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    var relay = hub.light(insteonId)
    console.log(`[${insteonId}] Subscribing to switch events...`)
    relay.on('turnOn', () => {
      console.log(`[${insteonId}] Light turned ON`)
    })
    relay.on('turnOff', () => {
      console.log(`[${insteonId}] Light turned OFF`)
    })
    console.log(`[${insteonId}] Subscribed to switch events...`)
    return res.json({ device: relay, command: 'subscribe' })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
