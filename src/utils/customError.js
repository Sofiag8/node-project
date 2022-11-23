const AppError = require('./appError')
const { errors } = require('./index')

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
  let err = { ...error }
  err = switchErrorCases({
    errorCase: error.code === errors.mongoError ? error.code : error.name,
    err,
  })
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    response.status(err.statusCode).json({
      status: err.status,
      message: err.message,
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

module.exports = {
  productionError,
  developmentError,
  handleCastErrorDb,
  handleValidationErrorDb,
  handleDuplicatedErrorDb,
}
