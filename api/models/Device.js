/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'device',

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

    hub: {
      columnName: 'hubId',
      model: 'hub',
      required: true
    },

    udn: function () {
      return `insteon:${this.hub.instanceId()}:hub:${this.hub.insteonId}:${this.type}:${this.insteonId}`
    },

    networkId: function () {
      return `${this.hub.instanceId()}${this.hub.insteonId}${this.insteonId}`
    },

    toJSON: function () {
      var device = this.toObject()
      device.udn = this.udn()
      device.networkId = this.networkId()
      return device
    }
  },

  beforeValidate: function (device, cb) {
    if (device.hub === undefined || device.hub === null) {
      device.hub = sails.hooks.insteon.hub().insteonId
    }
    sails.hooks.insteon.hub().insteonClient().info(device.insteonId)
    .then(deviceInfo => {
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
    }, reason => {
      cb(`Error getting device information for Insteon ID ${device.insteonId}`)
    })
  },

  afterCreate: function (device, cb) {
    sails.hooks.ssdp.start(device)
    cb()
  }
}
