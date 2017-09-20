module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving dimmer status...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
      }
      device.getStatus().then(result => {
        return res.json({ device: device, result: result })
      }, reason => {
        return res.serverError(reason)
      })
    })
  },

  refresh: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Sending dimmer refresh command...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
      }
      device.refresh()
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
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
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
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
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
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
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
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
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
      if (!device) {
        return res.notFound({ error: `Dimmer with Insteon ID ${insteonId} not found` })
      }
      device.dim()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
