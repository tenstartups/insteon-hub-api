module.exports = {

  update_callback: (req, res) => {
    var token = req.param('access_token')
    var url = req.param('callback_url')
    if (!token || !url) {
      return res.badRequest('Missing arguments for request')
    }
    Hub.update({}, { smartThingsToken: token, smartThingsUrl: url }).exec((err, hub) => {
      if (err) {
        return res.serverError(err)
      } else {
        return res.json({ hub: hub })
      }
    })
  }
}
