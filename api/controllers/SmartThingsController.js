module.exports = {

  token: (req, res) => {
    var token = req.params.token
    var hub = sails.hooks.insteon.hub()
    hub.smartThingsToken = token
    hub.save(function (err) {
      if (err) {
        return res.serverError(err)
      }
      hub.loadSmartThingsEndpoints(token)
      return res.json({ hub: hub })
    })
  }
}
