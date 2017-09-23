module.exports = {

  status: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.getStatus() })
    })
  },

  refresh: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.refreshStatus() })
    })
  },

  off: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.turnOff() })
    })
  },

  low: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.turnLow() })
    })
  },

  medium: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.turnMedium() })
    })
  },

  high: (req, res) => {
    Fan.findOne({ id: req.params.id, isyType: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      return res.json({ device: fan, result: fan.turnHigh() })
    })
  }
}
