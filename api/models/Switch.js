var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    insteonClient: function () {
      return sails.hooks.insteon.hub().insteonClient().light(this.insteonId)
    },

    getStatus: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().level()
        .then((result) => {
          if (result !== undefined && result !== null && result !== '') {
            var level = parseInt(result)
            var status = (level === 0 ? 'off' : 'on')
            console.log(`[${this.insteonId}] Switch is ${status.toUpperCase()}`)
            resolve({ command: 'get_status', status: status })
          } else {
            reject(new Error(`Unable to get status for switch ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error getting status for switch ${this.insteonId}`))
        })
      })
    },

    turnOn: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOn()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_on', status: 'on' })
          } else {
            reject(new Error(`[${this.insteonId}] Switch not found`))
          }
        }, reason => {
          reject(new Error(`[${this.insteonId}] Error turning on switch`))
        })
      })
    },

    turnOff: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOff()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_off', status: 'off' })
          } else {
            reject(new Error(`Unable to turn off switch ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning off switch ${this.insteonId}`))
        })
      })
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'switch'
    cb()
  }
})
