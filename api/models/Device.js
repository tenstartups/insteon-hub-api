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

    getLinks: function () {
      return new Promise((resolve, reject) => {
        this.hub().insteonClient().links(this.insteonId)
        .then((result) => {
          resolve(result)
        }, reason => {
          reject(reason)
        })
      })
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
      return `insteon:${this.server().instanceId}:hub:${this.hub().insteonId}:${this.type}:${this.insteonId}`
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
        label: this.name,
        description: this.description,
        ip: this.server().advertiseIP(),
        port: this.server().advertisePort(),
        mac: this.server().advertiseMAC()
      }
    },

    insteonClient: function () {
      return this.hub().insteonClient().light(this.insteonId)
    },

    sendSmartThingsUpdate: function (event) {
      this.server().sendSmartThingsUpdate(this, event)
    }
  },

  beforeSave: function (device, cb) {
    sails.hooks.hub.singleton().insteonClient().info(device.insteonId)
    .then(deviceInfo => {
      if (deviceInfo === undefined) {
        cb(`Device with Insteon ID ${device.insteonId} unknown to hub`)
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
