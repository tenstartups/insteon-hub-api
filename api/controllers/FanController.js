module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving fan status...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
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
    console.log(`[${insteonId}] Retrieving fan status...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.refresh()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan off...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.off()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  low: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to low...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.low()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  medium: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to medium...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.medium()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  high: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning fan to high...`)
    Fan.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.high()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
