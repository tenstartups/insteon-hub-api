var JsonDB = require('node-json-db')

var db = new JsonDB(process.env.DATABASE_FILE, true, true)

try {
  db.getData('/devices')
  console.log(`Loaded database from ${process.env.DATABASE_FILE}...`)
} catch(error) {
  db.push('/devices', {})
  console.log(`Initialized database ${process.env.DATABASE_FILE}`)
}

module.exports = db
