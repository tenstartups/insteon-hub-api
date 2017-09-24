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
      if (!device) {
        return res.notFound({ error: `Device with id ${req.params.id} not found` })
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
    Device.update(req.params.id, attrs).exec((err, devices) => {
      if (err) {
        return res.serverError(err)
      }
      if (devices.length !== 1) {
        return res.notFound({ error: `Device with id ${req.params.id} not found` })
      }
      return res.json({ device: devices[0] })
    })
  },

  token: (req, res) => {
    Device.findOne(req.params.id).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      if (!device) {
        return res.notFound({ error: `Device with id ${req.params.id} not found` })
      }
      device.smartThingsToken = req.params.token
      device.loadSmartThingsAppEndpoints().then(result => {
        device.smartThingsAppCallbackURIs = result
        device.save(err => {
          if (err) {
            return res.serverError(err)
          }
          return res.json({ device: device })
        })
      }).catch(reason => {
        return res.serverError(reason)
      })
    })
  }
}
