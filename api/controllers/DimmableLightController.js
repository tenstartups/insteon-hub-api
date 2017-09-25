module.exports = {

  status: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
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
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
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
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${device.type} (${device.name})`)
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  level: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      console.log(`LEVEL (${req.params.level}) command received for ${device.type} (${device.name})`)
      device.setLevel(req.params.level).then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  brighten: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      console.log(`BRIGHTEN command received for ${device.type} (${device.name})`)
      device.brighten().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  dim: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, type: 'DimmableLight' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      console.log(`DIM command received for ${device.type} (${device.name})`)
      device.dim().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  }
}
