var singleton = function singleton () {
  var devices = {}

  this.get = function (deviceId) {
    if (!devices[deviceId]) {
      throw new Error(`Device ${deviceId} not in list`)
    }
    return devices[deviceId]
  }

  this.set = function (device) {
    if (devices[device.insteonId]) {
      throw new Error(`Device ${device.insteonId} already added`)
    }
    devices[device.insteonId] = device
  }

  this.update = function (device) {
    if (!devices[device.insteonId]) {
      throw new Error(`Device ${device.insteonId} not in list`)
    }
    var existing = devices[device.insteonId]
    existing.name = device.name
    existing.label = device.label
  }

  this.delete = function (deviceId) {
    if (!devices[deviceId]) {
      throw new Error(`Device ${deviceId} not in list`)
    }
    delete devices[deviceId]
  }

  if (singleton.caller !== singleton.getInstance) {
    throw new Error('This object cannot be instanciated')
  }
}

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
singleton.instance = null

/**
 * Singleton getInstance definition
 * @return singleton class
 */
singleton.getInstance = function () {
  if (this.instance === null) {
    this.instance = new singleton()
  }
  return this.instance
}

module.exports = singleton.getInstance()
