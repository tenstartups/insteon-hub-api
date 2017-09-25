module.exports = {

  status: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, scene) => {
      if (err) {
        return res.serverError(err)
      }
      if (!scene) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      return res.json({ device: scene, result: scene.getStatus() })
    })
  },

  refresh: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, scene) => {
      if (err) {
        return res.serverError(err)
      }
      if (!scene) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      return res.json({ device: scene, result: scene.refreshStatus() })
    })
  },

  on: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, scene) => {
      if (err) {
        return res.serverError(err)
      }
      if (!scene) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      console.log(`ON command received for ${scene.name}`)
      return res.json({ device: scene, result: scene.turnOn() })
    })
  },

  off: (req, res) => {
    Scene.findOne({ id: req.params.id, type: 'Scene' }).exec((err, scene) => {
      if (err) {
        return res.serverError(err)
      }
      if (!scene) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      console.log(`OFF command received for ${scene.name}`)
      return res.json({ device: scene, result: scene.turnOff() })
    })
  }
}
