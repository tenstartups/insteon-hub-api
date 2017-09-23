var macaddress = require('macaddress')
var request = require('request-promise-native')
var SSDP = require('node-ssdp').Server
const camelCase = require('uppercamelcase')
const uuidv4 = require('uuid/v4')
const LISTEN_INTERFACE = process.env.LISTEN_INTERFACE || 'eth0'

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

    smartThingsNeworkId: function () {
      return `${process.env.INSTANCE_ID || '01'}${this.isyAddressCompact()}`
    },

    smartThingsName: function () {
      return `${this.smartThingsDeviceHandler()} [${this.isyAddress}]`
    },

    smartThingsDeviceHandler: function () {
      switch (this.isyType) {
        case 'DimmableLight':
          return 'Insteon Dimmer'
        case 'Light':
          return 'Insteon Switch'
        case 'Fan':
          return 'Insteon Fan Controller'
        case 'Outlet':
          return 'Insteon Switch'
        case 'Scene':
          return 'Insteon Scene'
        default:
          return 'Unknown'
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

    stateChanged: function () {
      this.sendSmartThingsUpdate(
        { status: this.isyDevice().getCurrentLightState() ? 'on' : 'off' }
      )
    },

    resetSmartThingsEndpoints: function () {
      this._smartThingsWebhookURIs = null
    },

    sendSmartThingsUpdate: function (data) {
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
          body: { device: this.toJSON(), data: data },
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
      var address = process.env.DEVICE_ADVERTISE_IP
      if (address === undefined) {
        address = require('ip').address()
        var ifaces = require('os').networkInterfaces()
        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].filter(details => {
            if (dev === LISTEN_INTERFACE && details.family === 'IPv4' && details.internal === false) {
              address = details.address
            }
          })
        })
      }
      return address
    },

    ssdpAdvertisePort: function () {
      var port = process.env.DEVICE_ADVERTISE
      if (port === undefined) {
        port = sails.config.port
      }
      return port
    },

    ssdpAdvertiseMAC: function () {
      macaddress.one(LISTEN_INTERFACE, (err, mac) => {
        if (err) {
          throw err
        }
        return mac.toUpperCase().replace(/:/g, '')
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
