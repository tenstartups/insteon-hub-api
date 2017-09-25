module.exports = {

  status: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      console.log(`STATUS requested for ${device.type} (${device.name})`)
      device.getStatus().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  on: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      console.log(`ON command received for ${device.type} (${device.name})`)
      device.turnOn().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  off: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${device.type} (${device.name})`)
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  }
}
