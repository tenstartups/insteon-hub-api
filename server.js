express = require('express')

const LISTEN_ADDRESS = '0.0.0.0'
const LISTEN_PORT = process.env.LISTEN_PORT

async function start() {
  try {
    var utils = await require('./config/utils')
    var settings = await require('./config/settings')
    var db = await require('./config/db')
    var insteon = await require('./config/insteon')
    console.log(insteon)
    var ssdp = await require('./config/ssdp')
    var subscriptions = await require('./config/devices')

    var app = express()

    app.use(require('./routes'));

    app.listen(LISTEN_PORT, LISTEN_ADDRESS, () => {
      console.log(`Express server listening on http://${LISTEN_ADDRESS}:${LISTEN_PORT}`)
    });
  }
  catch (rejectedValue) {
    console.log(rejectedValue)
  }
}

start()
