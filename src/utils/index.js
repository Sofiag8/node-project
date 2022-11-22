const errors = Object.freeze({
  castError: 'CastError',
  validationError: 'ValidationError',
  mongoError: 11000,
})

const gracefullyshutDownServer = (server) => {
  server.close(() => {
    process.exit(1)
  })
}

module.exports = { errors, gracefullyshutDownServer }
