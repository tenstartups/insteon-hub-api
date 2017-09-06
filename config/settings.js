var settings = require('js-yaml').safeLoad(require('fs').readFileSync(process.env.CONFIG_FILE, 'utf8'))

console.log(`Loaded configuration from ${process.env.CONFIG_FILE}`)

module.exports = settings
