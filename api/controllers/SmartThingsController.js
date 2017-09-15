module.exports = {

  token: (req, res) => {
    var token = req.params.token
    Hub.update({}, { smartThingsToken: token }).exec((err, hubs) => {
      if (err) {
        return res.serverError(err)
      } else {
        sails.hooks.insteon.hub().loadSmartThingsEventUrl()
        .then(result => {
          return res.json({ hub: hubs[0] })
        }, reason => {
          return res.serverError(err)
        })
      }
    })
  }
}
