var db = require('../../config/db')
var insteon = require('../../config/insteon')
var router = require('express').Router();

// Device list route
router.get('/devices', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json(db.getData('/devices'), null, 2)
})

// Device details route
router.get('/device/:insteon_id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  db.getData(`/devices/${req.params.insteon_id}`)
  .then(deviceInfo => {
    if(deviceInfo == undefined) {
      error = `Device with Insteon ID ${id} not registered`
      console.log(error)
      res.status(404).json({ error: error })
    } else {
      res.status(200).json(deviceInfo)
    }
  })
})

// Device creation route
router.post('/device/:insteon_id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log(`Creating Insteon device ${insteon_id}...`)
  hub.info(req.params.insteon_id)
  .then(deviceInfo => {
    if(deviceInfo == undefined) {
      error = `Device with Insteon ID ${id} unknown to Hub`
      console.log(error)
      res.status(404).json({ error: error })
    } else {
      db.push(`/devices/${req.params.insteon_id}`, deviceInfo)
      device = {
        usn: `${hub_id}:${req.params.insteon_id}`,
        name: req.params.insteon_id || `Insteon Device ${req.params.insteon_id}`
      }
      console.debug(JSON.stringify(device))
      res.status(200).json(device)
    }
  })
})

// Device update route
router.patch('/device/:insteon_id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log(`Creating Insteon device ${insteon_id}...`)
  hub.info(req.params.insteon_id)
  .then(deviceInfo => {
    if(deviceInfo == undefined) {
      error = `Device with Insteon ID ${id} unknown to Hub`
      console.log(error)
      res.status(404).json({ error: error })
    } else {
      db.push(`/devices/${req.params.insteon_id}`, deviceInfo)
      device = {
        usn: `${hub_id}:${req.params.insteon_id}`,
        name: req.params.insteon_id || `Insteon Device ${req.params.insteon_id}`
      }
      console.debug(JSON.stringify(device))
      res.status(200).json(device)
    }
  })
})

// Light status route
router.get('/devices/:id/info', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  var id = req.params.id
  console.log(`[${id}] Retrieving device info...`)
  hub.info(id)
  .then((result) => {
    if(result == undefined) {
      console.log(`[${id}] Device not found`)
      res.status(404).json({ error: 'Device not found!' })
    } else {
      console.log(`[${id}] Device info: ${JSON.stringify(result)}`)
      res.status(200).json(result)
    }
  })
})

// Light status route
router.get('/lights/:id/status', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  var id = req.params.id
  console.log(`[${id}] Retrieving light status...`)
  var light = hub.light(id)
  light.level()
  .then((result) => {
    if(result == undefined) {
      console.log(`[${id}] Device not found`)
      res.status(404).json({ error: 'Device not found!' })
    } else {
      console.log(`[${id}] Light level is ${result}`)
      res.status(200).json({ device_id: id, level: result })
    }
  })
})

// Light on route
router.get('/lights/:id/turn_on', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  var id = req.params.id
  console.log(`[${id}] Turning light ON...`)
  var light = hub.light(id)
  light.turnOn()
  .then((result) => {
    if(result.response) {
      console.log(`[${id}] Response: ${JSON.stringify(result.response)}`)
      res.status(200).json(result.response)
    } else {
      console.log(`[${id}] Device not found: ${JSON.stringify(result)}`)
      res.status(404).json({ error: 'Device not found!' })
    }
  })
})

// Light off route
router.get('/lights/:id/turn_off', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  var id = req.params.id
  console.log(`[${id}] Turning Light OFF...`)
  var light = hub.light(id)
  light.turnOff()
  .then((result) => {
    if(result.response) {
      console.log(`[${id}] Response: ${JSON.stringify(result.response)}`)
      res.status(200).json(result.response)
    } else {
      console.log(`[${id}] Device not found: ${JSON.stringify(result)}`)
      res.status(404).json({ error: 'Device not found!' })
    }
  })
})

module.exports = router;
