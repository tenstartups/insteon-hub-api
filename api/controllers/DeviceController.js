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
    Device.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: device })
    })
  },

  update: (req, res) => {
    var attrs = {}
    if (req.param('refresh_seconds') != null) {
      attrs['refreshSeconds'] = req.param('refresh_seconds')
    }
    if (req.param('is_advertised') != null) {
      attrs['isAdvertised'] = req.param('is_advertised')
    }
    if (req.param('smart_things_token') != null) {
      attrs['smartThingsToken'] = req.param('smart_things_token')
    }
    Device.update(req.params.id, attrs).exec((err, devices) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: devices[0] })
    })
  }
}
