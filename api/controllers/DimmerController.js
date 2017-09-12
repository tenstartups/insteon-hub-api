module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving dimmer status...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.getStatus().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning dimmer ON...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOn().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning dimmer OFF...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
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
      device.setLevel(level).then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  },

  brighten: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Brightening dimmer...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.brighten().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  },

  dim: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Lowering dimmer...`)
    Dimmer.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.dim().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
