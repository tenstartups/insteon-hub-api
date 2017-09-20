module.exports = {

  index: (req, res) => {
    Device.find().exec((err, devices) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: devices })
    })
  },

  show: (req, res) => {
    var insteonId = req.params.insteonId
    Device.findOne({ insteonId: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: device })
    })
  },

  create: (req, res) => {
    var attrs = {
      insteonId: req.params.insteonId,
      type: req.params.type,
      name: req.param('name'),
      description: req.param('description')
    }
    Device.findOne({ insteonId: attrs['insteonId'] }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (device) {
        return res.badRequest(`Insteon ID ${attrs['insteonId']} already taken`)
      }
    })
    Device.create(attrs).exec((err, device) => {
      if (err) {
        return res.serverError({ error: err })
      }
      return res.json({ device: device })
    })
  },

  update: (req, res) => {
    var insteonId = req.params.insteonId
    var attrs = {
      name: req.param('name'),
      description: req.param('description')
    }
    Device.update({ insteonId: insteonId }, attrs).exec((err, devices) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: devices[0] })
    })
  },

  destroy: (req, res) => {
    var insteonId = req.params.insteonId
    Device.destroy({ insteonId: insteonId }).exec((err, devices) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: devices[0] })
    })
  }
}
