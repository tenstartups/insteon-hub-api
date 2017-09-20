module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving fan dimmer status...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
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
    console.log(`[${insteonId}] Sending fan dimmer refresh command...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.refresh()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  lightOn: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan dimmer ON...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.turnLightOn()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  lightOff: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan dimmer OFF...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.turnLightOff()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  lightLevel: (req, res) => {
    var insteonId = req.params.insteonId
    var level = req.params.level
    console.log(`[${insteonId}] Setting dimnmer level to ${level}%...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.setLightLevel(level)
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  brightenLight: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Brightening fan dimmer...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.brightenLight()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  dimLight: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Lowering fan dimmer...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan controller with Insteon ID ${insteonId} not found` })
      }
      device.dimLight()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  fanOff: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan off...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with Insteon ID ${insteonId} not found` })
      }
      device.turnFanOff()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  fanLow: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to low...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with Insteon ID ${insteonId} not found` })
      }
      device.turnFanLow()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  fanMedium: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to medium...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with Insteon ID ${insteonId} not found` })
      }
      device.turnFanMedium()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  fanHigh: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to high...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with Insteon ID ${insteonId} not found` })
      }
      device.turnFanHigh()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
