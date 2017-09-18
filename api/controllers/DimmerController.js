module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving dimmer status...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.getStatus()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning dimmer ON...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOn()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning dimmer OFF...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOff()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  level: (req, res) => {
    var insteonId = req.params.insteonId
    var level = req.params.level
    console.log(`[${insteonId}] Setting dimnmer level to ${level}%...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.setLevel(level)
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  brighten: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Brightening dimmer...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.brighten()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  dim: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Lowering dimmer...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.dim()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
