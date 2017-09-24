var camelCase = require('uppercamelcase')
var crypto = require('crypto');
var request = require('request-promise-native')
var SSDP = require('node-ssdp').Server
const uuidv4 = require('uuid/v4')

const settings = require('js-yaml')
                 .safeLoad(require('fs')
                 .readFileSync(process.env.SETTINGS_FILE, 'utf8'))

function loadSmartThingsAppEndpoints (token) {
  return new Promise((resolve, reject) => {
    var options = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      uri: 'https://graph.api.smartthings.com/api/smartapps/endpoints',
      json: true
    }
    request(options)
    .then(result => {
      console.log(result)
      resolve(result)
    })
    .catch(reason => {
      reject(reason)
    })
  })
}

module.exports = {

  tableName: 'device',

  findTypedDevice: function (isyDevice) {
    return new Promise((resolve, reject) => {
      eval(isyDevice.deviceType).findOne(
        { isyType: isyDevice.deviceType, isyAddress: isyDevice.address }
      ).exec((err, device) => {
        if (err) {
          console.log(`Error fetching ${isyDevice.deviceType} device with ISY address ${isyDevice.address}`)
          reject(err)
        }
        resolve(device)
      })
    })
  },

  attributes: {

    id: {
      type: 'string',
      primaryKey: true,
      defaultsTo: function () { return uuidv4() },
      unique: true,
      index: true,
      uuidv4: true
    },

    isyType: {
      type: 'string',
      enum: ['Light', 'DimmableLight', 'Fan', 'Outlet', 'Scene'],
      required: true
    },

    isyAddress: {
      type: 'string',
      required: true,
      unique: true,
      index: true
    },

    model: {
      type: 'string',
      required: false
    },

    name: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      required: true
    },

    isAdvertised: {
      type: 'boolean',
      defaultsTo: true
    },

    statusRefreshInterval: {
      type: 'integer',
      defaultsTo: 300
    },

    smartThingsToken: {
      type: 'string'
    },

    externalId: function () {
      var key = `isy:${settings.isy.id || '01'}:${this.isyType}:${this.isyAddress}`
      return crypto.createHash('md5').update(key).digest('hex')
    },

    displayType: function () {
      return `ISY ${this.isyType} [${this.isyAddress}]`
    },

    displayName: function () {
      return `${settings.devices.name_prefix || ''} ${this.name} ${settings.devices.name_suffix || ''}`.trim()
    },

    ssdpUSN: function () {
      return `urn:schemas-upnp-org:device:isy:${this.isyType}:1`
    },

    ssdpUDN: function () {
      return `uid:${this.externalId()}`
    },

    ssdpLocation: function () {
      return `http://${this.ssdpAdvertiseIP()}:${this.ssdpAdvertisePort()}/api/device/${this.id}`
    },

    ssdpAdvertiseIP: function () {
      return sails.hooks.ssdp.advertiseIP()
    },

    ssdpAdvertisePort: function () {
      return sails.hooks.ssdp.advertisePort()
    },

    ssdpAdvertiseMAC: function () {
      return sails.hooks.ssdp.advertiseMAC()
    },

    toJSON: function () {
      return {
        id: this.id,
        isy_type: this.isyType,
        isy_address: this.isyAddress,
        model: this.model,
        name: this.name,
        description: this.description,
        external_id: this.externalId(),
        display_type: this.displayType(),
        display_name: this.displayName(),
        mac_address: this.ssdpAdvertiseMAC(),
        ip_address: this.ssdpAdvertiseIP(),
        ip_port: this.ssdpAdvertisePort()
      }
    },

    isyDevice: function () {
      return sails.hooks.isy.connection().getDevice(this.isyAddress)
    },

    resetSmartThingsEndpoints: function () {
      this._smartThingsWebhookURIs = null
    },

    sendSmartThingsUpdate: function () {
      var body = { device: this.toJSON(), data: this.getStatus() }

      if (!this.smartThingsToken) {
        return null
      }

      if (!this._smartThingsWebhookURIs) {
        loadSmartThingsAppEndpoints(this.smartThingsToken).then(result => {
          this._smartThingsWebhookURIs = result.map(r => { return r.uri })
        })
      }

      this._smartThingsWebhookURIs.forEach(endpoint => {
        var options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.smartThingsToken}`
          },
          uri: `${endpoint.uri}/update`,
          body: body,
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
    },

    ssdpAdvertise: function () {
      console.log(`Starting SSDP server advertising for USN: ${this.ssdpUSN()}, UDN: ${this.ssdpUDN()}, Location: ${this.ssdpLocation()}...`)

      var ssdp = new SSDP(
        {
          location: this.ssdpLocation(),
          udn: this.ssdpUDN(),
          sourcePort: 1900
        }
      )

      ssdp.addUSN(this.ssdpUSN())

      ssdp.on('advertise-alive', (headers) => {
        // Expire old devices from your cache.
        // Register advertising device somewhere (as designated in http headers heads)
        // console.log(`Advertise alive for USN: ${usn}, UDN: ${device.ssdpUDN()}, Location: ${location}`)
      })

      ssdp.on('advertise-bye', (headers) => {
        // Remove specified device from cache.
        // console.log(`Advertise bye for USN: ${usn}, UDN: ${device.ssdpUDN()}, Location: ${location}`)
      })

      ssdp.start()

      process.on('exit', () => {
        // Advertise shutting down and stop listening
        ssdp.stop()
      })

      console.log(`Started SSDP server advertising for USN: ${this.ssdpUSN()}, UDN: ${this.ssdpUDN()}, Location: ${this.ssdpLocation()}`)

      return ssdp
    }
  }
}
