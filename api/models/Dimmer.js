var Device = require('./Device')

module.exports =  _.merge(_.cloneDeep(Device), {
  attributes: {
    status: function () {
      return this.isyDevice().getCurrentLightState() ? 'on' : 'off'
    },

    level: function () {
      return this.isyDevice().getCurrentLightDimState()
    },

    getStatus: function () {
      return { status: this.status(), level: this.level() }
    },

    refreshStatus: function () {
      this.sendSmartThingsUpdate()
      return { command: 'refresh_status' }
    },

    turnOn: function () {
      this.isyDevice().sendLightCommand(true, success => {})
      return { command: 'turn_on' }
    },

    turnOff: function () {
      this.isyDevice().sendLightCommand(false, success => {})
      return { command: 'turn_off' }
    },

    setLevel: function (level) {
      this.isyDevice().sendLightDimCommand(level, success => {})
      return { command: 'set_level', level: level }
    },

    brighten: function () {
      this.isyDevice().sendLightDimCommand(Math.min(this.level() + 5, 100), success => {})
      return { command: 'brighten' }
    },

    dim: function () {
      this.isyDevice().sendLightDimCommand(Math.max(this.level() - 5, 1), success => {})
      return { command: 'dim' }
    }
  }
})
