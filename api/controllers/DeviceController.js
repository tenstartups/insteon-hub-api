/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `DeviceController.index()`
   */
  index: function (req, res) {
    return res.json({
      todo: 'index() is not implemented yet!'
    })
  },

  /**
   * `DeviceController.show()`
   */
  show: function (req, res) {
    return res.json({
      todo: 'show() is not implemented yet!'
    })
  },

  /**
   * `DeviceController.create()`
   */
  create: function (req, res) {
    var insteonId = req.params.insteon_id
    var hub = sails.hooks.insteon_hub.client()
    hub.info(insteonId)
    .then(deviceInfo => {
      if (deviceInfo === undefined) {
        return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
      } else {
        var result = Device.create(
          {
            udn: `${hub.insteon_id}:${insteonId}`,
            name: insteonId || `Insteon Device ${insteonId}`
          }
        )
        console.log(result)
        return res.json(result)
      }
    })
  },

  /**
   * `DeviceController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    })
  },

  /**
   * `DeviceController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    })
  }
}
