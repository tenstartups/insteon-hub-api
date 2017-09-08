module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Retrieving light level...`)
    var light = hub.light(insteonId)
    light.level()
    .then((result) => {
      if (result === undefined) {
        return unknownDevice(res, insteonId)
      } else {
        console.log(`[${insteonId}] Light level is ${result}`)
        return res.json({ insteon_id: insteonId, level: result })
      }
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Turning light ON...`)
    var light = hub.light(insteonId)
    light.turnOn()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ insteon_id: insteonId, command: 'on' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Turning light OFF...`)
    var light = hub.light(insteonId)
    light.turnOff()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ insteon_id: insteonId, command: 'off' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  level: (req, res) => {
    var insteonId = req.params.insteon_id
    var level = req.params.level
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Setting light level to ${level}...`)
    var light = hub.light(insteonId)
    light.level(level)
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ insteon_id: insteonId, command: `level_${level}` })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  brighten: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Brightening light...`)
    var light = hub.light(insteonId)
    light.brighten()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ insteon_id: insteonId, command: 'brighten' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  dim: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Dimming light...`)
    var light = hub.light(insteonId)
    light.dim()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ insteon_id: insteonId, command: 'dim' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
