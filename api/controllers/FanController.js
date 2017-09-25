module.exports = {

  status: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`STATUS requested for ${device.type} (${device.name})`)
      device.getStatus().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  off: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${device.type} (${device.name})`)
      device.turnOff().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  low: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`LOW command received for ${device.type} (${device.name})`)
      device.setLow().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  medium: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`MEDIUM command received for ${device.type} (${device.name})`)
      device.setMedium().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  },

  high: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`HIGH command received for ${device.type} (${device.name})`)
      device.setHigh().then(result => {
        return res.json({ device: device, result: result })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  }
}
