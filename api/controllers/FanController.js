module.exports = {

  status: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`STATUS requested for ${fan.name}`)
      return res.json({ device: fan, result: fan.getStatus() })
    })
  },

  refresh: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`REFRESH command received for ${fan.name}`)
      return res.json({ device: fan, result: fan.refreshStatus() })
    })
  },

  off: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${fan.name}`)
      return res.json({ device: fan, result: fan.turnOff() })
    })
  },

  low: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`LOW command received for ${fan.name}`)
      return res.json({ device: fan, result: fan.setLow() })
    })
  },

  medium: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`MEDIUM command received for ${fan.name}`)
      return res.json({ device: fan, result: fan.setMedium() })
    })
  },

  high: (req, res) => {
    Fan.findOne({ id: req.params.id, type: 'Fan' }).exec((err, fan) => {
      if (err) {
        return res.serverError(err)
      }
      if (!fan) {
        return res.notFound({ error: `Fan with id ${req.params.id} not found` })
      }
      console.log(`HIGH command received for ${fan.name}`)
      return res.json({ device: fan, result: fan.setHigh() })
    })
  }
}
