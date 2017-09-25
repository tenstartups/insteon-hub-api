var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    currentState: function () {
      return { status: this.isyDevice().getCurrentOutletState() ? 'on' : 'off' }
    },

    turnOn: function () {
      return this.sendOutletCommand('on', true)
    },

    turnOff: function () {
      return this.sendOutletCommand('off', false)
    },

    sendOutletCommand: function (commandCode, on) {
      return new Promise((resolve, reject) => {
        this.isyDevice().sendOutletCommand(on, async success => {
          await this.snooze(1000)
          resolve(Object.assign({ command: commandCode, success: success }, this.currentState()))
        })
      })
    }
  }
})
