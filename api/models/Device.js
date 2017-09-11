/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    insteonId: {
      type: 'string',
      primaryKey: true,
      required: true
    },

    type: {
      type: 'string',
      enum: ['switch', 'dimmer', 'fan'],
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    description: {
      type: 'text'
    },

    refreshSeconds: {
      type: 'integer',
      defaultsTo: 300
    },

    udn: function () {
      return `insteon:hub:${sails.hooks.insteon_hub.client().insteonId}:${this.type}:${this.insteonId}`
    },

    hardware_address: function () {
      return `${sails.hooks.insteon_hub.client().insteonId}${this.insteonId}`
    },

    toJSON: function () {
      var device = this.toObject()
      device.udn = this.udn()
      device.hardware_address = this.hardware_address()
      return device
    }
  },

  beforeValidate: (device, cb) => {
    var hub = sails.hooks.insteon_hub.client()
    hub.info(device.insteonId)
    .then(deviceInfo => {
      console.log(deviceInfo)
      if (deviceInfo === undefined) {
        cb(`Device with Insteon ID ${device.insteonId} unknown to hub`)
      } else {
        if (deviceInfo.isLighting) {
          if (deviceInfo.isDimmable) {
            device.type = 'dimmer'
          } else {
            device.type = 'switch'
          }
        } else if (deviceInfo.isFan) {
          device.type = 'fan'
        }
      }
      cb()
    })
  },

  afterCreate: (device, cb) => {
    sails.hooks.ssdp_server.start(device)
    cb()
  }
}
