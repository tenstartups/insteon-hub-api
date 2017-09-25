var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    currentState: function () {
      switch (this.isyDevice().getCurrentFanState()) {
        case 'Off':
          return { status: 'off' }
        case 'Low':
          return { status: 'low' }
        case 'Medium':
          return { status: 'medium' }
        case 'High':
          return { status: 'high' }
      }
    },

    turnOff: function () {
      return this.sendFanCommand('off', 'Off')
    },

    setLow: function () {
      return this.sendFanCommand('low', 'Low')
    },

    setMedium: function () {
      return this.sendFanCommand('medium', 'Medium')
    },

    setHigh: function () {
      return this.sendFanCommand('high', 'High')
    },

    sendFanCommand: function (commandCode, fanCommand) {
      return new Promise((resolve, reject) => {
        this.isyDevice().sendFanCommand(fanCommand, async success => {
          await this.snooze(500)
          resolve(Object.assign({ command: commandCode, success: success }, this.currentState()))
        })
      })
    }
  }
})
