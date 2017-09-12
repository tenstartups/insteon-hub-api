var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    insteonDevice: function () {
      return this.insteonHub().light(this.insteonId)
    },

    getStatus: function () {
      return new Promise((resolve, reject) => {
        this.insteonDevice().level()
        .then((result) => {
          if (result !== undefined && result !== null && result !== '') {
            var level = parseInt(result)
            var status = (level === 0 ? 'off' : 'on')
            console.log(`[${this.insteonId}] Switch is ${status.toUpperCase()}`)
            resolve({ command: 'get_status', status: status })
          } else {
            reject(new Error(`Unable to get status for switch ${this.insteonId}`))
          }
        })
      })
    },

    turnOn: function () {
      return new Promise((resolve, reject) => {
        this.insteonDevice().turnOn()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_on', status: 'on' })
          } else {
            reject(new Error(`Unable to turn on switch ${this.insteonId}`))
          }
        })
      })
    },

    turnOff: function () {
      return new Promise((resolve, reject) => {
        this.insteonDevice().turnOff()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_off', status: 'off' })
          } else {
            reject(new Error(`Unable to turn off switch ${this.insteonId}`))
          }
        })
      })
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'switch'
    cb()
  }
})
