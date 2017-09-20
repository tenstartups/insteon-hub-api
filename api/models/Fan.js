var _ = require('lodash')
var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    getStatus: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().level()
        .then((result) => {
          if (result !== undefined && result !== null && result !== '') {
            var level = parseInt(result)
            var status = (level === 0 ? 'off' : 'on')
            console.log(`[${this.insteonId}] Fan dimmer is at ${level}%`)
            resolve({ status: status, level: level })
          } else {
            reject(new Error(`Unable to get status for fan ${this.insteonId}`))
          }
        }, reason => {
          reject(reason)
        })
      })
    },

    refresh: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().level()
        .then((result) => {
          if (result !== undefined && result !== null && result !== '') {
            var level = parseInt(result)
            var status = (level === 0 ? 'off' : 'on')
            console.log(`[${this.insteonId}] Fan dimmer is at ${level}%`)
            resolve({ command: 'refresh', status: status, level: level })
          } else {
            reject(new Error(`Unable to get status for fan ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error getting status for fan ${this.insteonId}`))
        })
      })
    },

    fanOff: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().fanOff()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'fan_off', status: 'off' })
          } else {
            reject(new Error(`Unable to turn off fan ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning off fan ${this.insteonId}`))
        })
      })
    },

    fanLow: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().fanLow()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'fan_low', status: 'low' })
          } else {
            reject(new Error(`Unable to turn fan to low ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning fan to low ${this.insteonId}`))
        })
      })
    },

    fanMedium: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().fanMedium()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'fan_med', status: 'medium' })
          } else {
            reject(new Error(`Unable to turn fan to medium ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning fan to medium ${this.insteonId}`))
        })
      })
    },

    fanHigh: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().fanHigh()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            resolve({ command: 'fan_high', status: 'high' })
          } else {
            reject(new Error(`Unable to turn fan to high ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning fan to high ${this.insteonId}`))
        })
      })
    },

    turnOn: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOn()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            this.sendSmartThingsUpdate({ command: 'turn_on', status: 'on', level: 100 })
            resolve({ command: 'turn_on', status: 'on', level: 100 })
          } else {
            reject(new Error(`Unable to turn on fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning on fan dimmer ${this.insteonId}`))
        })
      })
    },

    turnOff: function () {
      return new Promise((resolve, reject) => {
        this.insteonClient().turnOff()
        .then((result) => {
          if (result.response) {
            console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
            this.sendSmartThingsUpdate({ command: 'turn_off', status: 'off', level: 0 })
            resolve({ command: 'turn_off', status: 'off', level: 0 })
          } else {
            reject(new Error(`Unable to turn off fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error turning off fan dimmer ${this.insteonId}`))
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
            this.sendSmartThingsUpdate({ command: 'set_level', status: status, level: level })
            resolve({ command: 'set_level', status: status, level: level })
          } else {
            reject(new Error(`Unable to set level for fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error setting level for fan dimmer ${this.insteonId}`))
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
            reject(new Error(`Unable to brighten fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error brightening fan dimmer ${this.insteonId}`))
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
            reject(new Error(`Unable to lower fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(new Error(`Error lowering fan dimmer ${this.insteonId}`))
        })
      })
    },

    subscribeEvents: function () {
      console.log(`[${this.insteonId}] Subscribing to fan controller events...`)
      var light = this.insteonClient()

      light.on('turnOn', (group, level) => {
        console.log(`[${this.insteonId}] Fan dimmer turned ON`)
        this.sendSmartThingsUpdate({ event: 'turn_on', status: 'on', level: level })
      })

      light.on('turnOnFast', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned ON FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_on_fast', status: 'on', level: 100 })
      })

      light.on('turnOff', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned OFF`)
        this.sendSmartThingsUpdate({ event: 'turn_off', status: 'off', level: 0 })
      })

      light.on('turnOffFast', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned OFF FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_off_fast', status: 'off', level: 0 })
      })

      light.on('brightening', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer brightening`)
        this.sendSmartThingsUpdate({ event: 'brightening' })
      })

      light.on('brightened', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer brightened`)
        this.sendSmartThingsUpdate({ event: 'brightened' })
      })

      light.on('dimming', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer dimming`)
        this.sendSmartThingsUpdate({ event: 'dimming' })
      })

      light.on('dimmed', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer dimmed`)
        this.sendSmartThingsUpdate({ event: 'dimmed' })
      })

      console.log(`[${this.insteonId}] Subscribed to fan controller events`)
    },

    startPolling: function () {
      this.refresh()
      return setInterval(() => {
        this.refresh()
      }, this.refreshSeconds * 1000)
    }
  },

  beforeValidate: function (attrs, cb) {
    attrs.type = 'fan'
    cb()
  }
})
