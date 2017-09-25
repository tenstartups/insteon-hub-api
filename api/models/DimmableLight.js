var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    currentLevel: function () {
      return Math.round(this.isyDevice().getCurrentLightDimState())
    },

    currentState: function () {
      return {
        status: this.isyDevice().getCurrentLightState() ? 'on' : 'off',
        level: this.currentLevel()
      }
    },

    turnOn: function () {
      return this.sendLightCommand('on', true)
    },

    turnOff: function () {
      return this.sendLightCommand('off', false)
    },

    setLevel: function (level) {
      if (level < 1) {
        level = 0
      }
      if (level > 100) {
        level = 100
      }
      if (level === 0) {
        return this.sendLightCommand('level', false)
      } else {
        return this.sendLightDimCommand('level', level)
      }
    },

    brighten: function () {
      return this.sendLightDimCommand('brighten', Math.min(this.currentLevel() + 5, 100))
    },

    dim: function () {
      return this.sendLightDimCommand('dim', Math.max(this.currentLevel() - 5, 1))
    },

    sendLightCommand: function (commandCode, on) {
      return new Promise((resolve, reject) => {
        this.isyDevice().sendLightCommand(on, async success => {
          await this.snooze(500)
          resolve(Object.assign({ command: commandCode, success: success }, this.currentState()))
        })
      })
    },

    sendLightDimCommand: function (commandCode, level) {
      return new Promise((resolve, reject) => {
        this.isyDevice().sendLightDimCommand(level, async success => {
          await this.snooze(500)
          resolve(Object.assign({ command: commandCode, success: success }, this.currentState()))
        })
      })
    }
  }
})
