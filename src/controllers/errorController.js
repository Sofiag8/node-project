const { productionError, developmentError } = require('../utils/customError')

const errorController = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    developmentError(error, response)
  } else if (process.env.NODE_ENV === 'production') {
    productionError(error, response)
  }
}

module.exports = errorController
