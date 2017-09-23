module.exports = {

  status: (req, res) => {
    Scene.findOne({ id: req.params.id, isyType: 'Scene' }).exec((err, scene) => {
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
    Scene.findOne({ id: req.params.id, isyType: 'Scene' }).exec((err, scene) => {
      if (err) {
        return res.serverError(err)
      }
      if (!scene) {
        return res.notFound({ error: `Scene with id ${req.params.id} not found` })
      }
      return res.json({ device: scene, result: scene.refreshStatus() })
    })
  }
}
