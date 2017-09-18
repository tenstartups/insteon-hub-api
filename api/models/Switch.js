var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    getStatus: function () {
      this.insteonClient().level()
      .then((result) => {
        if (result !== undefined && result !== null && result !== '') {
          var level = parseInt(result)
          var status = (level === 0 ? 'off' : 'on')
          console.log(`[${this.insteonId}] Switch is ${status.toUpperCase()}`)
          this.sendSmartThingsEvent({ status: status })
        } else {
          console.log(`Unable to get status for switch ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error getting status for switch ${this.insteonId}`)
      })
    },

    turnOn: function () {
      this.insteonClient().turnOn()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] ${JSON.stringify(result.response)}`)
          this.sendSmartThingsEvent({ status: 'on' })
        } else {
          console.log(`[${this.insteonId}] Switch not found`)
        }
      }, reason => {
        console.log(`[${this.insteonId}] Error turning on switch`)
      })
    },

    turnOff: function () {
      this.insteonClient().turnOff()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsEvent({ status: 'off' })
        } else {
          console.log(`Unable to turn off switch ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning off switch ${this.insteonId}`)
      })
    },

    subscribeEvents: function () {
      console.log(`[${this.insteonId}] Subscribing to switch events...`)
      var light = this.insteonClient()

      light.on('turnOn', (group, level) => {
        console.log(`[${this.insteonId}] Switch turned ON`)
        this.sendSmartThingsEvent({ name: 'turn_on', status: 'on' })
      })

      light.on('turnOnFast', (group) => {
        console.log(`[${this.insteonId}] Switch turned ON FAST`)
        this.sendSmartThingsEvent({ name: 'turn_on_fast', status: 'on' })
      })

      light.on('turnOff', (group) => {
        console.log(`[${this.insteonId}] Switch turned OFF`)
        this.sendSmartThingsEvent({ name: 'turn_off', status: 'off' })
      })

      light.on('turnOffFast', (group) => {
        console.log(`[${this.insteonId}] Switch turned OFF FAST`)
        this.sendSmartThingsEvent({ name: 'turn_off_fast', status: 'off' })
      })

      console.log(`[${this.insteonId}] Subscribed to switch events`)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'switch'
    cb()
  }
})
