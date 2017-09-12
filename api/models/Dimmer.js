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
            console.log(`[${this.insteonId}] Dimmer is ${status.toUpperCase()}`)
            resolve({ command: 'get_status', status: status, level: level })
          } else {
            reject(new Error(`Unable to get status for dimmer ${this.insteonId}`))
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
            resolve({ command: 'turn_on', status: 'on', level: 100 })
          } else {
            reject(new Error(`Unable to turn on dimmer ${this.insteonId}`))
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
            resolve({ command: 'turn_off', status: 'off', level: 0 })
          } else {
            reject(new Error(`Unable to turn off dimmer ${this.insteonId}`))
          }
        })
      })
    },

    setLevel: function (level) {
      return new Promise((resolve, reject) => {
        this.insteonDevice().level(level)
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            var status = level === 0 ? 'off' : 'on'
            resolve({ command: 'set_level', status: status, level: level })
          } else {
            reject(new Error(`Unable to set level for dimmer ${this.insteonId}`))
          }
        })
      })
    },

    brighten: function () {
      return new Promise((resolve, reject) => {
        this.insteonDevice().brighten()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'brighten' })
          } else {
            reject(new Error(`Unable to brighten dimmer ${this.insteonId}`))
          }
        })
      })
    },

    dim: function () {
      return new Promise((resolve, reject) => {
        this.insteonDevice().dim()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'dim' })
          } else {
            reject(new Error(`Unable to lower dimmer ${this.insteonId}`))
          }
        })
      })
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'dimmer'
    cb()
  }
})
