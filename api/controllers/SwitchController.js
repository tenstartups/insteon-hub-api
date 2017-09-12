module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving switch status...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
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
    console.log(`[${insteonId}] Turning switch ON...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
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
    console.log(`[${insteonId}] Turning switch OFF...`)
    Switch.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(err => {
        return res.serverError(err)
      })
    })
  }
}
