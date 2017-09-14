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

    smartThingsToken: {
      type: 'string'
    },

    devices: {
      collection: 'device',
      via: 'hub'
    },

    instanceId: function () {
      return process.env.INSTANCE_ID || '01'
    },

    insteonClient: function () {
      return this._insteonClient
    },

    toJSON: function () {
      var hub = this.toObject()
      return hub
    }
  }
}
