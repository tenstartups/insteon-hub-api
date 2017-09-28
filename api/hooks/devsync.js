module.exports = (sails) => {
  function deleteObsolete () {
    return new Promise((resolve, reject) => {
      console.log('Deleting obsolete device records...')
      Device.destroy(
        { address: { '!': sails.hooks.isy.devices().map(d => { return d.address }) } }
      ).exec((err, records) => {
        if (err) {
          console.log('Error deleting obsolete device records')
          reject(err)
        }
        console.log(`Deleted ${records.length} obsolete device records`)
        resolve(records.length)
      })
    })
  }

  function createMissing () {
    return new Promise((resolve, reject) => {
      console.log('Creating missing device records...')
      Device.find().exec((err, devices) => {
        if (err) {
          console.log('Error loading existing device records')
          reject(err)
        }
        var missingDevices = sails.hooks.isy.devices().filter(isyDevice => {
          return !devices.find(record => {
            return record.address === isyDevice.address
          })
        })
        if (missingDevices.length === 0) {
          console.log('Created 0 missing device records')
          return resolve(0)
        }
        Device.findOrCreate(
          missingDevices.map(d => { return { address: d.address } }),
          missingDevices.map(d => { return { address: d.address, type: d.deviceType, name: d.name } })
        ).exec((err, records) => {
          if (err) {
            console.log('Error creating missing device records')
            reject(err)
          }
          console.log(`Created ${records.length} missing device records`)
          resolve(records.length)
        })
      })
    })
  }

  function updateExisting () {
    return new Promise((resolve, reject) => {
      console.log('Updating device names...')
      Device.find().exec((err, devices) => {
        if (err) {
          console.log('Error loading existing device records')
          reject(err)
        }
        var staleDevices = sails.hooks.isy.devices().filter(isyDevice => {
          var existingDevice = devices.find(record => {
            return record.address === isyDevice.address
          })
          return existingDevice.name !== isyDevice.name
        })
        var updatePromises = staleDevices.map(d => {
          return new Promise((resolve, reject) => {
            Device.update({ address: d.address }, { name: d.name }).exec((err, records) => {
              if (err) {
                console.log(`Error updating device ${d.name}`)
                reject(err)
              }
              resolve(records.length)
            })
          })
        })
        Promise.all(updatePromises).then(results => {
          var updated = results.reduce(function (pv, cv) { return pv + cv }, 0)
          console.log(`Updated ${updated} device records`)
          resolve(updated)
        }, reason => {
          reject(reason)
        })
      })
    })
  }

  function sendCurrentStatus () {
    return new Promise((resolve, reject) => {
      console.log('Sending current status of devices to SmartThings...')
      Device.find({
        isAdvertised: true,
        smartThingsToken: { '!': null },
        smartThingsAppCallbackURIs: { '!': null }
      }).exec((err, devices) => {
        if (err) {
          reject(err)
        }
        devices.forEach(device => {
          Device.findTyped({ id: device.id, type: device.type })
          .then(device => {
            device.sendSmartThingsUpdate()
          })
          .catch(err => {
            console.log('Error sending current status of devices to SmartThings')
            reject(err)
          })
        })
        console.log(`Sent current status of ${devices.length} devices to SmartThings`)
        resolve(devices.length)
      })
    })
  }

  async function synchronizeDevices () {
    console.log('Synchronizing devices from ISY994i home automation controller...')
    await deleteObsolete()
    await createMissing()
    await updateExisting()
    await sendCurrentStatus()
    console.log('Synchronized devices from ISY994i home automation controller')
  }

  return {
    configure: () => {
    },

    defaults: {
       __configKey__: {
          _hookTimeout: 120000
       }
    },

    initialize: (cb) => {
      sails.after('hook:isy:loaded', async () => {
        await synchronizeDevices()
        IntervalTimerService.interval(async () => {
          await synchronizeDevices()
        }, 30000)
        cb()
      })
    }
  }
}
