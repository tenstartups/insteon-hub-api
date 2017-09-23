module.exports = {

  status: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.getStatus() })
    })
  },

  refresh: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.refreshStatus() })
    })
  },

  on: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.turnOn() })
    })
  },

  off: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.turnOff() })
    })
  },

  level: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.setLevel(req.params.level) })
    })
  },

  brighten: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.brighten() })
    })
  },

  dim: (req, res) => {
    DimmableLight.findOne({ id: req.params.id, isyType: 'DimmableLight' }).exec((err, dimmableLight) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmableLight) {
        return res.notFound({ error: `Dimmable light with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmableLight, result: dimmableLight.dim() })
    })
  }
}
