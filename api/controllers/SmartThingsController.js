module.exports = {

  token: (req, res) => {
    var token = req.params.token
    Hub.update({}, {smartThingsToken: token}).exec((err, record) => {
      if (err) {
        return res.serverError(err)
      } else {
        var hub = sails.hooks.insteon.hub()
        hub.smartThingsToken = token
        hub.loadSmartThingsEndpoints(token)
        return res.json({ hub: record })
      }
    })
  }
}
