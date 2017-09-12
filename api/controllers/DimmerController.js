module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Retrieving dimmer level...`)
    var dimmer = hub.light(insteonId)
    dimmer.level()
    .then((result) => {
      if (result === undefined) {
        return unknownDevice(res, insteonId)
      } else {
        var level = parseInt(result)
        console.log(`[${insteonId}] Dimmer level is ${result}`)
        return res.json({ device: dimmer, command: 'status', status: (level === 0 ? 'off' : 'on'), level: level })
      }
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Setting dimmer level to 100%...`)
    var dimmer = hub.light(insteonId)
    dimmer.turnOn()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: dimmer, command: 'on', status: 'on' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Setting dimmer level to 0%...`)
    var dimmer = hub.light(insteonId)
    dimmer.turnOff()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: dimmer, command: 'off', status: 'off' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  level: (req, res) => {
    var insteonId = req.params.insteonId
    var level = req.params.level
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Setting dimnmer level to ${level}%...`)
    var dimmer = hub.light(insteonId)
    dimmer.level(level)
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: dimmer, command: 'level', status: (level === 0 ? 'off' : 'on'), level: level })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  brighten: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Increasing dimmer level...`)
    var dimmer = hub.light(insteonId)
    dimmer.brighten()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: dimmer, command: 'brighten' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  },

  dim: (req, res) => {
    var insteonId = req.params.insteonId
    var hub = sails.hooks.insteon_hub.client()
    console.log(`[${insteonId}] Reducing dimmer level...`)
    var dimmer = hub.light(insteonId)
    dimmer.dim()
    .then((result) => {
      if (result.response) {
        console.log(`[${insteonId}] Response: ${JSON.stringify(result.response)}`)
        return res.json({ device: dimmer, command: 'dim' })
      } else {
        return unknownDevice(res, insteonId)
      }
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
