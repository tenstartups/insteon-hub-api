var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    status: function () {
      switch (this.isyDevice().getCurrentFanState()) {
        case ISYFanDevice.FAN_OFF:
          return 'off'
        case ISYFanDevice.FAN_LEVEL_LOW:
          return 'low'
        case ISYFanDevice.FAN_LEVEL_MEDIUM:
          return 'medium'
        case ISYFanDevice.FAN_LEVEL_HIGH:
          return 'high'
      }
    },

    getStatus: function () {
      return { status: this.status() }
    },

    refreshStatus: function () {
      this.sendSmartThingsUpdate()
      return { command: 'refresh_status' }
    },

    turnOff: function () {
      this.isyDevice().sendFanCommand(ISYFanDevice.FAN_OFF, success => {})
      return { command: 'turn_off' }
    },

    setLow: function () {
      this.isyDevice().sendLightCommand(ISYFanDevice.FAN_LEVEL_LOW, success => {})
      return { command: 'set_low' }
    },

    setMedium: function () {
      this.isyDevice().sendLightCommand(ISYFanDevice.FAN_LEVEL_MEDIUM, success => {})
      return { command: 'set_medium' }
    },

    setHigh: function () {
      this.isyDevice().sendLightCommand(ISYFanDevice.FAN_LEVEL_HIGH, success => {})
      return { command: 'set_high' }
    }
  }
})
