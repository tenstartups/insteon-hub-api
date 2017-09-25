var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    currentState: function () {
      return { status: this.isyDevice().getCurrentLightState() ? 'on' : 'off' }
    },

    turnOn: function () {
      return this.sendLightCommand('on', true)
    },

    turnOff: function () {
      return this.sendLightCommand('off', false)
    },

    sendLightCommand: function (commandCode, on) {
      return new Promise((resolve, reject) => {
        this.isyDevice().sendLightCommand(on, async success => {
          await this.snooze(500)
          resolve(Object.assign({ command: commandCode, success: success }, this.currentState()))
        })
      })
    }
  }
})
