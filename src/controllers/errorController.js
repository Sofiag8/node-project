const AppError = require('../utils/appError')
const { errors } = require('../utils')

const handleCastErrorDb = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`
  return new AppError(message, 400)
}

const handleDuplicatedErrorDb = (error) => {
  const message = `Duplicated field value: ${error.keyValue.name}, please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDb = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const switchErrorCases = ({ errorCase, err }) => {
  switch (errorCase) {
    case errors.castError:
      return (err = handleCastErrorDb(err))
    case errors.mongoError:
      return (err = handleDuplicatedErrorDb(err))
    case errors.validationError:
      return (err = handleValidationErrorDb(err))
  }
}

const developmentError = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  })
}

const productionError = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    })
    // Programming or other unknown error: don't leak error details
  } else {
    // console.error('===== ERROR =====', error)
    response.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    })
  }
}

const errorController = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    developmentError(error, response)
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error }
    err = switchErrorCases({
      errorCase: error.code === 11000 ? error.code : error.name,
      err,
    })
    productionError(err, response)
  }
}

module.exports = errorController
