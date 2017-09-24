var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    status: function () {
      switch (this.isyDevice().getCurrentFanState()) {
        case 'Off':
          return 'off'
        case 'Low':
          return 'low'
        case 'Medium':
          return 'medium'
        case 'High':
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
      this.isyDevice().sendFanCommand('Off', success => {})
      return { command: 'turn_off' }
    },

    setLow: function () {
      this.isyDevice().sendFanCommand('Low', success => {})
      return { command: 'set_low' }
    },

    setMedium: function () {
      this.isyDevice().sendFanCommand('Medium', success => {})
      return { command: 'set_medium' }
    },

    setHigh: function () {
      this.isyDevice().sendFanCommand('High', success => {})
      return { command: 'set_high' }
    }
  }
})
