module.exports = {

  update: (req, res) => {
    Device.create(attrs).exec((err, device) => {
      if (err) {
        return res.serverError({ error: err })
      }
      return res.json({ device: device })
    })
  }
}
