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
      this.sendSmartThingsUpdate({ command: 'refresh', status: this.status(), level: this.level() })
      return { command: 'refresh_status' }
    }
  }
})
