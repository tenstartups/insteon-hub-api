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
            console.log(`[${this.insteonId}] Dimmer is ${status.toUpperCase()}`)
            resolve({ command: 'get_status', status: status, level: level })
          } else {
            reject(new Error(`Unable to get status for dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error getting status for dimmer ${this.insteonId}`))
        })
      })
    },

    turnOn: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOn()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_on', status: 'on', level: 100 })
          } else {
            reject(new Error(`Unable to turn on dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning on dimmer ${this.insteonId}`))
        })
      })
    },

    turnOff: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOff()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'turn_off', status: 'off', level: 0 })
          } else {
            reject(new Error(`Unable to turn off dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning off dimmer ${this.insteonId}`))
        })
      })
    },

    setLevel: function (level) {
      return new Promise((resolve, reject) => {
        this.insteonClient().level(level)
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            var status = level === 0 ? 'off' : 'on'
            resolve({ command: 'set_level', status: status, level: level })
          } else {
            reject(new Error(`Unable to set level for dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error setting level for dimmer ${this.insteonId}`))
        })
      })
    },

    brighten: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().brighten()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'brighten' })
          } else {
            reject(new Error(`Unable to brighten dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error brightening dimmer ${this.insteonId}`))
        })
      })
    },

    dim: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().dim()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'dim' })
          } else {
            reject(new Error(`Unable to lower dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error lowering dimmer ${this.insteonId}`))
        })
      })
    },

    subscribeEvents: function () {
      console.log(`[${this.insteonId}] Subscribing to dimmer events...`)
      var light = this.insteonClient()

      light.on('turnOn', (group, level) => {
        console.log(`[${this.insteonId}] Dimmer turned ON`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'turn_on', status: 'on', level: level })
      })

      light.on('turnOnFast', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned ON FAST`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'turn_on_fast', status: 'on', level: 100 })
      })

      light.on('turnOff', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned OFF`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'turn_off', status: 'off', level: 0 })
      })

      light.on('turnOffFast', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned OFF FAST`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'turn_off_fast', status: 'off', level: 0 })
      })

      light.on('brightening', (group) => {
        console.log(`[${this.insteonId}] Dimmer brightening`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'brightening' })
      })

      light.on('brightened', (group) => {
        console.log(`[${this.insteonId}] Dimmer brightened`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'brightened' })
      })

      light.on('dimming', (group) => {
        console.log(`[${this.insteonId}] Dimmer dimming`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'dimming' })
      })

      light.on('dimmed', (group) => {
        console.log(`[${this.insteonId}] Dimmer dimmed`)
        sails.hooks.insteon.hub().sendSmartThingsEvent(this, { name: 'dimmed' })
      })

      console.log(`[${this.insteonId}] Subscribed to dimmer events`)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'dimmer'
    cb()
  }
})
