module.exports = {

  status: (req, res) => {
    Scene.findOne(req.params.id).exec((err, dimmer) => {
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
    Scene.findOne(req.params.id).exec((err, dimmer) => {
      if (err) {
        return res.serverError(err)
      }
      if (!dimmer) {
        return res.notFound({ error: `Dimmer with id ${req.params.id} not found` })
      }
      return res.json({ device: dimmer, result: dimmer.refreshStatus() })
    })
  }
}
