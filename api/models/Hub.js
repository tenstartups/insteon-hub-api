/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const INSTANCE_ID = process.env.INSTANCE_ID || '01'

module.exports = {

  attributes: {

    insteonId: {
      type: 'string',
      primaryKey: true,
      required: true
    },

    smartThingsUrl: {
      type: 'string'
    },

    smartThingsToken: {
      type: 'string'
    },

    toJSON: function () {
      var hub = this.toObject()
      return hub
    }
  }
}
