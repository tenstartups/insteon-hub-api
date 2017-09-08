module.exports = {

  status: (req, res) => {
    return res.json({
      todo: 'status() is not implemented yet!'
    })
  },

  off: (req, res) => {
    return res.json({
      todo: 'off() is not implemented yet!'
    })
  },

  low: (req, res) => {
    return res.json({
      todo: 'low() is not implemented yet!'
    })
  },

  medium: (req, res) => {
    return res.json({
      todo: 'medium() is not implemented yet!'
    })
  },

  high: (req, res) => {
    return res.json({
      todo: 'high() is not implemented yet!'
    })
  }
}

function unknownDevice (res, insteonId) {
  return res.notFound({ error: `Device with Insteon ID ${insteonId} unknown to Hub` })
}
