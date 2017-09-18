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
      required: true,
      unique: true
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

    server: function () {
      return sails.hooks.server.singleton()
    },

    hub: function () {
      return sails.hooks.hub.singleton()
    },

    discovery: function () {
      return sails.hooks.discovery.singleton()
    },

    udn: function () {
      return `server:${this.server().instanceId}:hub:${this.hub().insteonId}:${this.type}:${this.insteonId}`
    },

    networkId: function () {
      return `${this.server().instanceId}${this.hub().insteonId}${this.insteonId}`
    },

    toJSON: function () {
      return {
        type: this.type,
        insteon_id: this.insteonId,
        udn: this.udn(),
        network_id: this.networkId(),
        name: this.name,
        label: this.description,
        ip: this.server().advertiseAddress(),
        port: this.server().advertisePort()
      }
    },

    insteonClient: function () {
      return this.hub().insteonClient().light(this.insteonId)
    },

    sendSmartThingsUpdate: function (event) {
      this.server().sendSmartThingsUpdate(this, event)
    }
  },

  beforeValidate: function (device, cb) {
    sails.hooks.hub.singleton().insteonClient().info(device.insteonId)
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
    sails.hooks.discovery.singleton().startFor(device)
    // device.subscribeEvents()
    cb()
  }
}
