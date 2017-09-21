module.exports = {

  show: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Retrieving device links...`)
    Device.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Device with Insteon ID ${insteonId} not found` })
      }
      device.getLinks().then(result => {
        return res.json({ device: device, result: result })
      }, reason => {
        return res.serverError(reason)
      })
    })
  },

  create: (req, res) => {
    var insteonId = req.params.insteonId
    console.log(`[${insteonId}] Linking device to hub...`)
    Device.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Device with Insteon ID ${insteonId} not found` })
      }
      device.linkToHub().then(result => {
        return res.json({ device: device, result: result })
      }, reason => {
        return res.serverError(reason)
      })
    })
  }
}
