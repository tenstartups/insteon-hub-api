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
            reject(new Error(`Unable to get status for fan dimmer ${this.insteonId}`))
          }
        }, reason => {
          reject(reason)
        })
      })
    },

    refresh: function () {
      this.insteonClient().level()
      .then((result) => {
        if (result !== undefined && result !== null && result !== '') {
          var level = parseInt(result)
          var status = (level === 0 ? 'off' : 'on')
          console.log(`[${this.insteonId}] Fan dimmer is at ${level}%`)
          this.sendSmartThingsUpdate({ command: 'refresh_light', status: status, level: level })
        } else {
          console.log(`Unable to get status for fan dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error getting status for fan dimmer ${this.insteonId}`)
      })
    },

    turnLightOn: function () {
      this.insteonClient().turnOn()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_light_on', status: 'on', level: '100' })
        } else {
          console.log(`Unable to turn on fan dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning on fan dimmer ${this.insteonId}`)
      })
    },

    turnLightOff: function () {
      this.insteonClient().turnOff()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_light_off', status: 'off', level: 0 })
        } else {
          console.log(`Unable to turn off fan dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning off fan dimmer ${this.insteonId}`)
      })
    },

    setLightLevel: function (level) {
      level = parseInt(level)
      this.insteonClient().level(level)
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          var status = (level === 0 ? 'off' : 'on')
          this.sendSmartThingsUpdate({ command: 'set_light_level', status: status, level: level })
        } else {
          console.log(`Unable to set level for fan dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error setting level for fan dimmer ${this.insteonId}`)
      })
    },

    brightenLight: function () {
      this.insteonClient().brighten()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'brighten_light' })
        } else {
          console.log(`Unable to brighten fan dimmer ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error brightening fan dimmer ${this.insteonId}`)
      })
    },

    dimLight: function () {
      this.insteonClient().dim()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
        } else {
          console.log(`Unable to lower fan dimmer ${this.insteonId}`)
          this.sendSmartThingsUpdate({ command: 'dim_light' })
        }
      }, reason => {
        console.log(`Error lowering fan dimmer ${this.insteonId}`)
      })
    },

    turnFanOff: function () {
      this.insteonClient().fanOff()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_fan_off', speed: 'off' })
        } else {
          console.log(`Unable to turn off fan ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning off fan ${this.insteonId}`)
      })
    },

    turnFanLow: function () {
      this.insteonClient().fanLow()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_fan_low', speed: 'low' })
        } else {
          console.log(`Unable to turn fan to low ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning fan to low ${this.insteonId}`)
      })
    },

    turnFanMedium: function () {
      this.insteonClient().fanMedium()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_fan_medium', speed: 'medium' })
        } else {
          console.log(`Unable to turn fan to medium ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning fan to medium ${this.insteonId}`)
      })
    },

    turnFanHigh: function () {
      this.insteonClient().fanHigh()
      .then((result) => {
        if (result.response) {
          console.log(`[${this.insteonId}] Insteon response: ${JSON.stringify(result.response)}`)
          this.sendSmartThingsUpdate({ command: 'turn_fan_high', speed: 'high' })
        } else {
          console.log(`Unable to turn fan to high ${this.insteonId}`)
        }
      }, reason => {
        console.log(`Error turning fan to high ${this.insteonId}`)
      })
    },

    subscribeEvents: function () {
      console.log(`[${this.insteonId}] Subscribing to fan controller events...`)
      var light = this.insteonClient()

      light.on('turnOn', (group, level) => {
        console.log(`[${this.insteonId}] Fan dimmer turned ON`)
        this.sendSmartThingsUpdate({ event: 'turn_light_on', status: 'on', level: level })
      })

      light.on('turnOnFast', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned ON FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_light_on_fast', status: 'on', level: 100 })
      })

      light.on('turnOff', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned OFF`)
        this.sendSmartThingsUpdate({ event: 'turn_light_off', status: 'off', level: 0 })
      })

      light.on('turnOffFast', (group) => {
        console.log(`[${this.insteonId}] Fan dimmer turned OFF FAST`)
        this.sendSmartThingsUpdate({ event: 'turn_light_off_fast', status: 'off', level: 0 })
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
