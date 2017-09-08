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
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: device })
    })
  },

  create: (req, res) => {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    hub.info(insteonId)
    .then(deviceInfo => {
      if (deviceInfo === undefined) {
        return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
      } else {
        var type
        if (deviceInfo.isLighting) {
          if (deviceInfo.isDimmable) {
            type = 'dimmer'
          } else {
            type = 'switch'
          }
        } else if (deviceInfo.isFan) {
          type = 'fan'
        } else {
          return res.badRequest({ error: `Unknown/unsupported device type ${deviceInfo}` })
        }
        var attrs = {
          insteon_id: insteonId,
          type: type,
          udn: `insteon:${hub.insteonId}:${insteonId}`,
          name: req.param('name') || `Insteon Device ${insteonId}`
        }
        Device.create(attrs).exec((err, device) => {
          if (err) {
            return res.serverError({ error: err })
          }
          return res.json({ device: device })
        })
      }
    })
  },

  update: (req, res) => {
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: device })
    })
  },

  destroy: (req, res) => {
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, device) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json({ device: device })
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
