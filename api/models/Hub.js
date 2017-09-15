/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var request = require('request-promise-native')

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

    storeInsteonClient: function (client) {
      this._insteonClient = client
    },

    loadSmartThingsEndpoints: function (token) {
      return new Promise((resolve, reject) => {
        if (!token) {
          resolve(null)
        }
        var options = {
          headers: {
            'Authorization': `Bearer ${this.smartThingsToken}`
          },
          uri: 'https://graph.api.smartthings.com/api/smartapps/endpoints',
          json: true
        }
        request(options)
        .then(result => {
          this._smartThingsEndpoints = result
          resolve(result)
        })
        .catch(reason => {
          throw reason
        })
      })
    },

    sendSmartThingsEvent: function (device, eventJSON) {
      if (!this.smartThingsToken || !this._smartThingsEndpoints) {
        return
      }
      this._smartThingsEndpoints.forEach(endpoint => {
        var options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.smartThingsToken}`
          },
          uri: `${endpoint.uri}/event`,
          body: { device: device, event: eventJSON },
          json: true
        }
        request(options)
        .then(result => {
          console.log(`Successfully sent event ${eventJSON.name} to ${endpoint.uri}/event`)
        })
        .catch(reason => {
          console.log(`Error sending event ${eventJSON.name} to ${endpoint.uri}/event`)
        })
      })
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
