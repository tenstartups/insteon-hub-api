var request = require('request-promise-native')
var SSDP = require('node-ssdp').Server
const camelCase = require('uppercamelcase')
const uuidv4 = require('uuid/v4')

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
      var deviceType
      switch (isyDevice.deviceType) {
        case 'Light':
          deviceType = Switch
          break
        case 'DimmableLight':
          deviceType = Dimmer
          break
        case 'Fan':
          deviceType = Fan
          break
        case 'Outlet':
          deviceType = Switch
          break
        case 'Scene':
          deviceType = Scene
          break
      }
      deviceType.findOne({ isyAddress: isyDevice.address }).exec((err, device) => {
        if (err) {
          console.log(`Error fetching device record for ${device.address}`)
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

    name: {
      type: 'string',
      required: true
    },

    isAdvertised: {
      type: 'boolean',
      defaultsTo: true
    },

    refreshSeconds: {
      type: 'integer',
      defaultsTo: 300
    },

    smartThingsToken: {
      type: 'string'
    },

    isyAddressCompact: function () {
      return this.isyAddress.replace(/[ ]/g, '')
    },

    smartThingsName: function () {
      return `${this.smartThingsDeviceHandler()} [${this.isyAddress}]`
    },

    smartThingsDeviceHandler: function () {
      switch (this.isyType) {
        case 'DimmableLight':
          return 'ISY Insteon Dimmer'
        case 'Light':
          return 'ISY Insteon Switch'
        case 'Fan':
          return 'ISY Insteon Fan'
        case 'Outlet':
          return 'ISY Insteon Switch'
        case 'Scene':
          return 'ISY Insteon Scene'
      }
    },

    toJSON: function () {
      return {
        id: this.id,
        isy_type: this.isyType,
        isy_address: this.isyAddress,
        name: `${process.env.DEVICE_NAME_PREFIX || ''} ${this.name} ${process.env.DEVICE_NAME_SUFFIX || ''}`.trim(),
        description: this.description,
        smart_things_network_id: this.smartThingsNeworkId(),
        smart_things_name: this.smartThingsName(),
        smart_things_device_handler: this.smartThingsDeviceHandler(),
        refresh_seconds: this.refreshSeconds,
        is_advertised: this.isAdvertised,
        udn: this.ssdpUDN(),
        ip: this.ssdpAdvertiseIP(),
        port: this.ssdpAdvertisePort(),
        mac: this.ssdpAdvertiseMAC()
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

    ssdpUSN: function () {
      return `urn:schemas-upnp-org:device:isy:Insteon${this.isyType}:1`
    },

    ssdpUDN: function () {
      return `uuid:${this.id}`
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
