const jwt = require('jsonwebtoken')
const config = require('../config')

const errors = Object.freeze({
  castError: 'CastError',
  validationError: 'ValidationError',
  mongoError: 11000,
  jsonWebTokenError: 'JsonWebTokenError',
  tokenExpiredError: 'TokenExpiredError',
})

const gracefullyshutDownServer = (server) => {
  server.close(() => {
    process.exit(1)
  })
}

const generateJwt = (id) => {
  return jwt.sign({ id }, `${config.jwtKey}`, {
    expiresIn: `${config.jwtExpiration}`,
  })
}

module.exports = { errors, gracefullyshutDownServer, generateJwt }
