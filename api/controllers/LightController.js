module.exports = {

  status: (req, res) => {
    Light.findOne({ id: req.params.id, type: 'Light' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Light with id ${req.params.id} not found` })
      }
      console.log(`STATUS requested for ${device.name}`)
      device.getStatus().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  on: (req, res) => {
    Light.findOne({ id: req.params.id, type: 'Light' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Light with id ${req.params.id} not found` })
      }
      console.log(`ON command received for ${device.name}`)
      device.turnOn().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  off: (req, res) => {
    Light.findOne({ id: req.params.id, type: 'Light' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Light with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${device.name}`)
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  }
}
