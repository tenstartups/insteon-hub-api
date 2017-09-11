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
          return res.json({ insteonId: insteonId, status: 'off' })
        } else {
          console.log(`[${insteonId}] Switch is ON`)
          return res.json({ insteonId: insteonId, status: 'on' })
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
        return res.json({ insteonId: insteonId, command: 'on' })
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
        return res.json({ insteonId: insteonId, command: 'off' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
