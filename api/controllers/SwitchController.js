module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving switch status...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.getStatus()
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
      device.turnOff()
      return res.json({ insteon_id: insteonId, command: req.options.action })
    })
  }
}
