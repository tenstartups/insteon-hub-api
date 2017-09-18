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
          console.log(`[${this.insteonId}] Dimmer is ${status.toUpperCase()}`)
          this.sendSmartThingsUpdate({ command: 'get_status', status: status, level: level })
        } else {
          console.log(`Unable to get status for dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error getting status for dimmer ${this.insteonId}`)
      })
    },

    turnOn: function () {
      this.insteonClient().turnOn()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_on', status: 'on', level: '100' })
        } else {
          console.log(`Unable to turn on dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning on dimmer ${this.insteonId}`)
      })
    },

    turnOff: function () {
      this.insteonClient().turnOff()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_off', status: 'off', level: 0 })
        } else {
          console.log(`Unable to turn off dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning off dimmer ${this.insteonId}`)
      })
    },

    setLevel: function (level) {
      this.insteonClient().level(level)
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          var status = level === 0 ? 'off' : 'on'
          this.sendSmartThingsUpdate({ command: 'set_level', status: status, level: level })
        } else {
          console.log(`Unable to set level for dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error setting level for dimmer ${this.insteonId}`)
      })
    },

    brighten: function () {
      this.insteonClient().brighten()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'brighten' })
        } else {
          console.log(`Unable to brighten dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error brightening dimmer ${this.insteonId}`)
      })
    },

    dim: function () {
      this.insteonClient().dim()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
        } else {
          console.log(`Unable to lower dimmer ${this.insteonId}`)
          this.sendSmartThingsUpdate({ command: 'dim' })
        }
      }, reason => {
        console.log(`Error lowering dimmer ${this.insteonId}`)
      })
    },

    subscribeEvents: function () {
      console.log(`[${this.insteonId}] Subscribing to dimmer events...`)
      var light = this.insteonClient()

      light.on('turnOn', (group, level) => {
        console.log(`[${this.insteonId}] Dimmer turned ON`)
        this.sendSmartThingsUpdate({ event: 'turn_on', status: 'on', level: level })
      })

      light.on('turnOnFast', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned ON FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_on_fast', status: 'on', level: 100 })
      })

      light.on('turnOff', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned OFF`)
        this.sendSmartThingsUpdate({ event: 'turn_off', status: 'off', level: 0 })
      })

      light.on('turnOffFast', (group) => {
        console.log(`[${this.insteonId}] Dimmer turned OFF FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_off_fast', status: 'off', level: 0 })
      })

      light.on('brightening', (group) => {
        console.log(`[${this.insteonId}] Dimmer brightening`)
        this.sendSmartThingsUpdate({ event: 'brightening' })
      })

      light.on('brightened', (group) => {
        console.log(`[${this.insteonId}] Dimmer brightened`)
        this.sendSmartThingsUpdate({ event: 'brightened' })
      })

      light.on('dimming', (group) => {
        console.log(`[${this.insteonId}] Dimmer dimming`)
        this.sendSmartThingsUpdate({ event: 'dimming' })
      })

      light.on('dimmed', (group) => {
        console.log(`[${this.insteonId}] Dimmer dimmed`)
        this.sendSmartThingsUpdate({ event: 'dimmed' })
      })

      console.log(`[${this.insteonId}] Subscribed to dimmer events`)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'dimmer'
    cb()
  }
})
