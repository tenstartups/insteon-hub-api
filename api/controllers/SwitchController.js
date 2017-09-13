module.exports = {

  status: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving switch status...`)
    Switch.findOne({ insteonId: insteonId }).populate('hub').exec((err, device) => {
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

  on: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning switch ON...`)
    Switch.findOne({ insteonId: insteonId }).populate('hub').exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOn().then(result => {
        return res.json({ device: device, result: result })
      }, reason => {
        return res.serverError(reason)
      })
    })
  },

  off: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Turning switch OFF...`)
    Switch.findOne({ insteonId: insteonId }).populate('hub').exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }, reason => {
        return res.serverError(reason)
      })
    })
  }
}
