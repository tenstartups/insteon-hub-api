var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    insteonClient: function () {
      return sails.hooks.insteon.hub().insteonClient().fan(this.insteonId)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'fan'
    cb()
  }
})
