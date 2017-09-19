module.exports = {
  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving switch status...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with Insteon ID ${insteonId} not found` })
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
    console.log(`[${insteonId}] Sending switch refresh command...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with Insteon ID ${insteonId} not found` })
      }
      device.refresh()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  on: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning switch ON...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with Insteon ID ${insteonId} not found` })
      }
      device.turnOn()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning switch OFF...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with Insteon ID ${insteonId} not found` })
      }
      device.turnOff()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
