module.exports = {

  index: (req, res) => {
    Device.find().exec((err, records) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json(records)
    })
  },

  show: (req, res) => {
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, record) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json(record)
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
        var result = Device.create(
          {
            udn: `${hub.insteon_id}:${insteonId}`,
            name: insteonId || `Insteon Device ${insteonId}`
          }
        )
        console.log(result)
        return res.json(result)
      }
    })
  },

  update: (req, res) => {
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, record) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json(record)
    })
  },

  destroy: (req, res) => {
    var insteonId = req.params.insteon_id
    Device.findOne({ insteon_id: insteonId }).exec((err, record) => {
      if (err) {
        return res.serverError(err)
      }
      return res.json(record)
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
