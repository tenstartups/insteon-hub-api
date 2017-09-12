var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    insteonDevice: function () {
      return this.insteonHub().fan(this.insteonId)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'fan'
    cb()
  }
})
