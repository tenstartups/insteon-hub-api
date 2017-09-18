/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Insteon = require('home-controller').Insteon

function connectToHub () {
  return new Promise((resolve, reject) => {
    var settings = require('js-yaml')
                   .safeLoad(require('fs')
                   .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                   .hub
    var client = new Insteon()
    console.log(`Connecting to Insteon Hub (2245) at ${settings.host}:${settings.port}...`)
    client.httpClient(settings, () => {
      console.log(`Connected to Insteon Hub (2245) at ${settings.host}:${settings.port}`)
      console.log(`Retrieving Insteon Hub (2245) information...`)
      client.info()
      .then(hubInfo => {
        client.insteonId = hubInfo.id
        console.log(`Retrieved Insteon Hub (2245) information [${hubInfo.id}]`)
        resolve(client)
      }, reason => {
        reject(new Error(`Unable to connect to Insteon Hub (2245) at ${settings.host}:${settings.port}`))
      })
    })
  })
}

module.exports = {

  initSingleton: function () {
    return new Promise((resolve, reject) => {
      console.log('Initializing hub information...')
      connectToHub().then(client => {
        Hub.findOrCreate({ insteonId: client.insteonId }).exec((err, hub) => {
          if (err) {
            console.log('Error initializing hub information')
            reject(err)
          } else {
            hub.setInsteonClient(client)
            console.log('Initialized hub information')
            resolve(hub)
          }
        })
      }, reason => {
        console.log('Error initializing hub information')
        reject(reason)
      })
    })
  },

  attributes: {

    insteonId: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true
    },

    server: function () {
      return sails.hooks.server.singleton()
    },

    setInsteonClient: function (client) {
      this._insteonClient = client
    },

    insteonClient: function () {
      return this._insteonClient
    }
  }
}
