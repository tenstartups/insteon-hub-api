const ISY = require('isy-js')
const QUEUE = require('queue')
const ISY_SETTINGS = require('js-yaml')
                     .safeLoad(require('fs')
                     .readFileSync(process.env.SETTINGS_FILE, 'utf8'))
                     .isy || {}

function processEvent (isyDevice) {
  console.log(`Processing event for ${isyDevice.deviceType} [${isyDevice.address}]`)
  Device.findTyped({ type: isyDevice.deviceType, address: isyDevice.address })
  .then(device => {
    device.sendSmartThingsUpdate()
  })
  .catch(err => {
    throw err
  })
}

module.exports = (sails) => {
  var connection
  var devices
  var eventQ

  function loadDevices () {
    var newDevices = {}
    connection.getDeviceList().forEach(device => {
      newDevices[device.address] = device
    })
    devices = newDevices
  }

  return {
    devices: () => {
      return Object.values(devices)
    },

    device: (address) => {
      return devices[address]
    },

    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 120000
       }
    },

    initialize: (cb) => {
      sails.after('hook:orm:loaded', () => {
        console.log('Connecting to ISY994i home automation controller...')

        eventQ = QUEUE({ concurrency: 10 })

        IntervalTimerService.interval(() => {
          eventQ.start(err => {
            if (err) {
              throw err
            }
          })
        }, 100)

        connection = new ISY.ISY(
          ISY_SETTINGS.address,
          ISY_SETTINGS.user,
          ISY_SETTINGS.password,
          false, // No support for ELK
          (isy, isyDevice) => {
            eventQ.push(() => {
              return new Promise((resolve, reject) => {
                processEvent(isyDevice)
                resolve()
              })
            })
          },
          ISY_SETTINGS.useSSL,
          true, // Include scenes in the device list
          ISY_SETTINGS.debug,
          (isy, device) => {} // Variable changed callback
        )

        // Initialize the connection then load the device list
        connection.initialize(() => {
          console.log('Connected to ISY994i home automation controller')
          loadDevices()
          console.log(`Loaded ${Object.keys(devices).length} devices from ISY994i home automation controller...`)
          cb()
        })

        // Start a timer to periodically reload the device list
        // IntervalTimerService.interval(async () => {
        //   console.log('Reloading devices from ISY994i home automation controller...')
        //   connection.initialize(async () => {
        //     loadDevices()
        //     console.log(`Reloaded ${Object.keys(devices).length} devices from ISY994i home automation controller...`)
        //   })
        // }, 300000)
      })
    }
  }
}
