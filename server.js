express = require('express')

const LISTEN_ADDRESS = '0.0.0.0'
const LISTEN_PORT = process.env.LISTEN_PORT

var utils = require('./config/utils')
var settings = require('./config/settings')
var db = require('./config/db')
var insteon = require('./config/insteon')
var ssdp = require('./config/ssdp')
var subscriptions = require('./config/devices')

var app = express()

app.use(require('./routes'));

app.listen(LISTEN_PORT, LISTEN_ADDRESS, () => {
  console.log(`Express server listening on http://${LISTEN_ADDRESS}:${LISTEN_PORT}`)
});
