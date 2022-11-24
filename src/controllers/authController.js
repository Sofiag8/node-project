const { promisify } = require('util')
const crypto = require('crypto')
const AppError = require('../utils/appError')
const UserModel = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('../utils/email')
const { generateJwt } = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/userModel')

const signup = catchAsync(async (request, response, next) => {
  const createdUser = await UserModel.create({
    name: request.body.name,
    role: request.body.role,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  })
  const token = generateJwt(createdUser._id)

  response.status(201).json({
    status: 'success',
    user: createdUser,
    token,
  })
})

const login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400))
  }

  const user = await UserModel.findOne({ email }).select('password')
  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  const token = generateJwt(user._id)

  response.status(201).json({
    status: 'success',
    token,
  })
})

// middleware function to tour routes
const isAuthenticated = catchAsync(async (request, response, next) => {
  let token
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('User is not currently logged in', 401))
  }

  const decoded = await promisify(jwt.verify)(token, config.jwtKey)

  const checkUserExists = await UserModel.findById(decoded.id)
  if (!checkUserExists) {
    return next(
      new AppError(
        'User belonging to token payload id does not exist anymore ',
        401
      )
    )
  }

  if (checkUserExists.checkIfPasswordHasChanged(decoded.iat)) {
    return next(new AppError('User has changed password, log in again', 401))
  }

  request.user = checkUserExists
  next()
})

const isAuthorized = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('User is not authorized to perform this action', 403)
      )
    }
    next()
  }
}

const forgotPassword = catchAsync(async (request, response, next) => {
  const user = await UserModel.findOne({ email: request.body.email })
  if (!user) {
    return next(new AppError('Email not found', 404))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${request.protocol}://${request.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and 
  password confirmation to: ${resetUrl}. If you didn't forget your password, please ignore this email`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    })
    response.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    return next(
      new AppError('There was an error sending the email, try again later', 500)
    )
  }
})

const resetPassword = catchAsync(async (request, response, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex')

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = request.body.password
  user.passwordConfirm = request.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  const token = generateJwt(user._id)

  response.status(201).json({
    status: 'success',
    token,
  })
})

module.exports = {
  isAuthenticated,
  forgotPassword,
  resetPassword,
  isAuthorized,
  signup,
  login,
}
