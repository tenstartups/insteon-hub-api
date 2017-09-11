/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    insteon_id: {
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

    udn: function() {
      return `insteon:hub:${sails.hooks.insteon_hub.client().insteonId}:${this.type}:${this.insteon_id}`
    },

    hardware_address: function() {
      return `${sails.hooks.insteon_hub.client().insteonId}${this.insteon_id}`
    },

    toJSON: function() {
      var device = this.toObject()
      device.udn = this.udn()
      device.hardware_address = this.hardware_address()
      return device
    }
  },

  beforeValidate: (device, cb) => {
    var hub = sails.hooks.insteon_hub.client()
    hub.info(device.insteon_id)
    .then(deviceInfo => {
      console.log(deviceInfo)
      if (deviceInfo === undefined) {
        cb(`Device with Insteon ID ${device.insteon_id} unknown to hub`)
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
