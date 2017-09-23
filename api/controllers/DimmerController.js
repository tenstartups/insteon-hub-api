module.exports = {

  status: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.getStatus() })
    })
  },

  refresh: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.refreshStatus() })
    })
  },

  on: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.turnOn() })
    })
  },

  off: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.turnOff() })
    })
  },

  level: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.setLevel(req.params.level) })
    })
  },

  brighten: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.brighten() })
    })
  },

  dim: (req, res) => {
    Dimmer.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.dim() })
    })
  }
}
