module.exports = {

  token: (req, res) => {
    var token = req.params.token
    Hub.update({}, { smartThingsToken: token }).exec((err, hub) => {
      if (err) {
        return res.serverError(err)
      } else {
        return res.json({ hub: hub })
      }
    })
  }
}
