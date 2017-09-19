/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

var request = require('request-promise-native')

module.exports = {

  initSingleton: function () {
    return new Promise((resolve, reject) => {
      console.log('Initializing server information...')
      Server.findOrCreate().exec((err, server) => {
        if (err) {
          console.log('Error initializing server information')
          reject(err)
        } else {
          server.loadTcpAddress()
          server.loadSmartThingsEndpoints()
          .then(endpoints => {
            console.log('Initialized server information')
            resolve(server)
          })
          .catch(reason => {
            console.log('Error initializing server information')
            reject(reason)
          })
        }
      })
    })
  },

  attributes: {

    instanceId: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true,
      defaultsTo: function () {
        return process.env.INSTANCE_ID || '01'
      }
    },

    smartThingsToken: {
      type: 'string'
    },

    loadTcpAddress: function () {
      // Determine the listener address and port to use
      this._advertiseAddress = process.env.SSDP_LOCATION_ADDRESS
      if (this._advertiseAddress === undefined) {
        this._advertiseAddress = require('ip').address()
        var ifaces = require('os').networkInterfaces()
        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].filter(details => {
            if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
              this._advertiseAddress = details.address
            }
          })
        })
      }
      this._advertisePort = process.env.SSDP_LOCATION_PORT
      if (this._advertisePort === undefined) {
        this._advertisePort = sails.config.port
      }
    },

    advertiseAddress: function () {
      return this._advertiseAddress
    },

    advertisePort: function () {
      return this._advertisePort
    },

    loadSmartThingsEndpoints: function () {
      return new Promise((resolve, reject) => {
        console.log('Loading SmartThings SmartApp endpoints...')
        if (!this.smartThingsToken) {
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
          console.log('Loaded SmartThings SmartApp endpoints')
          resolve(result)
        })
        .catch(reason => {
          console.log('Error loading SmartThings SmartApp endpoints...')
          reject(reason)
        })
      })
    },

    sendSmartThingsUpdate: function (device, data) {
      if (!this.smartThingsToken || !this._smartThingsEndpoints) {
        return
      }
      this._smartThingsEndpoints.forEach(endpoint => {
        var options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.smartThingsToken}`
          },
          uri: `${endpoint.uri}/update`,
          body: { device: device, data: data },
          json: true
        }
        request(options)
        .then(result => {
          console.log(`Successfully sent update ${JSON.stringify(data)} to ${endpoint.uri}/update`)
        })
        .catch(reason => {
          console.log(`Error sending update ${JSON.stringify(data)} to ${endpoint.uri}/update`)
        })
      })
    }
  }
}
