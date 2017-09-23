module.exports = {

  status: (req, res) => {
    Switch.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with id ${req.params.id} not found` })
      }
      return res.json({ device: device, result: device.getStatus() })
    })
  },

  refresh: (req, res) => {
    Switch.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with id ${req.params.id} not found` })
      }
      return res.json({ device: device, result: device.refreshStatus() })
    })
  },

  on: (req, res) => {
    Switch.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with id ${req.params.id} not found` })
      }
      return res.json({ device: device, result: device.turnOn() })
    })
  },

  off: (req, res) => {
    Switch.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Switch with id ${req.params.id} not found` })
      }
      return res.json({ device: device, result: device.turnOff() })
    })
  }
}
