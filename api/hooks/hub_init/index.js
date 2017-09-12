module.exports = (sails) => {
  return {
    initialize: (cb) => {
      sails.after(['hook:orm:loaded', 'hook:insteon_hub:loaded'], () => {
        console.log('Initializing hub record...')
        Hub.findOrCreate({ insteonId: sails.hooks.insteon_hub.client().insteonId }).exec((err, hub) => {
          if (err) {
            throw err
          } else {
            console.log('Initialized hub record')
          }
        })
        return cb()
      })
    }
  }
}
